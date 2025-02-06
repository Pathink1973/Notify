import React from 'react';
import { 
  LightbulbIcon, 
  TagIcon, 
  ArchiveIcon, 
  TrashIcon,
  ChevronDown,
  ChevronRight,
  NotebookPen
} from 'lucide-react';
import { EasterEggModal } from './EasterEggModal';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  labels: string[];
  selectedLabel: string | null;
  onSelectLabel: (label: string | null) => void;
}

export function Sidebar({ 
  activeSection, 
  onSectionChange, 
  labels,
  selectedLabel,
  onSelectLabel
}: SidebarProps) {
  const [showLabels, setShowLabels] = React.useState(true);
  const [showEasterEgg, setShowEasterEgg] = React.useState(false);

  const menuItems = [
    { id: 'notes', icon: LightbulbIcon, label: 'Notas' },
    { id: 'labels', icon: TagIcon, label: 'Etiquetas' },
    { id: 'archive', icon: ArchiveIcon, label: 'Arquivo' },
    { id: 'trash', icon: TrashIcon, label: 'Lixo' },
  ];

  const handleLabelClick = (label: string) => {
    onSelectLabel(selectedLabel === label ? null : label);
    onSectionChange('labels');
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0 transition-colors overflow-y-auto">
      <div className="p-4">
        <button
          onClick={() => setShowEasterEgg(true)}
          className="flex items-center gap-2 group mb-12"
        >
          <NotebookPen className="w-8 h-8 text-purple-600 dark:text-purple-400 transition-transform group-hover:scale-110" />
          <h1 className="text-4xl font-space font-bold text-gray-800 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Notify
          </h1>
        </button>

        <nav>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`w-full flex items-center px-4 py-2 mb-2 rounded-lg text-left transition-colors ${
                activeSection === item.id && !selectedLabel
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <button
                className="flex-1 flex items-center"
                onClick={() => {
                  onSectionChange(item.id);
                  if (item.id !== 'labels') {
                    onSelectLabel(null);
                  }
                }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
              {item.id === 'labels' && (
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  {showLabels ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          ))}

          {showLabels && activeSection === 'labels' && (
            <div className="ml-4 mt-2 space-y-1">
              {labels.map((label) => (
                <button
                  key={label}
                  onClick={() => handleLabelClick(label)}
                  className={`w-full flex items-center px-4 py-2 rounded-lg text-left text-sm transition-colors ${
                    selectedLabel === label
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <TagIcon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
              {labels.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2">
                  Nenhuma etiqueta criada
                </p>
              )}
            </div>
          )}
        </nav>
      </div>

      {showEasterEgg && <EasterEggModal onClose={() => setShowEasterEgg(false)} />}
    </div>
  );
}