import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { useApp } from '../../context/AppContext';

export function ReviewStats({ reviewQuestions }) {
    const { QUESTION_TYPES } = useApp();
    
    // 복습 문제 통계 계산
    // TODO: 실제 프로덕션에서는 서버에서 집계된 통계 데이터를 받아올 수 있음
    // GET /api/progress/{userId}/analytics
    const getStatistics = () => {
        const total = reviewQuestions.length;
        const word = reviewQuestions.filter(q => q.category === 'word').length;
        const sentence = reviewQuestions.filter(q => q.category === 'sentence').length;
        const conversation = reviewQuestions.filter(q => q.category === 'conversation').length;
        
        return { total, word, sentence, conversation };
  };

  const stats = getStatistics();

  return (
    <div className="grid grid-cols-4 gap-2">
      <Card>
        <CardContent className="!p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{stats.total}</div>
          <div className="text-sm text-gray-600">total</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="!p-4 text-center">
          <div className="text-3xl font-bold text-gray-600">{stats.sentence}</div>
          <div className="text-sm text-gray-600">sentence</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="!p-4 text-center">
          <div className="text-3xl font-bold text-gray-600">{stats.word}</div>
          <div className="text-sm text-gray-600">word</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="!p-4 text-center">
          <div className="text-3xl font-bold text-gray-600">{stats.conversation}</div>
          <div className="text-sm text-gray-600">conversation</div>
        </CardContent>
      </Card>
    </div>
  );
}