import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft } from 'lucide-react';

export function ScenarioSelection({ 
  user, 
  onGeneralConversation,
  onRolePlayingScenario,
  onCustomRolePlaying,
  onFeedbackHistory,
  onBackToHome 
}) {
  const getLevelDisplay = (userLevel) => {
    const levelMapping = { 'A': '초급', 'B': '중급', 'C': '상급' };
    return levelMapping[userLevel] || '중급';
  };

  return (
    <div className="!p-4 !sm:p-6 !space-y-6">
      {/* Header */}
      <div className="!space-y-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="ml"
            onClick={onBackToHome}
          >
            <ArrowLeft className="w-4 h-4 !mr-2" />
            홈으로
          </Button>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">💬 회화 학습</h1>
          <p className="text-gray-600">
            원하는 회화 유형을 선택해서 AI와 영어 회화를 연습해보세요
          </p>
        </div>
      </div>

      {/* Conversation Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mb-8">
        {/* 일반 회화 */}
        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onGeneralConversation}>
          <CardContent className="!p-6 text-center">
            <div className="text-4xl !mb-4">💭</div>
            <h3 className="text-lg font-bold !mb-2">일반 회화</h3>
            <p className="text-gray-600 !mb-4">자유로운 주제로 AI와 자연스럽게 대화해보세요</p>
            <Badge variant="outline" className="text-xs">
              난이도 선택 + 주제 입력
            </Badge>
          </CardContent>
        </Card>

        {/* 롤 플레잉 회화 */}
        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onRolePlayingScenario}>
          <CardContent className="!p-6 text-center">
            <div className="text-4xl !mb-4">🎭</div>
            <h3 className="text-lg font-bold !mb-2">롤 플레잉 회화</h3>
            <p className="text-gray-600 !mb-4">구체적인 상황에서 역할을 맡아 대화해보세요</p>
            <Badge variant="outline" className="text-xs">
              정해진 시나리오 선택
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Custom Role Playing and Feedback History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mt-8">
        {/* Custom Role Playing */}
        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onCustomRolePlaying}>
          <CardContent className="!p-6 text-center">
            <div className="text-4xl !mb-4">✏️</div>
            <h3 className="text-lg font-bold !mb-2">커스텀 롤 플레잉</h3>
            <p className="text-gray-600 !mb-4">원하는 역할과 상황을 직접 설정해서 연습해보세요</p>
            <Badge variant="outline" className="text-xs">
              AI/사용자 역할 + 상황 입력
            </Badge>
          </CardContent>
        </Card>

        {/* Feedback History */}
        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onFeedbackHistory}>
          <CardContent className="!p-6 text-center">
            <div className="text-4xl !mb-4">📊</div>
            <h3 className="text-lg font-bold !mb-2">피드백 히스토리</h3>
            <p className="text-gray-600 !mb-4">이전 회화 연습에서 받은 피드백을 확인해보세요</p>
            <Badge variant="outline" className="text-xs">
              과거 피드백 조회
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* User Level Info */}
      <div className="bg-blue-50 rounded-lg !p-4">
        <p className="text-sm text-blue-700">
          현재 레벨: <strong>Level {user?.level} ({getLevelDisplay(user?.level)})</strong>
        </p>
      </div>
    </div>
  );
}