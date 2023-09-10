const admin = require('firebase-admin');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
// const serviceAccount = require('../node_modules/songvault-7f750-firebase-adminsdk-6x758-8dfbc34995.json');
const filePath = path.join(__dirname, 'pulse.json');
const serviceAccount = require(filePath);

function initializeFirebase() {
  if (!admin.apps.length) {
    // const serviceAccount = require('../node_modules/songvault-7f750-firebase-adminsdk-6x758-8dfbc34995.json');
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    //   storageBucket: 'gs://songvault-7f750.appspot.com'
    // }, 'songVaultApp');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'gs://pulse-c5fe5.appspot.com'
        });
  }

//   bucket = admin.storage().bucket('songVaultApp.appspot.com');
  return bucket = admin.storage().bucket();
//   upload = multer({ storage: multer.memoryStorage() });
//   const storage = multer.memoryStorage();
//   upload = multer({storage: storage});
}

module.exports = { initializeFirebase };

