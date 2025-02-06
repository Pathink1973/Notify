export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  attachments: {
    id: string;
    type: 'image' | 'file';
    name: string;
    url: string;
    size: number;
  }[];
}

export type NoteColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray';

export type ExportFormat = 'pdf' | 'txt' | 'md';