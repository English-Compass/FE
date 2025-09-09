import React from 'react';

export function NoResults({ isSearch = false }) {
  return (
    <div className="text-center !py-12">
      <div className="text-gray-400 text-6xl !mb-4">
        {isSearch ? '🔍' : '🎬'}
      </div>
      <h3 className="text-lg font-semibold text-gray-600 !mb-2">
        {isSearch ? '검색 결과가 없습니다' : '추천된 미디어가 없습니다'}
      </h3>
      <p className="text-gray-500">
        {isSearch ? '다른 키워드로 검색해보세요' : '위의 "추천 받기" 버튼을 눌러 맞춤 추천을 받아보세요'}
      </p>
    </div>
  );
}
