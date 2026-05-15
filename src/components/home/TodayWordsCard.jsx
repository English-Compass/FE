import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function TodayWordsCard({ words }) {
  const navigate = useNavigate();
  // 백엔드에서 전달된 words 중 무작위 3개만 표시
  const sampleWords = React.useMemo(() => {
    if (!Array.isArray(words) || words.length === 0) return [];
    const idx = Array.from({ length: words.length }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx.slice(0, 3).map(i => words[i]);
  }, [words]);

  const handleMoreWords = () => {
    navigate('/dashboard/wordbook');
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📚</span>
          <span>오늘의 단어</span>
          <Badge variant="outline">{words.length}개</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        {sampleWords.map((word, index) => (
          <div key={index} className="bg-gray-50 border border-gray-300 rounded-lg !p-4">
            <div className="flex justify-between">
              <h4>{word.word}</h4>
              <span>#{index + 1}</span>
            </div>
            <p className="text-black">{word.meaning}</p>
            <p className="text-lg text-gray-500 italic">{word.example}</p>
          </div>
        ))}
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full"
          onClick={handleMoreWords}
        >
          더 많은 단어 학습하기
        </Button>
      </CardContent>
    </Card>
  );
}