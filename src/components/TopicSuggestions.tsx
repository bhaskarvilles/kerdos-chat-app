import React from 'react'
import { X } from 'lucide-react'

interface TopicSuggestionsProps {
  suggestions: string[]
  onSuggestionClick: (suggestion: string) => void
  onHideSuggestions: () => void
}

const TopicSuggestions: React.FC<TopicSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  onHideSuggestions,
}) => {
  if (suggestions.length === 0) return null

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Suggested Topics</h3>
        <button
          onClick={onHideSuggestions}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default React.memo(TopicSuggestions)
