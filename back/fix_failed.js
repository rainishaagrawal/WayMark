import mongoose from 'mongoose';
import Festival from './src/models/Festival.js';
import Destination from './src/models/Destination.js';
import { getDestinationImage } from './src/utils/destinationImageHelper.js';

const uri = 'mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0';

const run = async () => {
    try {
        await mongoose.connect(uri);
        const festivals = await Festival.find({}).populate('destination');
        let count = 0;
        
        for (const fest of festivals) {
            // If the image is still a pollinations.ai link, replace it with Unsplash
            if (fest.image.includes('pollinations.ai') || fest.image.includes('loremflickr')) {
                const destName = fest.destination ? fest.destination.name : "Global";
                fest.image = getDestinationImage(destName);
                await fest.save();
                console.log("   -> Fallback applied for: " + fest.name);
                count++;
            }
        }
        
        console.log("Updated fallbacks: " + count);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

run();
