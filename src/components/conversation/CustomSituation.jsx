import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ArrowLeft } from 'lucide-react';

export function CustomSituation({ onBack, onStartConversation }) {
  const [customSituation, setCustomSituation] = useState('');

  const handleStart = () => {
    if (customSituation.trim()) {
      onStartConversation(customSituation);
    }
  };

  return (
    <div className="custom-situation">
      <div className="custom-situation__header">
        <Button
          className="custom-situation__back-button"
          variant="ghost"
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft />
          돌아가기
        </Button>
      </div>

      <Card className="custom-situation__card">
        <CardHeader>
          <CardTitle>✏️ 커스텀 상황 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="input-label">
              연습하고 싶은 상황을 자세히 설명해주세요
            </label>
            <Textarea
              placeholder="예: 새로운 직장에서 동료들과 첫 인사를 나누는 상황"
              value={customSituation}
              onChange={(e) => setCustomSituation(e.target.value)}
              className="situation-input"
            />
          </div>

          <div className="tips-section">
            <h4 className="tips-title">💡 팁</h4>
            <ul className="tips-list">
              <li>• 구체적인 상황을 제시할수록 더 나은 연습이 가능합니다</li>
              <li>• 역할(당신의 역할, AI의 역할)을 명시하면 더 좋습니다</li>
              <li>• 난이도를 조절하고 싶다면 "초급자를 위한" 같은 표현을 추가하세요</li>
            </ul>
          </div>

          <Button 
            onClick={handleStart}
            disabled={!customSituation.trim()}
            className="custom-situation__start-button"
          >
            회화 시작하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}