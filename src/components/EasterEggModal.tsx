import React from 'react';
import { X } from 'lucide-react';

interface EasterEggModalProps {
  onClose: () => void;
}

export function EasterEggModal({ onClose }: EasterEggModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-space font-bold text-purple-600 dark:text-purple-400 mb-6">
            O Mágico do Notify
          </h2>

          <p className="text-gray-600 dark:text-gray-300 italic mb-6">
            Psst! Sabias que esta app não foi criada por um génio artificial, mas sim por um ser humano real? Sim, eu existo!
          </p>

          <p className="text-gray-700 dark:text-gray-200 mb-4">
            Chamo-me Patricio Brito, e sou o cérebro (e talvez o coração) por trás desta maravilhosa ferramenta que te ajuda a organizar os teus pensamentos.
          </p>

          <p className="text-gray-700 dark:text-gray-200 mb-4">
            Se pudesse escolher superpoderes, provavelmente seria teletransporte (quem não quer evitar engarrafamentos?), mas tive de me contentar com habilidades em programação.
          </p>

          <p className="text-gray-700 dark:text-gray-200 mb-4">
            Acredita, foi quase tão épico!
          </p>

          <p className="text-gray-700 dark:text-gray-200 mb-4">
            Então, cada vez que abrires esta app, lembra-te: Patricio está aqui, invisivelmente orgulhoso de ter ajudado o teu cérebro a ficar mais organizado.
          </p>

          <p className="text-gray-600 dark:text-gray-300 italic">
            Volta às tuas notas… ou melhor, deixa o Notify fazer o trabalho pesado por ti!
          </p>
        </div>
      </div>
    </div>
  );
}