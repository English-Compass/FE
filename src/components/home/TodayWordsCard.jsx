import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function TodayWordsCard({ words: initialWords }) {
  const navigate = useNavigate();
  const [words, setWords] = useState(initialWords || []);
  const [isLoading, setIsLoading] = useState(!initialWords);
  const [error, setError] = useState(null);

  // API: 서버에서 오늘의 추천 단어 목록을 가져옵니다.
  useEffect(() => { 
    const fetchTodayWords = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Word Study API를 사용하여 사용자 맞춤형 단어 목록 생성
        const response = await fetch('http://localhost:8080/api/word-study/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: 'user_123', // 실제 사용자 ID
            wordCount: 5, // 오늘의 단어는 5개만 표시
            focusCategory: null, // 사용자 약점에 따라 자동 선택
            targetDifficulty: null // 사용자 수준에 따라 자동 선택
          })
        });
        
        if (!response.ok) {
          throw new Error('단어 데이터 조회 실패');
        }
        
        const data = await response.json();
        
        if (data.success && data.words) {
          // API 응답 형태를 컴포넌트에서 사용하는 형태로 변환
          const formattedWords = data.words.map(wordObj => ({
            word: wordObj.word,
            meaning: wordObj.definition,
            example: wordObj.exampleSentence
          }));
          setWords(formattedWords);
        } else {
          throw new Error(data.errorMessage || '단어 데이터 처리 실패');
        }
        
      } catch (err) {
        console.error('오늘의 단어 조회 실패:', err);
        setError('단어를 불러오는 데 실패했습니다.');
        
        // 실패 시 더미 데이터 사용
        setWords([
          {
            word: "efficient",
            meaning: "효율적인",
            example: "She found an efficient way to solve the problem."
          },
          {
            word: "challenging", 
            meaning: "도전적인",
            example: "This project is quite challenging but rewarding."
          },
          {
            word: "innovative",
            meaning: "혁신적인", 
            example: "The company introduced an innovative solution."
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // 초기 단어가 없는 경우에만 API 호출
    if (!initialWords || initialWords.length === 0) {
      fetchTodayWords();
    }
  }, [initialWords]);

  const handleMoreWords = () => {
    navigate('/dashboard/wordbook');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📚</span>
            <span>오늘의 단어</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center !py-8">
          <p>단어 로딩 중...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📚</span>
            <span>오늘의 단어</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center !py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={handleMoreWords}
          >
            단어장으로 이동
          </Button>
        </CardContent>
      </Card>
    );
  }

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