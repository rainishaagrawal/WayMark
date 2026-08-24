import mongoose from 'mongoose';
import DestinationSticker from './src/models/DestinationSticker.js';
import { generateDestinationSticker } from './src/services/stickerService.js';

const uri = 'mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0';

const run = async () => {
    try {
        await mongoose.connect(uri);
        const deleted = await DestinationSticker.deleteMany({
            destination: { $regex: new RegExp('^greece$', 'i') }
        });
        console.log("Deleted old Greece stickers:", deleted.deletedCount);
        const newSticker = await generateDestinationSticker("Greece");
        console.log("New Greece sticker generated:", newSticker);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

run();
