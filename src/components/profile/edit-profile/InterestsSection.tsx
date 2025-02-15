interface InterestsSectionProps {
  interests: string[];
  newInterest: string;
  onNewInterestChange: (value: string) => void;
  onAddInterest: (interest: string) => void;
  onRemoveInterest: (index: number) => void;
}

export function InterestsSection({
  interests,
  newInterest,
  onNewInterestChange,
  onAddInterest,
  onRemoveInterest
}: InterestsSectionProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
        İlgi Alanları
      </h3>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200"
          >
            {interest}
            <button
              onClick={() => onRemoveInterest(index)}
              className="ml-2 focus:outline-none"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={newInterest}
          onChange={(e) => onNewInterestChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newInterest.trim()) {
              e.preventDefault();
              onAddInterest(newInterest);
            }
          }}
          placeholder="İlgi alanı ekle..."
          className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
        />
      </div>
    </div>
  );
} 