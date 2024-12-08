import { Storage } from '@google-cloud/storage'; // Import the GCS library
import { fileURLToPath } from 'url'; // For file URL handling
import admin from 'firebase-admin'; // For Firebase Admin SDK
import cors from 'cors';
import express from 'express';
import path from 'path';
import {upload, stackImages} from "./stack_images.js";


const app = express(); // Initialize the Express application

// Allow requests from the frontend
app.use(cors({
    origin: 'http://localhost:3000' // Allow your frontend's origin
}));

// Derive the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..'); // Moves up one directory to the project root

const gcsKeyPath = path.resolve(__dirname, '../backend/keys/GCSkey.json');
const firebase_admin_key_path = path.resolve(__dirname, 'keys/FIREBASEkey.json');

app.use(express.json()); // Middleware to parse JSON

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(firebase_admin_key_path),
});

// Initialize the Google Cloud Storage client
const storage = new Storage({
    keyFilename: gcsKeyPath, // Path to your GCS JSON key file
});
const bucketName = 'legofy'; // Your GCS bucket name
const bucket = storage.bucket(bucketName);

// Serve static files from the 'public' directory
app.use(express.static(path.join(projectRoot, 'public')));

// Route for the root URL (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(projectRoot, 'public/pages/index.html')); // Serve index.html as the main page
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export { bucket,  }
