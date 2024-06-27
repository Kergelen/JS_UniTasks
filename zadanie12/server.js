const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const NOTES_FILE = 'notes.json';

function serializeNotes(notes) {
  return JSON.stringify(notes, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (value.content && value.encrypted) {
        return { content: value.content, encrypted: value.encrypted };
      }
    }
    return value;
  });
}

function deserializeNotes(notesData) {
  return JSON.parse(notesData, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (value.content && value.encrypted) {
        return { content: value.content, encrypted: value.encrypted };
      }
    }
    return value;
  });
}

let notes = [];
try {
  const data = fs.readFileSync(NOTES_FILE);
  notes = deserializeNotes(data);
} catch (err) {
  if (err.code !== 'ENOENT') {
    console.error('Error loading notes:', err);
  }
}

function saveNotes() {
  const notesData = serializeNotes(notes);
  fs.writeFileSync(NOTES_FILE, notesData);
}

app.use(express.static(path.join(__dirname)));

app.use(express.json());

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const note = req.body.note;
    if (note) {
      encryptNote(note)
        .then(encryptedNote => {
          notes.push({ content: note, encrypted: encryptedNote });
          saveNotes(); 
          res.status(201).json({ message: 'Note added successfully' });
        })
        .catch(err => {
          console.error('Error encrypting note:', err);
          res.status(500).json({ error: 'Failed to add note' });
        });
    } else {
      res.status(400).json({ error: 'Note cannot be empty' });
    }
  });
  
app.delete('/api/notes/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (isNaN(index) || index < 0 || index >= notes.length) {
    res.status(400).json({ error: 'Invalid note index' });
  } else {
    notes.splice(index, 1);
    saveNotes(); 
    res.json({ message: 'Note deleted successfully' });
  }
});

function encryptNote(note) {
  return new Promise((resolve, reject) => {
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(note))
      .then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const encryptedNote = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(encryptedNote);
      })
      .catch(err => reject(err));
  });
}

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
