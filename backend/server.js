import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import {stackImages, storage, uploadImageToGCS, verifyIdToken} from './stack_images.js';
import { getUserImages } from './get_user_storage.js';
import { getAuth } from 'firebase-admin/auth';  // Firebase Admin SDK
import admin from 'firebase-admin';

// Create an Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory (located outside 'backend')
const publicDirectory = path.resolve('../public');  // Adjust path to point to the correct 'public' directory
app.use(express.static(publicDirectory));

// API endpoint to handle image stacking and upload
app.post('/stack-and-upload', async (req, res) => {
  try {
    const { character, idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'idToken is required' });
    }

    // Verify Firebase ID token to get the user's email
    const userEmail = await verifyIdToken(idToken);

    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found in the ID token.' });
    }

    // Stack the images based on the character selections
    const buffer = await stackImages(character); // Assuming you already have this function

    // Upload the stacked image to GCS
    const filePath = await uploadImageToGCS(buffer, userEmail);

    res.status(200).json({ message: 'Image successfully uploaded', filePath });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});

// Default route to serve 'index.html' as the main page
app.get('/', (req, res) => {
  const indexPath = path.join(publicDirectory, 'pages', 'index.html');
  res.sendFile(indexPath);  // Serve index.html from 'public/pages/index.html'
});

// Middleware to verify the token and fetch images
app.get('/api/user-images', async (req, res) => {
  const authHeader = req.headers.authorization;

  // Check for the presence of the Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Authorization header missing or invalid' });
  }

  const idToken = authHeader.split(' ')[1];  // Get token after "Bearer "

  try {
    // Verify the ID token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;

    if (!email) {
      return res.status(400).json({ error: 'User email not found in token' });
    }

    // Get the list of images from the user's folder in the bucket
    const images = await getUserImagesFromBucket(email);
    return res.json({ images });

  } catch (error) {
    console.error('Error verifying token or fetching images:', error);
    return res.status(401).json({ error: 'Unauthorized or failed to fetch images' });
  }
});

// Function to get images from the bucket for a given user
async function getUserImagesFromBucket(email) {
  const bucket = storage.bucket('legofy');
  const userFolder = `users/${email}/`;  // Path for user's images

  try {
    const [files] = await bucket.getFiles({ prefix: userFolder }); // Get files from user's folder

    if (!files.length) {
      return [];
    }

    // Generate public URLs for each image
    const imageUrls = files.map(file => {
      // Make sure the image is publicly accessible
      const publicUrl = file.publicUrl();
      return publicUrl;
    });

    return imageUrls;
  } catch (error) {
    console.error('Error fetching images from bucket:', error);
    return [];
  }
}


// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app
