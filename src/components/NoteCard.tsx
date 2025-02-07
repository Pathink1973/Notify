import React from 'react';
import { marked } from 'marked';
import { 
  Pin, 
  PinOff, 
  Palette, 
  Tag, 
  Archive, 
  Trash2,
  Plus,
  X,
  Calendar,
  Paperclip,
  Undo2
} from 'lucide-react';
import type { Note, NoteColor } from '../types';

interface NoteCardProps {
  note: Note;
  onPin: (id: string) => void;
  onChangeColor: (id: string, color: NoteColor) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onUpdateLabels: (id: string, labels: string[]) => void;
  onUpdateAttachments?: (id: string, attachments: Note['attachments']) => void;
  isInTrash?: boolean;
}

const colorMap: Record<NoteColor, string> = {
  default: 'bg-white dark:bg-gray-800',
  red: 'bg-red-50 dark:bg-red-900',
  orange: 'bg-orange-50 dark:bg-orange-900',
  yellow: 'bg-yellow-50 dark:bg-yellow-900',
  green: 'bg-green-50 dark:bg-green-900',
  blue: 'bg-blue-50 dark:bg-blue-900',
  purple: 'bg-purple-50 dark:bg-purple-900',
  gray: 'bg-gray-50 dark:bg-gray-700',
};

export function NoteCard({ 
  note, 
  onPin, 
  onChangeColor, 
  onArchive, 
  onDelete, 
  onEdit,
  onUpdateLabels,
  onUpdateAttachments,
  isInTrash = false
}: NoteCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [showLabelInput, setShowLabelInput] = React.useState(false);
  const [newLabel, setNewLabel] = React.useState('');

  marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: true
  });

  const renderMarkdown = (text: string) => {
    return { __html: marked(text) };
  };

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (newLabel.trim()) {
      const updatedLabels = [...note.labels, newLabel.trim()];
      onUpdateLabels(note.id, updatedLabels);
      setNewLabel('');
      setShowLabelInput(false);
    }
  };

  const handleRemoveLabel = (labelToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedLabels = note.labels.filter(label => label !== labelToRemove);
    onUpdateLabels(note.id, updatedLabels);
  };

  const handleDeleteAttachment = (attachmentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateAttachments) {
      const updatedAttachments = note.attachments.filter(
        attachment => attachment.id !== attachmentId
      );
      onUpdateAttachments(note.id, updatedAttachments);
    }
  };

  return (
    <div 
      className={`${colorMap[note.color as NoteColor]} p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 
        hover:shadow-md transition-all relative group ${isInTrash ? 'opacity-75' : ''}`}
      onClick={() => onEdit(note)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 dark:text-white"
            dangerouslySetInnerHTML={renderMarkdown(note.title)} />
        {!isInTrash && (
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onPin(note.id);
            }}
          >
            {note.isPinned ? (
              <Pin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <PinOff className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            )}
          </button>
        )}
      </div>

      {note.dueDate && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Calendar className="w-4 h-4" />
          {new Date(note.dueDate).toLocaleDateString()}
        </div>
      )}
      
      <div 
        className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-4"
        dangerouslySetInnerHTML={renderMarkdown(note.content)}
      />

      {note.attachments?.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {note.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center gap-2 group/attachment"
              onClick={(e) => e.stopPropagation()}
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
              {!isInTrash && (
                <button
                  onClick={(e) => handleDeleteAttachment(attachment.id, e)}
                  className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500 opacity-0 group-hover/attachment:opacity-100 transition-opacity"
                  title="Excluir anexo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!isInTrash && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.labels.map((label) => (
            <span 
              key={label}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {label}
              <button
                onClick={(e) => handleRemoveLabel(label, e)}
                className="hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {showLabelInput ? (
            <form
              onSubmit={handleAddLabel}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex"
            >
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Nova etiqueta"
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full outline-none"
                autoFocus
              />
            </form>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLabelInput(true);
              }}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Adicionar
            </button>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-2">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          {isInTrash ? (
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-green-600 dark:text-green-400"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              title="Restaurar da lixeira"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(note.id);
                }}
              >
                <Archive className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
              >
                <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
      </div>

      {showMenu && !isInTrash && (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 transition-colors">
          <div className="grid grid-cols-4 gap-1">
            {Object.entries(colorMap).map(([color]) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full ${colorMap[color as NoteColor]} border border-gray-200 dark:border-gray-700`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeColor(note.id, color as NoteColor);
                  setShowMenu(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}