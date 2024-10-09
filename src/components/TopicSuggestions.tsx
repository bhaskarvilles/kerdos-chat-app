import React from 'react'
import { X } from 'lucide-react'

interface TopicSuggestionsProps {
  suggestions: string[]
  onSuggestionClick: (suggestion: string) => void
  onHideSuggestions: () => void
}

const TopicSuggestions: React.FC<TopicSuggestionsProps> = ({ suggestions, onSuggestionClick, onHideSuggestions }) => {
  if (suggestions.length === 0) return null

  return (
    <div className="p-4 bg-green-50 dark:bg-gray-700 border-t border-green-200 dark:border-gray-600 relative">
      <button
        onClick={onHideSuggestions}
        className="absolute top-2 right-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors duration-200"
        aria-label="Hide suggestions"
      >
        <X size={20} />
      </button>
      <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">Suggested Topics:</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm hover:bg-green-300 dark:hover:bg-green-600 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TopicSuggestions