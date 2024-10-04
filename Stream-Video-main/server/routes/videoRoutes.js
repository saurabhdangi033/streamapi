const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');
const videoController = require('../controllers/videoController');

const upload = multer({ storage });

// Upload a video
router.post('/upload', upload.single('video'), videoController.uploadVideo);

// Get all videos
router.get('/videos', videoController.getAllVideos);

// Delete a video
router.delete('/videos/:id', videoController.deleteVideo);

module.exports = router;
