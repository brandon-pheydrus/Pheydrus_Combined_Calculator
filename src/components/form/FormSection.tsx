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
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left font-semibold text-[#2d2a3e] transition-colors flex justify-between items-center"
      >
        {title}
        <span
          className={`transform transition-transform text-[#9b95ad] ${isOpen ? 'rotate-180' : ''}`}
        >
          &#x25BC;
        </span>
      </button>

      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}
