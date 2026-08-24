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
                    if (parsed.error) {
                        console.log("Wiki Error:", parsed.error.info);
                    }
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
                    console.error("Parse error:", e);
                    resolve(null);
                }
            });
        }).on('error', (e) => {
            console.error("Req error:", e);
            resolve(null);
        });
    });
};

const run = async () => {
    await mongoose.connect(uri);
    const fest = await Festival.findOne({ name: 'Oktoberfest' });
    console.log("Found:", fest.name);
    const img = await getWikiImage(fest.name);
    console.log("Image:", img);
    process.exit(0);
};

run();
