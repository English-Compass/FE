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
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <Button
          className="bg-transparent border-0 text-gray-500 cursor-pointer rounded-md transition duration-300 ease-in-out hover:text-gray-700 hover:bg-gray-50"
          variant="ghost"
          size="ml"
          onClick={onBack}
        >
          <ArrowLeft />
          돌아가기
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>✏️ 커스텀 상황 설정</CardTitle>
        </CardHeader>
        <CardContent className="!space-y-6">
          <div>
            <label className="block font-semibold !mb-2">
              연습하고 싶은 상황을 자세히 설명해주세요
            </label>
            <Textarea
              placeholder="예: 새로운 직장에서 동료들과 첫 인사를 나누는 상황"
              value={customSituation}
              onChange={(e) => setCustomSituation(e.target.value)}
              className="
                w-full min-h-[120px] !p-4 !border-2 !border-gray-200 bg-gray-50 
                rounded-lg text-base resize-y transition-colors duration-300 ease-in-out
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-500/20
                "
            />
          </div>

          <div className="rounded-lg bg-sky-50 !p-4">
            <h4 className="!mb-2 font-semibold">💡 팁</h4>
            <ul className="!mb-1 text-ml">
              <li>• 구체적인 상황을 제시할수록 더 나은 연습이 가능합니다</li>
              <li>• 역할(당신의 역할, AI의 역할)을 명시하면 더 좋습니다</li>
              <li>• 난이도를 조절하고 싶다면 "초급자를 위한" 같은 표현을 추가하세요</li>
            </ul>
          </div>

          <Button 
            onClick={handleStart}
            disabled={!customSituation.trim()}
            className="!mt-4 w-full bg-[#1e88e5] hover:bg-[#0d6fce]"
          >
            회화 시작하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}