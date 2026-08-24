import mongoose from 'mongoose';
import Festival from './src/models/Festival.js';

const uri = 'mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0';

const run = async () => {
    await mongoose.connect(uri);
    const f = await Festival.findOne({ name: 'Sapporo Snow Festival' });
    console.log(f.name + ": " + f.image);
    process.exit(0);
};

run();
