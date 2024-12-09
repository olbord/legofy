import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { stackImages, uploadImageToGCS, verifyIdToken } from './stack_images.js';

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

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
