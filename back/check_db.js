import mongoose from 'mongoose';
import Festival from './src/models/Festival.js';

const uri = 'mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0';

const run = async () => {
    await mongoose.connect(uri);
    const fests = await Festival.find({});
    for (let f of fests) {
        console.log(f.name + " => " + f.image.substring(0, 50));
    }
    process.exit(0);
};

run();
