const app = require('./app'); // Import the app
const mongoose = require("mongoose");
const { PORT, MONGO } = require('./utils/environment');
const { initializeFirebase } = require('./utils/firebase');

async function main() {
    await initializeFirebase();
    await mongoose.connect("mongodb://" + MONGO);
    app.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`);
    });
}

main().catch((err) => console.log(err));