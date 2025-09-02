import React from 'react';
import { MediaCard } from './MediaCard';
import { NoResults } from './NoResults';

// API: 서버에서 미디어 콘텐츠 목록을 가져와야 합니다.
// 예: useEffect(() => { fetch('/api/media').then(res => res.json()).then(data => setFilteredContent(data)); }, []);

export function MediaGrid({ filteredContent, getLevelColor, getLevelText, onWatchContent }) {
  if (filteredContent.length === 0) {
    return <NoResults />;
  }

  return (
    <div className="media-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContent.map((content) => (
        <MediaCard
          key={content.id}
          content={content}
          getLevelColor={getLevelColor}
          getLevelText={getLevelText}
          onWatchContent={onWatchContent}
        />
      ))}
    </div>
  );
}
