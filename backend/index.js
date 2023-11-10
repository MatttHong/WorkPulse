const app = require('./app');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const fs = require('fs');
const { initializeFirebase } = require('./utils/firebase');

const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    dotenv.config();
  }

const PORT = process.env.PORT || 3000;
const MONGO = process.env.MONGO || "localhost:27017/Pulse";

async function main() {
    await initializeFirebase();
    await mongoose.connect(`mongodb://${MONGO}`, { useNewUrlParser: true, useUnifiedTopology: true });

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

main().catch((err) => console.log(err));