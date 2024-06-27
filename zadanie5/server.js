const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(__dirname));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/resize', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({error: 'Brak plików'});
  }

  const {width, height} = req.body;

  if (!width || !height) {
    return res.status(400).json({error: 'Proszę podać rozmiary'});
  }

  try {
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize(parseInt(width), parseInt(height))
      .toBuffer();
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="resized_image.png"'
    });

    res.send(resizedImageBuffer);
  } 
  catch (err) {
    console.error('Bład', err);
    res.status(500).json({error: 'Błąd'});
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
