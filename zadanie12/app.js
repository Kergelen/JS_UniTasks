const noteInput = document.getElementById('note-input');
const addNoteBtn = document.getElementById('add-note');
const noteList = document.getElementById('note-list');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

fetch('/api/notes')
  .then(response => response.json())
  .then(notes => {
    noteList.innerHTML = '';
    notes.forEach((note, index) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Usuń';
      deleteBtn.addEventListener('click', () => deleteNote(index));
      span.textContent = note.content;
      li.appendChild(span);
      li.appendChild(deleteBtn);
      noteList.appendChild(li);
    });
  })
  .catch(err => console.error('Error loading notes:', err));

function addNote() {
  const note = noteInput.value.trim();
  if (note) {
    fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ note })
    })
      .then(response => {
        if (response.ok) {
          noteInput.value = '';
          return response.json();
        } else {
          throw new Error('Failed to add note');
        }
      })
      .then(data => {
        console.log(data.message);
        loadNotes();
      })
      .catch(err => console.error('Error adding note:', err));
  }
}

function deleteNote(index) {
  fetch(`/api/notes/${index}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to delete note');
      }
    })
    .then(data => {
      console.log(data.message);
      loadNotes();
    })
    .catch(err => console.error('Error deleting note:', err));
}

function loadNotes() {
  fetch('/api/notes')
  .then(response => response.json())
  .then(notes => {
    noteList.innerHTML = '';
    notes.forEach((note, index) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Usuń';
      deleteBtn.addEventListener('click', () => deleteNote(index));
      span.textContent = note.content;
      li.appendChild(span);
      li.appendChild(deleteBtn);
      noteList.appendChild(li);
    });
  })
  .catch(err => console.error('Error loading notes:', err));
}

addNoteBtn.addEventListener('click', addNote);
noteInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    addNote();
  }
});
