import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { wordDatabase } from '../../data/wordDatabase.js';

export default function WordStudy() {
  const navigate = useNavigate();
  const [studyWords, setStudyWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [completedWords, setCompletedWords] = useState(new Set());

  // 랜덤 단어 8개 선택
  useEffect(() => {
    const generateRandomWords = () => {
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
      
      // 처음 8개 선택
      setStudyWords(shuffled.slice(0, 8));
      setCurrentWordIndex(0);
      setShowMeaning(false);
      setCompletedWords(new Set());
    };

    generateRandomWords();
  }, []);

  const currentWord = studyWords[currentWordIndex];

  const handleShowMeaning = () => {
    setShowMeaning(true);
  };

  const handleNextWord = () => {
    if (currentWordIndex < studyWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowMeaning(false);
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowMeaning(false);
    }
  };

  const handleCompleteWord = () => {
    setCompletedWords(prev => new Set([...prev, currentWordIndex]));
    handleNextWord();
  };

  const handleRestart = () => {
    // 새로운 랜덤 단어 8개 생성
    const allWords = [];
    Object.values(wordDatabase).forEach(categoryWords => {
      allWords.push(...categoryWords);
    });
    
    const shuffled = [...allWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setStudyWords(shuffled.slice(0, 8));
    setCurrentWordIndex(0);
    setShowMeaning(false);
    setCompletedWords(new Set());
  };

  const handleGoBack = () => {
    navigate('/dashboard/home');
  };

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">단어를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">📚 단어 학습</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {currentWordIndex + 1} / {studyWords.length}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestart}
              className="flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              새로고침
            </Button>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentWordIndex + 1) / studyWords.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {completedWords.size}개 완료
          </p>
        </div>

        {/* 단어 카드 */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Badge 
                variant="outline" 
                className={`px-3 py-1 ${
                  currentWord.level === 'A' ? 'bg-green-50 text-green-700 border-green-200' :
                  currentWord.level === 'B' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {currentWord.level === 'A' ? '초급' : 
                 currentWord.level === 'B' ? '중급' : '상급'}
              </Badge>
            </div>
            <CardTitle className="text-4xl font-bold text-gray-800 mb-2">
              {currentWord.word}
            </CardTitle>
            <Badge variant="secondary" className="inline-block">
              {currentWord.category === 'travel' ? '여행' :
               currentWord.category === 'business' ? '비즈니스' :
               currentWord.category === 'daily' ? '일상' : '학술'}
            </Badge>
          </CardHeader>
          
          <CardContent className="text-center">
            {!showMeaning ? (
              <div className="space-y-4">
                <p className="text-gray-600 text-lg">단어의 의미를 생각해보세요</p>
                <Button 
                  onClick={handleShowMeaning}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  의미 보기
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">의미</h3>
                  <p className="text-blue-900 text-lg">{currentWord.meaning}</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">예문</h3>
                  <p className="text-gray-800 italic">"{currentWord.example}"</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handlePreviousWord}
                    disabled={currentWordIndex === 0}
                  >
                    이전 단어
                  </Button>
                  <Button
                    onClick={handleCompleteWord}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {currentWordIndex === studyWords.length - 1 ? '학습 완료' : '다음 단어'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 단어 목록 미리보기 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">학습할 단어 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {studyWords.map((word, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-center ${
                    index === currentWordIndex 
                      ? 'border-blue-500 bg-blue-50' 
                      : completedWords.has(index)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <p className="font-medium text-sm">{word.word}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {word.level === 'A' ? '초급' : 
                     word.level === 'B' ? '중급' : '상급'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
