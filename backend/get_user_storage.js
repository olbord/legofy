import {storage} from './stack_images.js'
import admin from 'firebase-admin';

const bucketName = 'legofy';
const bucket = storage.bucket(bucketName);


// Function to list files from GCS
export async function getUserImages(userEmail) {
  try {
    const prefix = `users/${userEmail}/`;
    const [files] = await bucket.getFiles({ prefix });
    const imageUrls = files.map(file => `https://storage.googleapis.com/${bucketName}/${file.name}`);
    return imageUrls;
  } catch (error) {
    console.error('Error listing files from GCS:', error);
    throw new Error('Unable to fetch images');
  }
}


// Backend route with user authentication
export async function getAuthenticatedUserImages(req, res) {
  try {
    // Get user's Firebase Auth token from the Authorization header
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the token and extract user info
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    // Fetch user images using the email
    const imageUrls = await getUserImages(userEmail);
    res.json({ images: imageUrls });
  } catch (error) {
    console.error('Error fetching authenticated user images:', error);
    res.status(500).json({ error: 'Failed to fetch user images' });
  }
}
