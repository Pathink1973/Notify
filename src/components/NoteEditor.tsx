import React from 'react';
import { marked } from 'marked';
import { Calendar, Image, Paperclip, Download } from 'lucide-react';
import type { Note, ExportFormat } from '../types';

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Partial<Note>) => void;
  onClose: () => void;
}

export function NoteEditor({ note, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = React.useState(note?.title || '');
  const [content, setContent] = React.useState(note?.content || '');
  const [dueDate, setDueDate] = React.useState(note?.dueDate ? new Date(note.dueDate) : null);
  const [attachments, setAttachments] = React.useState(note?.attachments || []);
  const [showPreview, setShowPreview] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Configure marked for safe HTML
  marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: true
  });

  // Convert markdown to HTML
  const renderMarkdown = (text: string) => {
    return { __html: marked(text) };
  };

  const handleSave = () => {
    if (!title && !content) {
      onClose();
      return;
    }

    onSave({
      title,
      content,
      dueDate: dueDate,
      attachments,
      updatedAt: new Date(),
    });
    onClose();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of files) {
      // In a real app, you would upload to a storage service
      // For demo, we'll create object URLs
      const url = URL.createObjectURL(file);
      const isImage = file.type.startsWith('image/');

      setAttachments(prev => [...prev, {
        id: crypto.randomUUID(),
        type: isImage ? 'image' : 'file',
        name: file.name,
        url: url,
        size: file.size
      }]);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    let content = '';
    switch (format) {
      case 'txt':
        content = `${title}\n\n${content}`;
        break;
      case 'md':
        content = `# ${title}\n\n${content}`;
        break;
      case 'pdf':
        // In a real app, you would use a PDF library
        alert('PDF export would be implemented with a proper PDF library');
        return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'note'}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl p-6 transition-colors">
        <input
          type="text"
          placeholder="Título (suporta Markdown)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-medium mb-4 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          autoFocus
        />

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
            Anexar arquivo
          </button>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {showPreview ? 'Editar' : 'Visualizar'}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <button
            onClick={() => setDueDate(dueDate ? null : new Date())}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            {dueDate ? 'Remover data' : 'Definir data'}
          </button>

          <div className="flex-1" />

          <button
            onClick={() => handleExport('md')}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            .md
          </button>
          <button
            onClick={() => handleExport('txt')}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            .txt
          </button>
        </div>

        {dueDate && (
          <div className="mb-4">
            <input
              type="datetime-local"
              value={dueDate.toISOString().slice(0, 16)}
              onChange={(e) => setDueDate(new Date(e.target.value))}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0 outline-none"
            />
          </div>
        )}

        {attachments.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center gap-2"
              >
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <Paperclip className="w-5 h-5 text-gray-500" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round(attachment.size / 1024)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPreview ? (
          <div className="w-full h-64 overflow-y-auto prose prose-sm dark:prose-invert max-w-none mb-4">
            <div dangerouslySetInnerHTML={renderMarkdown(content)} />
          </div>
        ) : (
          <textarea
            placeholder="Escreva uma nota... (suporta Markdown)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 resize-none outline-none bg-transparent text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 font-mono"
          />
        )}

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guia de Markdown</h4>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p><code># Título</code> - Título principal</p>
              <p><code>## Subtítulo</code> - Subtítulo</p>
              <p><code>**texto**</code> - <strong>Negrito</strong></p>
              <p><code>*texto*</code> - <em>Itálico</em></p>
            </div>
            <div>
              <p><code>- item</code> - Lista com marcadores</p>
              <p><code>1. item</code> - Lista numerada</p>
              <p><code>[texto](url)</code> - Link</p>
              <p><code>~~texto~~</code> - <del>Riscado</del></p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}