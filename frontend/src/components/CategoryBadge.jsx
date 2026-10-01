import React from 'react';

const CATEGORY_STYLES = {
  work: 'cat-work',
  health: 'cat-health',
  study: 'cat-study',
  personal: 'cat-personal',
};

export default function CategoryBadge({ category }) {
  if (!category) return null;
  const key = category.trim().toLowerCase();
  const cls = CATEGORY_STYLES[key] || '';

  return (
    <span className={`category-pill ${cls}`} title={`Category: ${category}`}>
      #{category}
    </span>
  );
}
