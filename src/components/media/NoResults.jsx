import React from 'react';

export function NoResults() {
  return (
    <div className="text-center !py-12">
      <div className="text-gray-400 text-6xl !mb-4">🔍</div>
      <h3 className="text-lg font-semibold text-gray-600 !mb-2">검색 결과가 없습니다</h3>
      <p className="text-gray-500">다른 키워드로 검색해보세요</p>
    </div>
  );
}
