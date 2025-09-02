import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, MessageCircle, Mic, MicOff } from 'lucide-react';

const API_BASE_URL = '/api/v1';

export function ConversationPractice({
  user,
  onBack,
}) {
  const [sessionId, setSessionId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    // API: 컴포넌트가 마운트될 때, 새로운 대화 세션을 시작합니다.
    const startSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sessions/role-playing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            topic: 'travel',
            difficultyLevel: 'INTERMEDIATE',
          }),
        });

        if (!response.ok) {
          throw new Error('세션 시작 실패');
        }

        const data = await response.json();
        setSessionId(data.sessionId);
        setConversation([{
          id: 'ai-greeting',
          type: 'ai',
          message: data.aiFirstGreeting,
        }]);
      } catch (error) {
        console.error('세션 시작 오류:', error);
      }
    };

    startSession();

    return () => {
      if (sessionId) {
        fetch(`${API_BASE_URL}/sessions/role-playing/${sessionId}/end`, {
          method: 'POST',
          keepalive: true
        });
      }
    };
  }, [user.id]);

// API: 녹음된 음성 데이터를 서버로 전송하고, AI의 응답을 받아 대화에 추가합니다.
const handleSendAudio = async (audioBlob) => {
    if (!sessionId) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: '음성 메시지를 보내는 중...',
    };
    setConversation((prev) => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'user_speech.webm');

      const response = await fetch(
        `${API_BASE_URL}/sessions/role-playing/${sessionId}/talk`, {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error('음성 메시지 전송에 실패했습니다.');
      }

      const data = await response.json();

      // AI 음성 응답(audio)이 있다면 즉시 재생
      if (data.audio) {
        const audioPlayer = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audioPlayer.play();
      }

      // AI 응답 메시지 객체 생성 (새 변수명 사용)
      const aiMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        message: data.text, // AI 텍스트 응답
        feedback: data.feedback, // 음성 평가 피드백
        evaluationStatus: data.evaluationStatus, // 평가 상태
      };
      
      // 대화 내용 업데이트
      setConversation((prev) => {
          const updatedConversation = [...prev];
          // '전송 중...' 메시지를 실제 사용자 발화 내용(STT 결과)으로 변경
          updatedConversation[updatedConversation.length - 1].message = data.userText || '음성 인식 실패';
          return [...updatedConversation, aiMessage];
      });

    } catch (error) {
      console.error('음성 메시지 전송 오류:', error);
      // 에러 발생 시 '전송 중...' 메시지 제거
      setConversation((prev) => prev.filter(msg => msg.id !== userMessage.id));
    }
  };

  const toggleListening = async () => {
    if (isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newMediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = newMediaRecorder;
        let audioChunks = [];

        newMediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        newMediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            handleSendAudio(audioBlob);
            audioChunks = [];
            // 스트림 트랙 중지하여 마이크 아이콘 끄기
            stream.getTracks().forEach(track => track.stop());
          };
        
          newMediaRecorder.start();
          setIsListening(true);
        } catch (error) {
          console.error('마이크 접근 오류:', error);
      }
    }
  };

  const handleEndSession = async () => {
    if (sessionId) {
      try {
        await fetch(`${API_BASE_URL}/sessions/role-playing/${sessionId}/end`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('세션 종료 실패:', error);
      }
    }
    onBack();
  };

  return (
    <div className="flex flex-col gap-6 !p-4 !md:px-6 !md:py-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="ml"
          onClick={handleEndSession}
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
         <div className='flex-1 overflow-y-auto !space-y-4 !max-h-72'>
            {conversation.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md !px-4 !py-2 rounded-lg ${
                    msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{msg.message}</p>
                  {/* 피드백이 존재할 경우 표시 */}
                  {msg.feedback && (
                    <div className="!mt-2 !pt-2 border-t border-gray-300/50 text-xs">
                      <p className="font-semibold">피드백:</p>
                      <p>{msg.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area - Mic Button Only */}
          <div className='flex justify-center items-center !pt-2'>
            <Button
              onClick={toggleListening}
              size="icon"
              className={`!w-80 h-16 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
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