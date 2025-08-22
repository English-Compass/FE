import React, { useMemo } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useApp } from '../../context/AppContext';

export function QuickReview({ reviewQuestions, onStartReview, onStartWeakTypeReview }) {
  const { QUESTION_TYPE_MAPPING } = useApp();

  // 문제 유형별 틀린 문제 개수 분석
  const weaknessAnalysis = useMemo(() => {
    if (!reviewQuestions || reviewQuestions.length === 0) return [];

    const typeCount = {};
    const typeNames = {
      'word': '단어',
      'sentence': '문장 해석', 
      'synonym': '동의어 찾기',
      'sentence-interpretation': '문장 해석',
      'fill-in-blank': '빈칸 채우기'
    };

    reviewQuestions.forEach(question => {
      const questionType = question.questionType || question.category || 'word';
      const mappedType = QUESTION_TYPE_MAPPING[questionType] || questionType;
      
      if (!typeCount[mappedType]) {
        typeCount[mappedType] = {
          count: 0,
          displayName: typeNames[mappedType] || mappedType,
          icon: mappedType === 'word' ? '📝' : 
                mappedType === 'sentence' ? '📖' :
                mappedType === 'synonym' ? '🔗' :
                mappedType === 'sentence-interpretation' ? '🔄' :
                mappedType === 'fill-in-blank' ? '✏️' : '❓'
        };
      }
      typeCount[mappedType].count++;
    });

    return Object.entries(typeCount)
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [reviewQuestions, QUESTION_TYPE_MAPPING]);

  const mostWeakType = weaknessAnalysis[0];
  const hasWeakness = weaknessAnalysis.length > 0;

  return (
    <div className="space-y-4">
      {/* 전체 복습하기 카드 */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-400 !text-white">
        <CardContent className="!p-6">
          <h3 className="text-xl font-bold !mb-2">📚 전체 복습하기</h3>
          <p className="text-sm opacity-90 !mb-4">
            모든 틀린 문제를 차례대로 다시 풀어보세요
          </p>
          <Button 
            onClick={onStartReview}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 border border-white/30 !text-white"
            disabled={!reviewQuestions || reviewQuestions.length === 0}
          >
            복습 시작하기 - {reviewQuestions?.length || 0}문제
          </Button>
        </CardContent>
      </Card>

      {/* 약점 분석 및 집중 복습 카드 */}
      {hasWeakness && (
        <Card className="bg-gradient-to-r from-red-500 to-pink-500 !text-white">
          <CardContent className="!p-6">
            <div className="flex items-center justify-between !mb-3">
              <h3 className="text-xl font-bold">🎯 약점 집중 복습</h3>
              <Badge className="bg-white/20 text-white border-white/30">
                가장 많이 틀림
              </Badge>
            </div>
            <div className="!mb-4">
              <p className="text-sm opacity-90 !mb-2">
                가장 많이 틀린 문제 유형을 집중적으로 복습하세요
              </p>
              <div className="flex items-center !space-x-2">
                <span className="text-2xl">{mostWeakType.icon}</span>
                <span className="font-semibold">{mostWeakType.displayName}</span>
                <span className="bg-white/20 px-2 py-1 rounded text-xs">
                  {mostWeakType.count}문제 틀림
                </span>
              </div>
            </div>
            <Button 
              onClick={() => onStartWeakTypeReview && onStartWeakTypeReview(mostWeakType.type)}
              variant="outline"
              className="bg-white/20 hover:bg-white/30 border border-white/30 !text-white"
              disabled={!onStartWeakTypeReview}
            >
              {mostWeakType.displayName} 집중 복습하기
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 약점 분석 상세 카드 */}
      {hasWeakness && (
        <Card>
          <CardContent className="!p-6">
            <h3 className="text-lg font-bold text-gray-800 !mb-4">📊 문제 유형별 틀린 횟수</h3>
            <div className="space-y-3">
              {weaknessAnalysis.map((weakness, index) => (
                <div key={weakness.type} className="flex items-center justify-between !p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center !space-x-3">
                    <span className="text-xl">{weakness.icon}</span>
                    <span className="font-medium text-gray-700">{weakness.displayName}</span>
                  </div>
                  <div className="flex items-center !space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 !min-w-24">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-red-500' :
                          index === 1 ? 'bg-orange-400' :
                          'bg-yellow-400'
                        }`}
                        style={{ 
                          width: `${(weakness.count / weaknessAnalysis[0].count) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <Badge variant={index === 0 ? 'destructive' : index === 1 ? 'default' : 'secondary'}>
                      {weakness.count}문제
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!hasWeakness && (
        <Card className="bg-gradient-to-r from-green-500 to-emerald-400 !text-white">
          <CardContent className="!p-6 text-center">
            <h3 className="text-xl font-bold !mb-2">🎉 완벽해요!</h3>
            <p className="text-sm opacity-90">
              현재 복습할 틀린 문제가 없습니다. 계속 학습해서 실력을 늘려보세요!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}