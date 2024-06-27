const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

const uploadDir = path.join(__dirname, 'uploads');

const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(express.static(uploadDir));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/process_image', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nieprawidłowy plik.');
    }

    const fileName = req.file.filename;
    const filePath = path.join(uploadDir, fileName);

    const outputFileName = `bw_${fileName}`;
    const outputPath = path.join(uploadDir, outputFileName);
    const command = `convert "${filePath}" -colorspace Gray "${outputPath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Błąd podczas przetwarzania obrazu: ${error.message}`);
            return res.status(500).send('Błąd podczas przetwarzania obrazu.');
        }
        if (stderr) {
            console.error(`Błąd podczas przetwarzania obrazu: ${stderr}`);
            return res.status(500).send('Błąd podczas przetwarzania obrazu.');
        }

        const fileContents = fs.readFileSync(outputPath);
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFileName}"`);
        res.send(fileContents);

        fs.unlinkSync(filePath);
        fs.unlinkSync(outputPath);
    });
});

app.listen(port, () => {
    console.log(`Serwer nasłuchuje na porcie ${port}`);
});
