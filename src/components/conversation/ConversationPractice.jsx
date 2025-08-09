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
    <div className="conversation-practice p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          새로운 연습
        </Button>
        <Badge variant="outline">Level {user?.level}</Badge>
      </div>

      {/* Chat Interface */}
      <Card className="chat-card">
        <CardHeader className="chat-header">
          <CardTitle className="chat-title">
            <MessageCircle className="w-5 h-5" />
            <span>회화 연습</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="chat-content">
          {/* Messages */}
          <div>
            {conversation.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.type === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div
                  className={msg.type === 'user' ? 'user-bubble' : 'ai-bubble'}
                >
                  <p>{msg.message}</p>
                  {msg.feedback && (
                    <div className="feedback-section">
                      <div>
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
          <div>
            <div>
              <Input
                placeholder="메시지를 입력하세요..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={toggleListening}
                className={isListening ? 'listening' : ''}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            <Button
              onClick={handleSend}
              disabled={!currentInput.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Practice Tips */}
      <Card className="practice-tips-card">
        <CardContent className="practice-tips">
          <h4>💡 연습 팁</h4>
          <div className="tips-grid">
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