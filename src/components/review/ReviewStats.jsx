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
        
        return { total, word, sentence };
  };

  const stats = getStatistics();

  return (
    <div className="grid grid-cols-3 gap-2">
      <Card>
        <CardContent className="!p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{stats.total}</div>
          <div className="text-sm text-gray-600">총 틀린 문제</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="!p-4 text-center">
          <div className="text-3xl font-bold text-gray-600">{stats.sentence}</div>
          <div className="text-sm text-gray-600">문법 문제</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="!p-4 text-center">
          <div className="text-3xl font-bold text-gray-600">{stats.word}</div>
          <div className="text-sm text-gray-600">어휘 문제</div>
        </CardContent>
      </Card>
    </div>
  );
}