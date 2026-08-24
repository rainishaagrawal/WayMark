import mongoose from 'mongoose';
import Festival from './src/models/Festival.js';
import Destination from './src/models/Destination.js';
import { execSync } from 'child_process';

const uri = 'mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0';

const getWikiImageCurl = (query) => {
    if (!query) return null;
    try {
        const url = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=" + encodeURIComponent(query) + "&gsrlimit=3&prop=pageimages&format=json&piprop=original";
        const stdout = execSync("curl.exe -s -A \"Mozilla/5.0\" \"" + url + "\"");
        const parsed = JSON.parse(stdout.toString());
        const pages = parsed.query && parsed.query.pages;
        if (pages) {
            for (const page of Object.values(pages)) {
                if (page && page.original && page.original.source && !page.original.source.endsWith('.svg')) {
                    return page.original.source;
                }
            }
        }
    } catch (e) {}
    return null;
};

const run = async () => {
    try {
        await mongoose.connect(uri);
        const festivals = await Festival.find({}).populate('destination');
        let count = 0;
        
        for (const fest of festivals) {
            console.log("Processing " + fest.name + "...");
            
            let imgUrl = getWikiImageCurl(fest.name);
            if (!imgUrl) {
                imgUrl = getWikiImageCurl(fest.name + " festival");
            }
            if (!imgUrl) {
                if (fest.destination && fest.destination.name && fest.destination.name !== 'Global') {
                    let dName = fest.destination.name.split(',')[0]; 
                    imgUrl = getWikiImageCurl(dName + " landmark");
                }
            }
            
            if (imgUrl) {
                fest.image = imgUrl;
                await fest.save();
                console.log("   -> Saved: " + imgUrl);
                count++;
            } else {
                console.log("   -> Failed to find ANY image for " + fest.name);
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
