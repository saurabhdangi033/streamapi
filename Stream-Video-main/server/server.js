require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Video = require('./models/Video'); // assuming this is your Mongoose model for videos

const app = express();
app.use(cors());
app.use(express.json());



const mongoURI = 'mongodb+srv://saurabhdangi33:test123@cluster0.6nmhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage setup for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'videos',
        resource_type: 'video'
    }
});

const upload = multer({ storage });

// Upload video route
app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const { title } = req.body;
        const videoUrl = req.file.path;

        const newVideo = new Video({
            title,
            videoUrl
        });

        await newVideo.save();
        res.status(200).json({ message: 'Video uploaded successfully', video: newVideo });
    } catch (error) {
        res.status(500).json({ message: 'Video upload failed', error });
    }
});

// Get all uploaded videos
app.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch videos', error });
    }
});

// Delete video route
// Delete video route
app.delete('/videos/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Extracting public_id from video URL
        const publicId = video.videoUrl.split('/').slice(-2).join('/').split('.')[0];

        // Log publicId to check if it's correct
        console.log("Cloudinary public ID:", publicId);

        // Delete video from Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

        // Log Cloudinary response to ensure the request is being processed
        console.log("Cloudinary Response:", cloudinaryResponse);

        if (cloudinaryResponse.result !== 'ok') {
            return res.status(500).json({ message: 'Failed to delete video from Cloudinary' });
        }

        // Delete video from MongoDB
        await Video.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ message: 'Failed to delete video', error: error.message });
    }
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
