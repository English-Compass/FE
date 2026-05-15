import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../ui/badge';

const API_BASE_URL = '/api/speech';

export function SituationDetail({ 
  selectedScenario, 
  difficultyLevel, 
  user,
  onBack, 
  onStartConversation 
}) {
  const [situation, setSituation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateSituation();
  }, []);

  const generateSituation = async () => {
    try {
      setLoading(true);
      
      // 서버에 시나리오 요청을 보내서 랜덤 상황을 생성
      const response = await fetch(`${API_BASE_URL}/role-playing/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          difficultyLevel: difficultyLevel,
          scenarioId: selectedScenario.id
        }),
      });

      if (!response.ok) {
        throw new Error('상황 생성에 실패했습니다.');
      }

      const data = await response.json();
      setSituation(data);
    } catch (error) {
      console.error('상황 생성 오류:', error);
      setError(error.message);
      
      // 임시 더미 데이터 (실제로는 서버에서 받아와야 함)
      const getCharacterSpecificGreeting = (scenarioId, difficultyLevel) => {
        const greetings = {
          'cafe': {
            'BEGINNER': 'Hello! What can I get you today?',
            'INTERMEDIATE': 'Good morning! Welcome to our cafe. How can I help you?',
            'ADVANCED': 'Good day! Thank you for visiting us. What beverage or pastry would you like to try today?'
          },
          'restaurant': {
            'BEGINNER': 'Hello! Are you ready to order?',
            'INTERMEDIATE': 'Good evening! Welcome to our restaurant. Would you like to see the menu?',
            'ADVANCED': 'Good evening and welcome! I\'m your server today. May I start you with some appetizers or beverages?'
          },
          'hotel': {
            'BEGINNER': 'Hello! Can I help you?',
            'INTERMEDIATE': 'Good day! Welcome to our hotel. How may I assist you today?',
            'ADVANCED': 'Welcome to The Grand Hotel! I\'m here to ensure your stay is exceptional. How may I be of service?'
          },
          'shop': {
            'BEGINNER': 'Hello! Looking for something?',
            'INTERMEDIATE': 'Good afternoon! Welcome to our store. Are you looking for anything specific?',
            'ADVANCED': 'Welcome! I\'d be delighted to help you find exactly what you\'re looking for today.'
          },
          'doctor': {
            'BEGINNER': 'Hello! How are you feeling?',
            'INTERMEDIATE': 'Good morning! Please have a seat. What brings you in today?',
            'ADVANCED': 'Good morning! I\'m Dr. Smith. Please make yourself comfortable. What symptoms have you been experiencing?'
          },
          'airport': {
            'BEGINNER': 'Hello! Need help?',
            'INTERMEDIATE': 'Good day! Welcome to the airport. How can I assist you?',
            'ADVANCED': 'Welcome to International Airport! I\'m here to help with any travel-related inquiries you might have.'
          },
          'bank': {
            'BEGINNER': 'Hello! How can I help?',
            'INTERMEDIATE': 'Good morning! Welcome to our bank. What can I do for you today?',
            'ADVANCED': 'Good morning and welcome to First National Bank! I\'m here to assist you with all your banking needs.'
          }
        };
        
        return greetings[scenarioId]?.[difficultyLevel] || 'Hello! How can I help you?';
      };

      setSituation({
        sessionId: 'temp_session_123',
        aiRole: selectedScenario.id === 'cafe' ? '바리스타' : 
                selectedScenario.id === 'restaurant' ? '웨이터' :
                selectedScenario.id === 'hotel' ? '호텔 직원' :
                selectedScenario.id === 'shop' ? '점원' :
                selectedScenario.id === 'doctor' ? '의사' :
                selectedScenario.id === 'airport' ? '공항 직원' :
                selectedScenario.id === 'bank' ? '은행원' : '직원',
        userRole: selectedScenario.id === 'cafe' ? '고객' : 
                 selectedScenario.id === 'restaurant' ? '손님' :
                 selectedScenario.id === 'hotel' ? '투숙객' :
                 selectedScenario.id === 'shop' ? '고객' :
                 selectedScenario.id === 'doctor' ? '환자' :
                 selectedScenario.id === 'airport' ? '여행객' :
                 selectedScenario.id === 'bank' ? '고객' : '고객',
        situation: selectedScenario.id === 'cafe' ? '카페에서 음료를 주문하고 있습니다.' :
                  selectedScenario.id === 'restaurant' ? '식당에서 주문한 음식과 다른 음식을 받았습니다.' :
                  selectedScenario.id === 'hotel' ? '호텔에 체크인하려고 합니다.' :
                  selectedScenario.id === 'shop' ? '상점에서 물건을 구매하려고 합니다.' :
                  selectedScenario.id === 'doctor' ? '병원에서 증상을 설명하려고 합니다.' :
                  selectedScenario.id === 'airport' ? '공항에서 수하물을 찾으려고 합니다.' :
                  selectedScenario.id === 'bank' ? '은행에서 계좌를 개설하려고 합니다.' :
                  '상황을 설정하고 있습니다.',
        aiFirstGreeting: getCharacterSpecificGreeting(selectedScenario.id, difficultyLevel)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (situation) {
      onStartConversation({
        type: 'role-playing-scenario',
        difficultyLevel: difficultyLevel,
        scenarioId: selectedScenario.id,
        sessionId: situation.sessionId,
        aiRole: situation.aiRole,
        userRole: situation.userRole,
        situation: situation.situation,
        aiFirstGreeting: situation.aiFirstGreeting
      });
    }
  };

  const getDifficultyDisplay = (level) => {
    const levelMapping = { 
      'BEGINNER': '초급', 
      'INTERMEDIATE': '중급', 
      'ADVANCED': '고급' 
    };
    return levelMapping[level] || '중급';
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
          <p>상황을 생성하는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 !p-4 !md:px-6 !md:py-4">
        <div className="flex items-center">
          <Button variant="ghost" size="ml" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 !mr-2" />
            돌아가기
          </Button>
        </div>
        <div className="text-center !py-8">
          <p className="text-red-600">오류가 발생했습니다: {error}</p>
          <Button onClick={generateSituation} className="!mt-4">
            다시 시도
          </Button>
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
        <h1 className="text-2xl font-bold text-gray-800 !mb-2">🎭 롤 플레잉 상황</h1>
        <p className="text-gray-600">생성된 상황을 확인하고 회화를 시작하세요</p>
      </div>

      {/* Situation Details */}
      <Card>
        <CardHeader>
          <CardTitle>생성된 상황</CardTitle>
        </CardHeader>
        <CardContent className="!space-y-6">
          {/* Scenario Info */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{selectedScenario.name}</h3>
              <Badge className="!mt-1">
                {getDifficultyDisplay(difficultyLevel)}
              </Badge>
            </div>
          </div>

          {/* Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="!p-4">
                <h4 className="font-semibold !mb-2">🤖 AI 역할</h4>
                <p className="text-lg">{situation?.aiRole}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50">
              <CardContent className="!p-4">
                <h4 className="font-semibold !mb-2">👤 내 역할</h4>
                <p className="text-lg">{situation?.userRole}</p>
              </CardContent>
            </Card>
          </div>

          {/* Situation Description */}
          <Card className="bg-gray-50">
            <CardContent className="!p-4">
              <h4 className="font-semibold !mb-2">📝 상황 설명</h4>
              <p className="text-gray-700">{situation?.situation}</p>
            </CardContent>
          </Card>

          {/* AI First Greeting */}
          {situation?.aiFirstGreeting && (
            <Card className="bg-yellow-50">
              <CardContent className="!p-4">
                <h4 className="font-semibold !mb-2">💬 AI 첫 인사</h4>
                <p className="text-gray-700 italic">"{situation.aiFirstGreeting}"</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={generateSituation}
          className="!flex-1"
        >
          다른 상황 생성하기
        </Button>
        
        <Button
          onClick={handleStart}
          className="!flex-1"
        >
          회화 시작하기
        </Button>
      </div>
    </div>
  );
}