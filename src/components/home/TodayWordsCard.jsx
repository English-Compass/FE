import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function TodayWordsCard({ words }) {
  const navigate = useNavigate();

  // TODO: API 연동 - 오늘의 추천 단어 가져오기
  // const fetchTodayWords = async () => {
  //   const response = await fetch('http://localhost:8080/api/words/today', {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //       'Content-Type': 'application/json'
  //     }
  //   });
  //   return response.json();
  // };

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
        {words.slice(0, 3).map((word, index) => (
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