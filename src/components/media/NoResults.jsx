import React from 'react';

export function NoResults() {
  return (
    <div className="no-results text-center py-12">
      <div className="no-results-icon text-gray-400 text-6xl mb-4">🔍</div>
      <h3 className="no-results-title text-lg font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
      <p className="no-results-description text-gray-500">다른 키워드로 검색해보세요</p>
    </div>
  );
}
