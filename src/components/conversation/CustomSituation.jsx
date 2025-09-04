import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../ui/badge';

const DIFFICULTY_LEVELS = [
  { id: 'BEGINNER', title: '초급', description: '기본 어휘, 짧은 문장, 현재시제', color: 'bg-green-100 text-green-800' },
  { id: 'INTERMEDIATE', title: '중급', description: '일반 어휘, 복잡한 문장 구조, 과거/미래시제', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'ADVANCED', title: '고급', description: '고급 어휘, 복잡한 문장, 관용구 사용', color: 'bg-red-100 text-red-800' }
];

export function CustomSituation({ onBack, onStartConversation }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [aiRole, setAiRole] = useState('');
  const [userRole, setUserRole] = useState('');
  const [customSituation, setCustomSituation] = useState('');

  const handleStart = () => {
    if (selectedDifficulty && aiRole && userRole && customSituation.trim()) {
      onStartConversation({
        type: 'role-playing-custom',
        difficultyLevel: selectedDifficulty,
        customAiRole: aiRole,
        customUserRole: userRole,
        customSituation: customSituation
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 !p-4 !md:px-6 !md:py-4">
      {/* Header */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="ml"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 !mr-2" />
          돌아가기
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800 !mb-2">✏️ 커스텀 롤 플레잉</h1>
        <p className="text-gray-600">원하는 역할과 상황을 직접 설정해서 연습해보세요</p>
      </div>

      {/* Difficulty Selection */}
      <Card>
        <CardHeader>
          <CardTitle>1️⃣ 난이도 선택</CardTitle>
        </CardHeader>
        <CardContent className="!space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DIFFICULTY_LEVELS.map((level) => (
              <Card
                key={level.id}
                className={`cursor-pointer transition-all ${
                  selectedDifficulty === level.id
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedDifficulty(level.id)}
              >
                <CardContent className="!p-4 text-center">
                  <h3 className="font-bold !mb-2">{level.title}</h3>
                  <p className="text-sm text-gray-600 !mb-3">{level.description}</p>
                  <Badge className={level.color}>
                    {level.id}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Settings */}
      <Card>
        <CardHeader>
          <CardTitle>2️⃣ 역할 설정</CardTitle>
        </CardHeader>
        <CardContent className="!space-y-4">
          <div>
            <label className="block font-semibold !mb-2">
              AI의 역할
            </label>
            <Input
              placeholder="예: 영어 선생님, 의사, 점원, 호텔 직원"
              value={aiRole}
              onChange={(e) => setAiRole(e.target.value)}
              className="!w-full"
            />
          </div>
          
          <div>
            <label className="block font-semibold !mb-2">
              내 역할
            </label>
            <Input
              placeholder="예: 학생, 환자, 고객, 투숙객"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="!w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Situation Description */}
      <Card>
        <CardHeader>
          <CardTitle>3️⃣ 상황 설명</CardTitle>
        </CardHeader>
        <CardContent className="!space-y-4">
          <div>
            <label className="block font-semibold !mb-2">
              연습하고 싶은 상황을 자세히 설명해주세요
            </label>
            <Textarea
              placeholder="예: 학교에서 영어 수업을 듣고 있습니다. 선생님이 질문을 하고 있습니다."
              value={customSituation}
              onChange={(e) => setCustomSituation(e.target.value)}
              className="w-full min-h-[120px] !p-4 !border-2 !border-gray-200 bg-gray-50 
                rounded-lg text-base resize-y transition-colors duration-300 ease-in-out
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="rounded-lg bg-sky-50 !p-4">
            <h4 className="!mb-2 font-semibold">💡 팁</h4>
            <ul className="!mb-1 text-sm">
              <li>• 구체적인 상황을 제시할수록 더 나은 연습이 가능합니다</li>
              <li>• 대화의 맥락과 목적을 명확히 하세요</li>
              <li>• 실제 상황에서 발생할 수 있는 문제나 질문을 포함하세요</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      <Button
        onClick={handleStart}
        disabled={!selectedDifficulty || !aiRole || !userRole || !customSituation.trim()}
        className="!w-full !py-3 !text-lg"
      >
        회화 시작하기
      </Button>
    </div>
  );
}