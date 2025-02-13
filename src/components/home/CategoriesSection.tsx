import { Category } from '../../types';

interface CategoriesSectionProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export function CategoriesSection({ categories, selectedCategory, onCategorySelect }: CategoriesSectionProps) {
  return (
    <div className="category-section">
      <div className="category-inner">
        <h3 className="text-lg font-medium text-gray-900">Browse Categories</h3>
        
        <div className="category-scroll">
          <div className="category-container">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id === selectedCategory ? null : category.id)}
                className={`category-button category-${category.id} ${
                  selectedCategory === category.id ? 'active' : ''
                }`}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 