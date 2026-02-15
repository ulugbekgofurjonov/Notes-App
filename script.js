let notes = []
let editingNoteId = null


function loadNotes(){
    const savedNotes = localStorage.getItem('quickNotes')
    return savedNotes ? JSON.parse(savedNotes) : []
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', savedTheme)
    updateThemeIcon(savedTheme)
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    updateThemeIcon(newTheme)
}

function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('themeToggleBtn')
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙'
}

function saveNote(event) {
    event.preventDefault()

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (editingNoteId) {
        // Edit existing note
        const noteIndex = notes.findIndex(note => note.id === editingNoteId)
        if (noteIndex !== -1) {
            notes[noteIndex].title = title
            notes[noteIndex].content = content
        }
        editingNoteId = null
    } else {
        // Add new note
        notes.unshift({
            id: generateId(),
            title: title,
            content: content
        })
    }

    saveNotes()
    renderNotes()
    closeNoteDialog()
    document.getElementById('noteForm').reset()
}

function generateId() {
    return Date.now().toString()
}

function saveNotes() {
    localStorage.setItem('quickNotes', JSON.stringify(notes))
}

function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');

    if (notes.length === 0) {
        notesContainer.innerHTML = `
        <div class="empty-state">
        <h2>No notes yet</h2>
        <p>Create your first note to get started!</p>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
        </div>
        `

        return
    }

    notesContainer.innerHTML = notes.map(note => `
        <div class="note-card">
            <h3>${escapeHtml(note.title)}</h3>
            <p>${escapeHtml(note.content)}</p>
            <div class="note-actions">
                <button class="edit-btn" onclick="editNote('${note.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteNote('${note.id}')">Delete</button>
            </div>
        </div>
        `).join('')
}

function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}

function editNote(noteId) {
    const note = notes.find(n => n.id === noteId)
    if (!note) return

    editingNoteId = noteId
    document.getElementById('noteTitle').value = note.title
    document.getElementById('noteContent').value = note.content
    document.getElementById('dialogTitle').textContent = 'Edit Note'
    
    openNoteDialog()
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== noteId)
        saveNotes()
        renderNotes()
    }
}

function openNoteDialog() {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');

    dialog.showModal()
    titleInput.focus()
}


function closeNoteDialog() {
    document.getElementById('noteDialog').close()
    document.getElementById('noteForm').reset()
    document.getElementById('dialogTitle').textContent = 'Add New Note'
    editingNoteId = null
}

document.addEventListener('DOMContentLoaded', function () {
    // Load theme first
    loadTheme()
    
    // Load notes
    notes = loadNotes()
    renderNotes()

    // Theme toggle button
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)

    // Form submit
    document.getElementById('noteForm').addEventListener('submit', saveNote)

    // Click outside dialog to close
    document.getElementById('noteDialog').addEventListener('click', function (event) {
        if (event.target === this) {
            closeNoteDialog()
        }
    })
})