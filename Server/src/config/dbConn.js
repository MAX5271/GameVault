const mongoose = require('mongoose');

const connectDB = async (maxRetries = 5, delayMs = 5000) => {
    let retries = maxRetries;

    while (retries > 0) {
        try {
            await mongoose.connect(process.env.DATABASE_URI, {
                serverSelectionTimeoutMS: 5000, 
            });
            
            console.log('MongoDB Connected Successfully.');
            return; 

        } catch (error) {
            retries -= 1;
            console.error(`MongoDB Connection Failed. Retries left: ${retries}`);
            console.error(`Reason: ${error.message}`);

            if (retries === 0) {
                console.error('All DB connection retries exhausted. Exiting process.');
                process.exit(1); 
            }

            console.log(`Waiting ${delayMs / 1000} seconds before retrying...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
};

module.exports = connectDB;