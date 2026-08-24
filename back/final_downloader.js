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
        
        if (!fs.existsSync(publicDir)){
            fs.mkdirSync(publicDir, { recursive: true });
        }
        
        let processed = 0;
        for (const fest of festivals) {
            const destName = fest.destination ? fest.destination.name : "Global";
            const filename = fest._id.toString() + ".jpg";
            const filepath = path.join(publicDir, filename);
            
            // Skip if already downloaded
            if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
                if (fest.image !== "/festivals/" + filename) {
                    fest.image = "/festivals/" + filename;
                    await fest.save();
                }
                continue;
            }
            
            const prompt = "High quality professional photography of " + fest.name + " in " + destName + ", realistic, vibrant, award winning photo";
            const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt) + "?width=800&height=600&nologo=true";
            
            console.log("Downloading: " + fest.name);
            
            let success = false;
            let attempts = 0;
            while (!success && attempts < 3) {
                attempts++;
                try {
                    await downloadImage(url, filepath);
                    
                    // Verify file isn't empty HTML
                    if (fs.statSync(filepath).size > 1000) {
                        fest.image = "/festivals/" + filename;
                        await fest.save();
                        console.log(" -> Saved " + fest.name);
                        success = true;
                    } else {
                        throw new Error("File too small, probably rate limit page");
                    }
                } catch (err) {
                    console.log(" -> Attempt " + attempts + " failed: " + err.message);
                    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
                    await new Promise(r => setTimeout(r, 5000));
                }
            }
            
            if (success) {
                processed++;
                // Wait 4 seconds between requests to avoid rate limit
                await new Promise(r => setTimeout(r, 4000));
            }
        }
        
        console.log("Finished downloading all " + processed + " missing images!");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

run();
