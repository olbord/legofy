import sharp from 'sharp';
import admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from "path";

// Load GCS credentials
const gcsServiceAccount = JSON.parse(fs.readFileSync('keys/GCSkey.json', 'utf8'));

// Initialize Google Cloud Storage client
const storage = new Storage({ credentials: gcsServiceAccount });
const bucket = storage.bucket('legofy'); // Your GCS bucket name

// Initialize Firebase Admin SDK
const firebaseServiceAccount = JSON.parse(fs.readFileSync('keys/FIREBASEkey.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
});

// Define the public directory path relative to the current file
const publicDirectory = path.resolve('../public');

// Function to stack images and return the resulting image buffer
async function stackImages(character) {
  try {
    // Construct absolute paths for each image part
    const images = [
      path.join(publicDirectory, character.bottom.src),
      path.join(publicDirectory, character.top.src),
      path.join(publicDirectory, character.face.src),
      path.join(publicDirectory, character.hair.src),
    ];

    // Validate that all files exist before processing
    for (const imagePath of images) {
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Input file is missing: ${imagePath}`);
      }
    }

    // Load the base image
    let baseImage = sharp(images[0]);

    // Create an array of composites for all the remaining images
    const composites = images.slice(1).map(imagePath => ({
      input: imagePath,
      gravity: 'north', // Adjust gravity as per your requirement
    }));

    // Apply the composites to the base image and return the resulting buffer
    return baseImage.composite(composites).toBuffer();
  } catch (error) {
    console.error('Error stacking images:', error);
    throw error;
  }
}

// Function to upload the image to Google Cloud Storage
async function uploadImageToGCS(buffer, userEmail) {
  try {
    // Define the destination path in the GCS bucket (using the user's email)
    const filePath = `users/${userEmail}/character_image.png`;

    const file = bucket.file(filePath);

    // Upload the buffer to GCS
    await file.save(buffer, {
      metadata: { contentType: 'image/png' },
    });

    // Make the file publicly accessible (optional)

    console.log(`File uploaded to ${filePath}`);
    return filePath; // Return the file path to the caller
  } catch (error) {
    console.error('Error uploading file to GCS:', error);
    throw new Error('Error uploading file to GCS');
  }
}

// Function to verify the Firebase ID token and get the user's email
async function verifyIdToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.email;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw new Error('Error verifying ID token');
  }
}

// Exporting the functions to be used in other parts of the backend
export { stackImages, uploadImageToGCS, verifyIdToken };
