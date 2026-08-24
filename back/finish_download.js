import mongoose from 'mongoose';
import Festival from './src/models/Festival.js';
import Destination from './src/models/Destination.js';
import fs from 'fs';
import path from 'path';
import https from 'https';

const uri = 'mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0';

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            }
        }, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(filepath);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(filepath);
                });
            } else if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
                downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
            } else {
                reject(new Error("HTTP " + res.statusCode));
            }
        }).on('error', reject);
    });
};

const run = async () => {
    try {
        await mongoose.connect(uri);
        const festivals = await Festival.find({}).populate('destination');
        const publicDir = path.join(process.cwd(), '../front/public/festivals');
        
        let processed = 0;
        for (const fest of festivals) {
            const destName = fest.destination ? fest.destination.name : "Global";
            const filename = fest._id.toString() + ".jpg";
            const filepath = path.join(publicDir, filename);
            
            // Wait, we ONLY want to download the missing ones for the user!
            // BUT wait! The DB right now has Wikipedia URLs! (Because of task-4893 fix_with_curl).
            // We want to REVERT back to local AI images for ALL of them!
            // Let's just download them all locally and set the image to local!
            
            if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
                if (fest.image !== "/festivals/" + filename) {
                    fest.image = "/festivals/" + filename;
                    await fest.save();
                }
                continue;
            }
            
            const prompt = "High quality professional photography of " + fest.name + " in " + destName + ", realistic, vibrant, award winning photo";
            const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt) + "?width=800&height=600&nologo=true";
            
            console.log("Downloading missing: " + fest.name);
            
            let success = false;
            while (!success) {
                try {
                    await downloadImage(url, filepath);
                    
                    if (fs.statSync(filepath).size > 1000) {
                        fest.image = "/festivals/" + filename;
                        await fest.save();
                        console.log(" -> Saved " + fest.name);
                        success = true;
                    } else {
                        throw new Error("Empty file");
                    }
                } catch (err) {
                    console.log(" -> Failed (" + err.message + "), waiting 15s...");
                    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
                    await new Promise(r => setTimeout(r, 15000));
                }
            }
            processed++;
            await new Promise(r => setTimeout(r, 5000));
        }
        console.log("Done downloading remaining " + processed + " images!");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

run();
