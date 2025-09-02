import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft } from 'lucide-react';

// API: 컴포넌트가 마운트될 때 서버로부터 시나리오 목록을 가져와야 합니다.
// 예: useEffect(() => { fetch('/api/scenarios').then(res => res.json()).then(data => setScenarios(data)); }, []);

export function ScenarioSelection({ 
  user, 
  scenarios, 
  onScenarioSelect, 
  onCustomSelect, 
  onBackToHome 
}) {
  const isScenarioSuitable = (scenario) => {
    const userLevel = user?.level || 'B';
    const levelMapping = { 'A': [1, 2], 'B': [3, 4], 'C': [5, 6] };
    const userLevelNumbers = levelMapping[userLevel] || [3, 4];
    
    return scenario.level.some(level => userLevelNumbers.includes(level));
  };

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
            상황을 선택하거나 직접 입력해서 AI와 영어 회화를 연습해보세요
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 !mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onCustomSelect}>
          <CardContent className="!p-6 text-center">
            <div className="text-4xl !mb-4">✏️</div>
            <h3 className="text-lg font-bold !mb-2">커스텀 상황</h3>
            <p className="text-gray-600">원하는 상황을 직접 입력해서 연습해보세요</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardContent className="!p-6 text-center">
            <div className="text-4xl !mb-4">🎯</div>
            <h3 className="text-lg font-bold !mb-2">추천 상황</h3>
            <p className="text-white/90">Level {user?.level} ({getLevelDisplay(user?.level)}) 수준에 맞는 상황을 선택하세요</p>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Selection */}
      <div>
        <h3 className="text-xl font-bold !mb-4">상황별 회화 연습</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <Card 
              key={scenario.id}
              className={`cursor-pointer transition-all ${
                isScenarioSuitable(scenario) 
                  ? 'hover:shadow-lg hover:scale-105' 
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => isScenarioSuitable(scenario) && onScenarioSelect(scenario)}
            >
              <CardContent className="!p-4">
                <div className="flex items-start justify-between !mb-3">
                  <div className="text-3xl">{scenario.icon}</div>
                  <div className="flex !space-x-1">
                    {scenario.level.map((level) => (
                      <Badge 
                        key={level} 
                        variant="outline"
                        className="text-xs"
                      >
                        L{level}
                      </Badge>
                    ))}
                  </div>
                </div>
                <h4 className="font-bold text-gray-800 !mb-2">{scenario.title}</h4>
                <p className="text-sm text-gray-600 !mb-3">{scenario.description}</p>
                {isScenarioSuitable(scenario) ? (
                  <Badge variant="outline" className="text-xs">
                    사용 가능
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Level {user?.level} 부적합
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}