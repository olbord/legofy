import sharp from "sharp";
import path from "path";
import multer from "multer";
import { fileURLToPath } from 'url';


// Resolve __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reference the 'public' directory relative to the current file
const publicDir = path.resolve(__dirname, '../public');

// Define the upload directory path
const uploadDir = path.join(__dirname, 'uploads');

// Multer setup to store files temporarily in backend/uploads/
const upload = multer({ dest: uploadDir });

const stackImages = async (imagePaths) => {
    try {
        let stackedImage = sharp(imagePaths[0]);

        for (let i = 1; i < imagePaths.length; i++) {
            stackedImage = stackedImage.composite([{
                input: imagePaths[i],
                blend: 'over',
            }]);
        }

        // Specify the temporary image path
        const tempImagePath = path.join(uploadDir, 'stacked_character.png');
        await stackedImage.toFile(tempImagePath);

        return tempImagePath;
    } catch (error) {
        console.error('Error stacking images:', error);
        throw error;
    }
};

export {upload, stackImages}