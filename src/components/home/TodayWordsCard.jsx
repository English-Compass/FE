import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { wordDatabase } from '../../data/wordDatabase.js';

export function TodayWordsCard({ words }) {
  const navigate = useNavigate();
  
  // 프론트엔드에서 랜덤으로 3개 단어 선택
  const sampleWords = React.useMemo(() => {
    // 모든 단어를 하나의 배열로 합치기
    const allWords = [];
    Object.values(wordDatabase).forEach(categoryWords => {
      allWords.push(...categoryWords);
    });
    
    // 랜덤하게 섞기
    const shuffled = [...allWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // 처음 3개 선택
    return shuffled.slice(0, 3);
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시에만 실행

  const handleMoreWords = () => {
    navigate('/dashboard/word-study');
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