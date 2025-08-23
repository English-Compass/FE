import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { ArrowLeft, MessageCircle, Mic, MicOff, Send } from 'lucide-react';

export function ConversationPractice({ 
  user, 
  conversation, 
  onBack, 
  onSendMessage 
}) {
  const [currentInput, setCurrentInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    if (currentInput.trim()) {
      onSendMessage(currentInput);
      setCurrentInput('');
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // 그냥 더미 데이터 넣어둠
    if (!isListening) {
      setTimeout(() => {
        setCurrentInput("I would like to discuss this matter further.");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6 !p-4 !md:px-6 !md:py-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="ml"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 !mr-2" />
          새로운 연습
        </Button>
        <Badge variant="outline">Level {user?.level}</Badge>
      </div>

      {/* Chat Interface */}
      <Card className="flex h-[26rem] flex-col rounded-lg border bg-white shadow-sm">
        <CardHeader className="border-b !p-4">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>회화 연습</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-1 flex-col !space-y-4">
          {/* Messages */}
          <div className='flex-1 overflow-y-auto !space-y-4 !max-h-64'>
            {conversation.map((msg) => (
              <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md !px-4 !py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                  <p>{msg.message}</p>
                  {msg.feedback && (
                    <div className="!mt-2 !pt-2 border-t border-gray-200">
                      <div className="text-xs !space-y-1">
                        <div>발음: {msg.feedback.pronunciation}%</div>
                        <div>문법: {msg.feedback.grammar}%</div>
                        <div>유창성: {msg.feedback.fluency}%</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className='flex !space-x-2'>
            <div className='flex-1 relative'>
              <Input
                placeholder="메시지를 입력하세요..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className='!pr-12'
              />
              <button
                onClick={toggleListening}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 !p-1 rounded ${
                    isListening ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            <Button
              onClick={handleSend}
              disabled={!currentInput.trim()}
              size="ml"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Practice Tips */}
      <Card>
        <CardContent className="!p-4">
          <h4 className='font-medium !mb-2'>💡 연습 팁</h4>
          <div className="grid grid-cols-1 !md:grid-cols-3 gap-4 text-ml text-gray-600">
            <div>
              <strong>자연스럽게:</strong> 실제 대화처럼 자연스럽게 말해보세요
            </div>
            <div>
              <strong>실수 OK:</strong> 틀려도 괜찮습니다. 계속 시도해보세요
            </div>
            <div>
              <strong>피드백 활용:</strong> AI의 피드백을 참고해서 개선해보세요
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}