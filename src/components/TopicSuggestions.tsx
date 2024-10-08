import React from 'react'

interface TopicSuggestionsProps {
  suggestions: string[]
  onSuggestionClick: (suggestion: string) => void
}

const TopicSuggestions: React.FC<TopicSuggestionsProps> = ({ suggestions, onSuggestionClick }) => {
  if (suggestions.length === 0) return null

  return (
    <div className="p-4 bg-green-50 dark:bg-gray-700 border-t border-green-200 dark:border-gray-600">
      <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">Suggested Topics:</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm hover:bg-green-300 dark:hover:bg-green-600 transition-colors duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TopicSuggestions