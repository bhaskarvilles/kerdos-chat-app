import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface MessageSearchProps {
  onSearch: (query: string) => void;
}

const MessageSearch: React.FC<MessageSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        placeholder="Search messages..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
          bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>
  );
};

export default MessageSearch; 