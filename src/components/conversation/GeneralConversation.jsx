import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../ui/Badge';

const DIFFICULTY_LEVELS = [
  { id: 'BEGINNER', title: '초급', description: '기본 어휘, 짧은 문장, 현재시제', color: 'bg-green-100 text-green-800' },
  { id: 'INTERMEDIATE', title: '중급', description: '일반 어휘, 복잡한 문장 구조, 과거/미래시제', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'ADVANCED', title: '고급', description: '고급 어휘, 복잡한 문장, 관용구 사용', color: 'bg-red-100 text-red-800' }
];

const SUGGESTED_TOPICS = [
  'travel', 'food', 'hobbies', 'work', 'family', 'weather', 
  'movies', 'music', 'sports', 'technology', 'education', 'health'
];

export function GeneralConversation({ onBack, onStartConversation }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');

  const handleStart = () => {
    if (selectedDifficulty && (topic || customTopic)) {
      const finalTopic = topic || customTopic;
      onStartConversation({
        type: 'general',
        difficultyLevel: selectedDifficulty,
        topic: finalTopic
      });
    }
  };

  const handleTopicSelect = (selectedTopic) => {
    setTopic(selectedTopic);
    setCustomTopic('');
  };

  const handleCustomTopicChange = (value) => {
    setCustomTopic(value);
    setTopic('');
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
        <h1 className="text-2xl font-bold text-gray-800 !mb-2">💭 일반 회화</h1>
        <p className="text-gray-600">자유로운 주제로 AI와 자연스럽게 대화해보세요</p>
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

      {/* Topic Selection */}
      <Card>
        <CardHeader>
          <CardTitle>2️⃣ 대화 주제 선택</CardTitle>
        </CardHeader>
        <CardContent className="!space-y-6">
          {/* Suggested Topics */}
          <div>
            <h4 className="font-semibold !mb-3">추천 주제</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SUGGESTED_TOPICS.map((suggestedTopic) => (
                <Button
                  key={suggestedTopic}
                  variant={topic === suggestedTopic ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTopicSelect(suggestedTopic)}
                  className="!text-sm"
                >
                  {suggestedTopic}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Topic */}
          <div>
            <h4 className="font-semibold !mb-3">직접 입력</h4>
            <Input
              placeholder="원하는 주제를 입력하세요 (예: artificial intelligence, cooking, photography)"
              value={customTopic}
              onChange={(e) => handleCustomTopicChange(e.target.value)}
              className="!w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      <Button
        onClick={handleStart}
        disabled={!selectedDifficulty || (!topic && !customTopic)}
        className="!w-full !py-3 !text-lg"
      >
        회화 시작하기
      </Button>
    </div>
  );
}


