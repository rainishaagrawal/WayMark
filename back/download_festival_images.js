import mongoose from 'mongoose';
import Festival from './src/models/Festival.js';
import Destination from './src/models/Destination.js';
import fs from 'fs';
import path from 'path';
import https from 'https';

const uri = 'mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0';

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else if (res.statusCode === 301 || res.statusCode === 302) {
                downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
            } else {
                res.resume();
                reject(new Error("Request Failed With a Status Code: " + res.statusCode));
            }
        }).on('error', reject);
    });
};

const run = async () => {
    try {
        await mongoose.connect(uri);
        const festivals = await Festival.find({}).populate('destination');
        const publicDir = path.join(process.cwd(), '../front/public/festivals');
        
        for (const fest of festivals) {
            const destName = fest.destination ? fest.destination.name : "Global";
            const filename = fest._id.toString() + ".jpg";
            const filepath = path.join(publicDir, filename);
            
            // Generate prompt and url
            const prompt = "High quality professional photography of " + fest.name + " in " + destName + ", realistic, vibrant, award winning photo";
            const encodedPrompt = encodeURIComponent(prompt);
            const url = "https://image.pollinations.ai/prompt/" + encodedPrompt + "?width=800&height=600&nologo=true";
            
            console.log("Downloading for " + fest.name + "...");
            try {
                await downloadImage(url, filepath);
                fest.image = "/festivals/" + filename;
                await fest.save();
                console.log("Saved " + fest.name);
            } catch (err) {
                console.error("Failed to download for " + fest.name, err);
            }
            
            // Sleep 3 seconds to avoid rate limiting
            await new Promise(r => setTimeout(r, 3000));
        }
        console.log("Done downloading all festival images!");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

run();
