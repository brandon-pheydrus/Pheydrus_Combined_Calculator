/**
 * FormSection Component
 * Collapsible form section wrapper
 */

import { useState } from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function FormSection({ title, children, defaultOpen = true }: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden mb-6 dark:border-gray-600">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-left font-semibold text-gray-900 dark:text-white transition-colors flex justify-between items-center"
      >
        {title}
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && <div className="p-4 bg-white dark:bg-gray-800">{children}</div>}
    </div>
  );
}
