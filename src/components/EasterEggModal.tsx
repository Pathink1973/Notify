import React, { useState, useEffect } from 'react';
import { X, NotebookPen, Github, Instagram, Mail, Bot } from 'lucide-react';

interface EasterEggModalProps {
  onClose: () => void;
}

export function EasterEggModal({ onClose }: EasterEggModalProps) {
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    if (step === 3) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleLogoClick = () => {
    setAnimation('animate-bounce');
    setTimeout(() => setAnimation(''), 1000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-8">
              <button
                onClick={handleLogoClick}
                className={`${animation} transition-transform p-4 bg-purple-100 dark:bg-purple-900/50 rounded-full`}
              >
                <NotebookPen className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </button>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-200 text-center">
              Olá, encontrou um Easter Egg!
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Quer saber quem está por trás do Notify?
            </p>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Descobre
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                <Bot className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Patricio Brito
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Desenvolvedor Full-stack & Designer UI/UX
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <a
                href="https://github.com/Pathink1973"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Github className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href="https://www.instagram.com/pat_think/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Instagram className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href="mailto:patriciobritodesign@gmail.com"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Mail className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Qual é a história?
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 text-center mb-4">
                O Mágico do Notify
              </h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-200">
                <p>
                  Chamo-me Patricio Brito, e sou o cérebro (e talvez o coração) por trás desta maravilhosa   ferramenta que te ajuda a organizar os teus pensamentos.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Volta às tuas notas… ou melhor, deixa o Notify fazer o trabalho pesado por ti!
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 animate-confetti-1">🎉</div>
            <div className="absolute inset-0 animate-confetti-2">✨</div>
            <div className="absolute inset-0 animate-confetti-3">🎈</div>
          </div>
        )}

        <div className="mt-4">{renderStep()}</div>
      </div>
    </div>
  );
}