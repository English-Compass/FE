import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useApp } from '../../context/AppContext';

export function ReviewQuestionItem({ question, onRetry, showCategory = true }) {
  const { QUESTION_TYPE_MAPPING, getDifficultyText } = useApp();
  
  // 난이도 변환 (백엔드 레벨 1,2,3 -> 프론트엔드 A,B,C)
  const getLevelFromDifficulty = (difficulty) => {
    if (!difficulty) return null;
    const levelMap = { 1: 'A', 2: 'B', 3: 'C' };
    return levelMap[difficulty] || difficulty;
  };
  
  // 카테고리 한글 변환
  const getCategoryLabel = (majorCategory) => {
    const categoryMap = {
      '비즈니스': '비즈니스',
      'BUSINESS': '비즈니스',
      '여행': '여행',
      'TRAVEL': '여행',
      '일상생활': '일상생활',
      'DAILY_LIFE': '일상생활',
      '학업': '학업',
      'STUDY': '학업'
    };
    return categoryMap[majorCategory] || majorCategory || '미분류';
  };
  
  // 시간 포맷팅 (초 -> 분 초)
  const formatTimeSpent = (seconds) => {
    if (!seconds && seconds !== 0) return '';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return remainingSeconds > 0 
        ? `${minutes}분 ${remainingSeconds}초`
        : `${minutes}분`;
    } else {
      return `${remainingSeconds}초`;
    }
  };
  
  // 날짜 포맷팅 (년 월 일 시간, 초 제외)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // 유효하지 않은 날짜면 원본 반환
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      // 오전/오후 구분
      const ampm = hours >= 12 ? '오후' : '오전';
      const displayHours = hours % 12 || 12; // 0시는 12시로 표시
      const displayMinutes = minutes.toString().padStart(2, '0');
      
      return `${year}년 ${month}월 ${day}일 ${ampm} ${displayHours}시 ${displayMinutes}분`;
    } catch (error) {
      console.error('날짜 포맷팅 오류:', error);
      return dateString;
    }
  };
  
  return (
    <Card className="!border-l-4 border-gray-400 hover:shadow-md transition-shadow">
      <CardContent className="!p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 !space-y-3">
            {/* 문제 유형, 카테고리, 난이도 배지 */}
            <div className="flex flex-wrap items-center gap-2">
              {showCategory && question.questionType && (
                <Badge variant="outline" className="text-xs">
                  {QUESTION_TYPE_MAPPING[question.questionType] || question.questionType}
                </Badge>
              )}
              {question.majorCategory && (
                <Badge variant="secondary" className="text-xs">
                  📁 {getCategoryLabel(question.majorCategory)}
                </Badge>
              )}
              {question.difficulty && (
                <Badge variant="outline" className="text-xs">
                  난이도: {getDifficultyText(getLevelFromDifficulty(question.difficulty))}
                </Badge>
              )}
            </div>
            
            {/* 문제 내용 */}
            <p className="font-medium text-gray-800 leading-relaxed">
              {question.question}
            </p>
            
            {/* 사용자가 선택한 답안과 정답 */}
            <div className="text-sm text-gray-600 !space-y-2">
              {question.userAnswerText && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-red-600">내가 선택한 답안:</span>
                  <span className="bg-red-50 !px-2 !py-1 rounded text-red-700 font-medium">
                    {question.userAnswerText}
                  </span>
                  {question.userAnswer && (
                    <span className="text-xs text-gray-500">({question.userAnswer})</span>
                  )}
                </div>
              )}
              {question.correctAnswerText && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-green-600">정답:</span>
                  <span className="bg-green-50 !px-2 !py-1 rounded text-green-700 font-medium">
                    {question.correctAnswerText}
                  </span>
                  {question.correctAnswer && (
                    <span className="text-xs text-gray-500">({question.correctAnswer})</span>
                  )}
                </div>
              )}
              
              {/* 문제를 푼 날짜와 시간 */}
              {question.answeredAt && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span>📅</span> {formatDate(question.answeredAt)}
                </p>
              )}
              
              {/* 문제를 푸는 데 걸린 시간 */}
              {question.timeSpent !== undefined && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span>⏱️</span> 푼 시간: {formatTimeSpent(question.timeSpent)}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="!ml-4 shrink-0 hover:bg-blue-50 hover:border-blue-300"
          >
            다시 풀기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
