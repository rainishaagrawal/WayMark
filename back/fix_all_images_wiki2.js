import mongoose from 'mongoose';
import Festival from './src/models/Festival.js';
import https from 'https';

const uri = 'mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0';

const getWikiImage = (query) => {
    return new Promise((resolve) => {
        const url = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=" + encodeURIComponent(query) + "&gsrlimit=3&prop=pageimages&format=json&piprop=original";
        https.get(url, { headers: { 'User-Agent': 'WayMark/1.0 (contact@example.com)' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query && parsed.query.pages;
                    if (pages) {
                        for (const page of Object.values(pages)) {
                            if (page && page.original && page.original.source) {
                                resolve(page.original.source);
                                return;
                            }
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
        const festivals = await Festival.find({});
        let count = 0;
        
        for (const fest of festivals) {
            console.log("Processing " + fest.name + "...");
            await new Promise(r => setTimeout(r, 500)); 
            
            let imgUrl = await getWikiImage(fest.name);
            if (!imgUrl) {
                await new Promise(r => setTimeout(r, 500)); 
                imgUrl = await getWikiImage(fest.name + " festival");
            }
            if (imgUrl) {
                fest.image = imgUrl;
                await fest.save();
                console.log("   -> Saved Wiki URL: " + imgUrl);
                count++;
            } else {
                console.log("   -> Failed to find image for " + fest.name);
            }
        }
        
        console.log("Updated festivals with real wiki images: " + count);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

run();
