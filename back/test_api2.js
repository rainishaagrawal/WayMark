import { callGroqAPI } from './src/config/aiConfig.js';

const run = async () => {
    try {
        const res = await callGroqAPI("Hello JSON", "Respond in JSON {\"hello\": \"world\"}");
        console.log("Success:", res);
    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    } finally {
        process.exit(0);
    }
};
run();
