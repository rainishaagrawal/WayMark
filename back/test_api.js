import mongoose from 'mongoose';
import { generateTripItinerary } from './src/services/aiService.js';
import User from './src/models/User.js';
import { callGroqAPI } from './src/config/aiConfig.js';
// Monkey patch to log error
import * as aiConfig from './src/config/aiConfig.js';
const orig = aiConfig.callGroqAPI;
aiConfig.callGroqAPI = async (...args) => {
    try {
        return await orig(...args);
    } catch(e) {
        console.error("GROQ FULL ERROR:", e.response ? e.response.data : e.message);
        throw e;
    }
}

const run = async () => {
    try {
        await mongoose.connect('mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0');
        const user = await User.findOne({});
        const result = await generateTripItinerary(user._id, {
            destinationName: 'Tokyo, Japan',
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2), // 3 days
            budget: 'MODERATE',
            interests: ['Culture'],
            foodPref: 'ANYTHING',
            travelStyle: 'SOLO'
        });
        console.log("Success, trip ID:", result.trip._id);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit(0);
    }
};
run();
