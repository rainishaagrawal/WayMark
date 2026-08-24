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
            } else if (res.statusCode === 429) {
                reject(new Error("429"));
            } else {
                res.resume();
                reject(new Error("Status Code: " + res.statusCode));
            }
        }).on('error', reject);
    });
};

const getWikiImage = (title) => {
    return new Promise((resolve) => {
        const url = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=" + encodeURIComponent(title) + "&gsrlimit=1&prop=pageimages&format=json&piprop=original";
        https.get(url, { headers: { 'User-Agent': 'WayMark/1.0 (contact@example.com)' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query && parsed.query.pages;
                    if (pages) {
                        const firstPage = Object.values(pages)[0];
                        if (firstPage && firstPage.original && firstPage.original.source) {
                            resolve(firstPage.original.source);
                            return;
                        }
                    }
                    resolve(null);
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
};

const run = async () => {
    try {
        await mongoose.connect(uri);
        const festivals = await Festival.find({}).populate('destination');
        const publicDir = path.join(process.cwd(), '../front/public/festivals');
        
        for (const fest of festivals) {
            console.log("Processing " + fest.name + "...");
            
            // Try Wikipedia first (it's fast and real photos)
            let imgUrl = await getWikiImage(fest.name);
            await new Promise(r => setTimeout(r, 1000)); // Be nice to Wiki API
            
            if (imgUrl) {
                fest.image = imgUrl;
                await fest.save();
                console.log("   -> Saved Wiki URL: " + imgUrl);
                continue;
            }
            
            // If Wiki fails, generate with Pollinations and save locally
            const destName = fest.destination ? fest.destination.name : "Global";
            const filename = fest._id.toString() + ".jpg";
            const filepath = path.join(publicDir, filename);
            
            // Skip if already downloaded
            if (fs.existsSync(filepath)) {
                fest.image = "/festivals/" + filename;
                await fest.save();
                console.log("   -> Already downloaded locally.");
                continue;
            }

            const prompt = "High quality professional photography of " + fest.name + " in " + destName + ", realistic, vibrant, award winning photo";
            const encodedPrompt = encodeURIComponent(prompt);
            const pollUrl = "https://image.pollinations.ai/prompt/" + encodedPrompt + "?width=800&height=600&nologo=true";
            
            let success = false;
            let attempts = 0;
            while (!success && attempts < 5) {
                try {
                    attempts++;
                    await downloadImage(pollUrl, filepath);
                    fest.image = "/festivals/" + filename;
                    await fest.save();
                    console.log("   -> Saved Pollinations AI image locally.");
                    success = true;
                } catch (err) {
                    if (err.message === "429") {
                        console.log("   -> 429 Rate Limit. Waiting 10s...");
                        await new Promise(r => setTimeout(r, 10000));
                    } else {
                        console.error("   -> Failed: " + err.message);
                        break;
                    }
                }
            }
        }
        
        console.log("Done updating all festival images!");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

run();
