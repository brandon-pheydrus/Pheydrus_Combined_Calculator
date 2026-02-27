import { useState } from 'react';
import { ChevronDownIcon } from '../icons';

interface ResultSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ResultSection({ title, children, defaultOpen = true }: ResultSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && <div className="px-6 py-4 bg-white dark:bg-gray-900">{children}</div>}
    </div>
  );
}

export default ResultSection;
