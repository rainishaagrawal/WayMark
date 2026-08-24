import mongoose from 'mongoose';
import Festival from './src/models/Festival.js';

const uri = 'mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0';

const run = async () => {
    try {
        await mongoose.connect(uri);
        const fests = await Festival.find({}).limit(3);
        console.log(fests.map(f => f.image));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
};

run();
