import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export function QuickReview({ reviewQuestions, onStartReview }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-400 !text-white">
        <CardContent className="!p-6">
          <h3 className="text-xl font-bold !mb-2">전체 복습하기</h3>
          <p className="text-sm opacity-90 !mb-4">
            모든 틀린 문제를 차례대로 다시 풀어보세요
          </p>
          <Button 
            onClick={onStartReview}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 border border-white/30 !text-white"
          >
            복습 시작하기 - {reviewQuestions.length}문제
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-indigo-500 to-blue-500 !text-white">
        <CardContent className="!p-6">
          <h3 className="text-xl font-bold !mb-2">약점 분석</h3>
          <p className="text-sm opacity-90 !mb-4">
            자주 틀리는 유형을 파악하고 집중 학습하세요
          </p>
          <Button 
            // 약점 분석 보기 버튼 추가 구현 
            variant="outline"
            className="bg-white/20 hover:bg-white/30 border border-white/30 !text-white"
          >
            분석 보기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}