const express = require('express');
const { spawn } = require('child_process');
const router = express.Router();

router.post('/predict', (req, res) => {
    const features = Object.values(req.body); // Extracting values from req.body

    // Now you can pass the features array directly to the Python script
    const pythonProcess = spawn('python', ['predict.py', ...features]);

    pythonProcess.stdout.on('data', (data) => {
        const prediction = parseFloat(data.toString().trim());
        res.json({ prediction });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
        res.status(500).send('An error occurred during prediction.');
    });
});

module.exports = router;
