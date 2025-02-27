import React from 'react';
import { File, X } from 'lucide-react';

interface DocumentContextProps {
  documents: string[];
  onRemove: (index: number) => void;
}

const DocumentContext: React.FC<DocumentContextProps> = ({ documents, onRemove }) => {
  if (documents.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      {documents.map((doc, index) => (
        <div 
          key={index}
          className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 
            rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <File className="w-4 h-4 text-teal-600" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
          <button
            onClick={() => onRemove(index)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentContext; 