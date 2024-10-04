const Video = require('../models/Video');

// Upload video
exports.uploadVideo = async (req, res) => {
    const { title } = req.body;
    const videoUrl = req.file.path;
    
    const newVideo = new Video({
        title,
        videoUrl
    });

    try {
        await newVideo.save();
        res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload video' });
    }
};

// Fetch all videos
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};

// Delete video
exports.deleteVideo = async (req, res) => {
    const { id } = req.params;
    
    try {
        await Video.findByIdAndDelete(id);
        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete video' });
    }
};
