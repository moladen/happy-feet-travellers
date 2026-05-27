import Link from 'next/link';
import {
  PERSONALIZED_TOUR_CATEGORIES,
  getPersonalizedCategoryHref,
} from '@/lib/personalizedTourCategories';

export default function PersonalizedCategoryChips() {
  return (
    <nav className="personalized-tours-section__categories" aria-label="Personalized travel categories">
      <ul className="personalized-tours-section__category-list">
        {PERSONALIZED_TOUR_CATEGORIES.map((category) => (
          <li key={category.id}>
            <Link href={getPersonalizedCategoryHref(category)} className="personalized-tours-section__category-chip">
              <span className="personalized-tours-section__category-icon" aria-hidden>
                {category.icon}
              </span>
              <span className="personalized-tours-section__category-label">{category.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
