import React, { useState } from 'react';

interface MessageSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

interface SearchFilters {
  dateRange?: [Date, Date];
  messageTypes?: ('user' | 'assistant')[];
  hasAttachments?: boolean;
  hasCode?: boolean;
}

const MessageSearch: React.FC<MessageSearchProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex gap-2 p-2 border-b dark:border-gray-700">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search messages..."
        className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-700"
      />
      <FilterDropdown filters={filters} onChange={setFilters} />
    </div>
  );
}; 