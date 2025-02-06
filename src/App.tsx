import React from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { ThemeToggle } from './components/ThemeToggle';
import type { Note, NoteColor } from './types';

function App() {
  const [notes, setNotes] = React.useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSection, setActiveSection] = React.useState('notes');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [editingNote, setEditingNote] = React.useState<Note | null>(null);
  const [showEditor, setShowEditor] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);

  React.useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const allLabels = React.useMemo(() => {
    const labels = new Set<string>();
    notes.forEach(note => note.labels.forEach(label => labels.add(label)));
    return Array.from(labels);
  }, [notes]);

  const filteredNotes = React.useMemo(() => {
    let filtered = notes;

    switch (activeSection) {
      case 'notes':
        filtered = filtered.filter((note) => !note.isArchived && !note.isDeleted);
        break;
      case 'archive':
        filtered = filtered.filter((note) => note.isArchived && !note.isDeleted);
        break;
      case 'labels':
        if (selectedLabel) {
          filtered = filtered.filter((note) => 
            note.labels.includes(selectedLabel) && !note.isArchived && !note.isDeleted
          );
        }
        break;
      case 'trash':
        filtered = filtered.filter((note) => note.isDeleted);
        break;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.labels.some(label => label.toLowerCase().includes(query))
      );
    }

    return [...filtered].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, activeSection, searchQuery, selectedLabel]);

  const handleSaveNote = (noteData: Partial<Note>) => {
    if (editingNote) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id ? { ...note, ...noteData } : note
        )
      );
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: noteData.title || '',
        content: noteData.content || '',
        color: 'default',
        isPinned: false,
        isArchived: false,
        isDeleted: false,
        labels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: [],
      };
      setNotes((prev) => [newNote, ...prev]);
    }
    setEditingNote(null);
    setShowEditor(false);
  };

  const handlePin = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

  const handleChangeColor = (id: string, color: NoteColor) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, color } : note))
    );
  };

  const handleArchive = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isArchived: !note.isArchived } : note
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isDeleted: true } : note
      )
    );
  };

  const handleRestoreFromTrash = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isDeleted: false } : note
      )
    );
  };

  const handleEmptyTrash = () => {
    setNotes((prev) => prev.filter((note) => !note.isDeleted));
  };

  const handleUpdateLabels = (id: string, labels: string[]) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, labels } : note
      )
    );
  };

  const handleUpdateAttachments = (id: string, attachments: Note['attachments']) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, attachments } : note
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        labels={allLabels}
        selectedLabel={selectedLabel}
        onSelectLabel={setSelectedLabel}
      />
      
      <main className="ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar notas"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
              />
            </div>
            <ThemeToggle />
            {activeSection === 'trash' ? (
              <button
                onClick={handleEmptyTrash}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Esvaziar Lixeira
              </button>
            ) : (
              <button
                onClick={() => setShowEditor(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nova Nota
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPin={handlePin}
                onChangeColor={handleChangeColor}
                onArchive={handleArchive}
                onDelete={activeSection === 'trash' ? handleRestoreFromTrash : handleDelete}
                onEdit={(note) => {
                  if (!note.isDeleted) {
                    setEditingNote(note);
                    setShowEditor(true);
                  }
                }}
                onUpdateLabels={handleUpdateLabels}
                onUpdateAttachments={handleUpdateAttachments}
                isInTrash={activeSection === 'trash'}
              />
            ))}
          </div>
        </div>
      </main>

      {showEditor && (
        <NoteEditor
          note={editingNote || undefined}
          onSave={handleSaveNote}
          onClose={() => {
            setShowEditor(false);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
}

export default App;