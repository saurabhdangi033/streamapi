import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadForm from './components/UploadForm';
import VideoList from './components/VideoList';


const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<UploadForm />} />
                <Route path="/videos" element={<VideoList />} />
            </Routes>
        </Router>
    );
};

export default App;
