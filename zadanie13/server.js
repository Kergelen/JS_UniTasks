const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname)));

app.post('/upload', upload.single('photo'), (req, res) => {
    res.json({ message: 'Photo uploaded successfully', file: req.file });
});

const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
