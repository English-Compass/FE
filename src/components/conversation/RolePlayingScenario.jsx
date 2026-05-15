import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../ui/badge';

const API_BASE_URL = '/api/speech';

const DIFFICULTY_LEVELS = [
  { id: 'BEGINNER', title: '초급', description: '기본 어휘, 짧은 문장, 현재시제', color: 'bg-green-100 text-green-800' },
  { id: 'INTERMEDIATE', title: '중급', description: '일반 어휘, 복잡한 문장 구조, 과거/미래시제', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'ADVANCED', title: '고급', description: '고급 어휘, 복잡한 문장, 관용구 사용', color: 'bg-red-100 text-red-800' }
];

export function RolePlayingScenario({ onBack, onStartConversation }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/role-playing/scenarios`);
      
      if (!response.ok) {
        throw new Error('시나리오 목록을 가져오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setScenarios(data);
    } catch (error) {
      console.error('시나리오 로딩 오류:', error);
      setError(error.message);
      // 임시 더미 데이터 - 카테고리 이름만 표시
      setScenarios([
        {
          id: 'cafe',
          name: '카페'
        },
        {
          id: 'restaurant',
          name: '식당'
        },
        {
          id: 'hotel',
          name: '호텔'
        },
        {
          id: 'shop',
          name: '상점'
        },
        {
          id: 'doctor',
          name: '병원'
        },
        {
          id: 'airport',
          name: '공항'
        },
        {
          id: 'bank',
          name: '은행'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (selectedDifficulty && selectedScenario) {
      // 상황 상세 화면으로 이동
      onStartConversation({
        type: 'situation-detail',
        difficultyLevel: selectedDifficulty,
        selectedScenario: selectedScenario
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 !p-4 !md:px-6 !md:py-4">
        <div className="flex items-center">
          <Button variant="ghost" size="ml" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 !mr-2" />
            돌아가기
          </Button>
        </div>
        <div className="text-center !py-8">
          <p>시나리오를 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-800 !mb-2">🎭 롤 플레잉 회화</h1>
        <p className="text-gray-600">구체적인 상황에서 역할을 맡아 대화해보세요</p>
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

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle>2️⃣ 시나리오 선택</CardTitle>
        </CardHeader>
        <CardContent className="!space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-all ${
                  selectedScenario?.id === scenario.id
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedScenario(scenario)}
              >
                <CardContent className="!p-4 text-center">
                  <h3 className="font-bold text-lg">{scenario.name}</h3>
                  <div className="!mt-2 text-xs text-blue-600">
                    세부 상황은 랜덤으로 생성됩니다
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      <Button
        onClick={handleStart}
        disabled={!selectedDifficulty || !selectedScenario}
        className="!w-full !py-3 !text-lg"
      >
        회화 시작하기
      </Button>
    </div>
  );
}
