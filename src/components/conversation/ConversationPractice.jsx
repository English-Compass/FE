import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, MessageCircle, Mic, MicOff, X, Star, TrendingUp, Clock } from 'lucide-react';

const API_BASE_URL = '/api/v1';

export function ConversationPractice({
  user,
  conversationConfig,
  onBack,
}) {
  const [sessionId, setSessionId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    // API: 컴포넌트가 마운트될 때, 새로운 대화 세션을 시작합니다.
    const startSession = async () => {
      try {
        let requestBody = {
          userId: parseInt(user.id),
          difficultyLevel: conversationConfig?.difficultyLevel || 'INTERMEDIATE',
        };

        // 일반 회화
        if (conversationConfig?.type === 'general') {
          requestBody.topic = conversationConfig.topic;
          const response = await fetch(`${API_BASE_URL}/speech-sessions/role-playing`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
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
        }
        // 롤 플레잉 (정해진 시나리오) - 이미 생성된 세션 사용
        else if (conversationConfig?.type === 'role-playing-scenario') {
          // 상황 상세 화면에서 이미 세션을 생성했으므로 그 정보를 사용
          setSessionId(conversationConfig.sessionId);
          setConversation([{
            id: 'ai-greeting',
            type: 'ai',
            message: conversationConfig.aiFirstGreeting || 'Hello! How can I help you?',
          }]);
        }
        // 롤 플레잉 (커스텀) - 사용자가 먼저 시작
        else if (conversationConfig?.type === 'role-playing-custom') {
          requestBody.customAiRole = conversationConfig.customAiRole;
          requestBody.customUserRole = conversationConfig.customUserRole;
          requestBody.customSituation = conversationConfig.customSituation;
          const response = await fetch(`${API_BASE_URL}/role-playing/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });
          
          if (!response.ok) {
            throw new Error('세션 시작 실패');
          }

          const data = await response.json();
          setSessionId(data.sessionId);
          // 커스텀 롤 플레잉에서는 AI가 먼저 인사하지 않음 (aiFirstGreeting이 null)
          setConversation([]);
        }
      } catch (error) {
        console.error('세션 시작 오류:', error);
      }
    };

    startSession();

    return () => {
      if (sessionId) {
        // 모든 회화 유형은 같은 end 엔드포인트 사용
        const endpoint = `${API_BASE_URL}/speech-sessions/role-playing/${sessionId}/end`;
        
        fetch(endpoint, {
          method: 'POST',
          keepalive: true
        });
      }
    };
  }, [user.id, conversationConfig]);

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

      // 모든 회화 유형은 같은 talk 엔드포인트 사용
      const endpoint = `${API_BASE_URL}/speech-sessions/role-playing/${sessionId}/talk`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('음성 메시지 전송에 실패했습니다.');
      }

      const data = await response.json();

      // AI 음성 응답(audio)이 있다면 즉시 재생
      if (data.audio) {
        const audioPlayer = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audioPlayer.play();
      }

      // AI 응답 메시지 객체 생성
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
          updatedConversation[updatedConversation.length - 1].message = data.userText || '음성 메시지 전송됨';
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
        // 세션 종료
        const endEndpoint = `${API_BASE_URL}/speech-sessions/role-playing/${sessionId}/end`;
        const endResponse = await fetch(endEndpoint, {
          method: 'POST',
        });
        
        if (endResponse.ok) {
          const endData = await endResponse.json();
          console.log('세션 종료 응답:', endData);
          
          // 세션 평가 결과 가져오기
          const evaluationEndpoint = `${API_BASE_URL}/speech-sessions/role-playing/${sessionId}/evaluations`;
          const evaluationResponse = await fetch(evaluationEndpoint);
          
          if (evaluationResponse.ok) {
            const evaluationData = await evaluationResponse.json();
            console.log('평가 결과 응답:', evaluationData);
            setSessionFeedback({
              sessionInfo: endData,
              evaluations: evaluationData
            });
            setShowFeedbackModal(true);
          } else {
            console.log('평가 결과 가져오기 실패:', evaluationResponse.status, evaluationResponse.statusText);
            // 평가 결과를 가져올 수 없는 경우에도 모달 표시
            setSessionFeedback({
              sessionInfo: endData,
              evaluations: null
            });
            setShowFeedbackModal(true);
          }
        }
      } catch (error) {
        console.error('세션 종료 실패:', error);
        // 오류가 발생해도 모달은 표시
        setSessionFeedback({
          sessionInfo: null,
          evaluations: null
        });
        setShowFeedbackModal(true);
      }
    } else {
      onBack();
    }
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSessionFeedback(null);
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
        <div className="flex items-center gap-2">
          <Badge variant="outline">Level {user?.level}</Badge>
          {sessionId && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEndSession}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              세션 종료
            </Button>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="flex h-[26rem] flex-col rounded-lg border bg-white shadow-sm">
        <CardHeader className="border-b !p-4">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>회화 연습</span>
            {conversationConfig?.type === 'role-playing-custom' && (
              <Badge variant="outline" className="ml-2 text-xs">
                사용자가 먼저 시작하세요
              </Badge>
            )}
          </CardTitle>
          
          {/* 롤 플레잉 정보 표시 */}
          {(conversationConfig?.type === 'role-playing-custom' || 
            conversationConfig?.type === 'role-playing-scenario') && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-semibold text-blue-800">🤖 AI 역할:</span>
                  <span className="ml-2 text-blue-700">
                    {conversationConfig?.type === 'role-playing-custom' 
                      ? conversationConfig?.customAiRole 
                      : conversationConfig?.aiRole}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-blue-800">👤 사용자 역할:</span>
                  <span className="ml-2 text-blue-700">
                    {conversationConfig?.type === 'role-playing-custom' 
                      ? conversationConfig?.customUserRole 
                      : conversationConfig?.userRole}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-semibold text-blue-800">📝 상황:</span>
                  <span className="ml-2 text-blue-700">
                    {conversationConfig?.type === 'role-playing-custom' 
                      ? conversationConfig?.customSituation 
                      : conversationConfig?.situation}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="flex flex-1 flex-col !space-y-4">
         <div className='flex-1 overflow-y-auto !space-y-4 !max-h-72'>
            {conversation.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  {conversationConfig?.type === 'role-playing-custom' ? (
                    <div>
                      <p className="text-lg font-medium mb-2">🎭 커스텀 롤 플레잉</p>
                      <p>마이크 버튼을 눌러서 대화를 시작하세요!</p>
                    </div>
                  ) : (
                    <p>대화를 시작하세요!</p>
                  )}
                </div>
              </div>
            ) : (
              conversation.map((msg) => (
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
              ))
            )}
          </div>

          {/* Input Area - Mic Button with Text */}
          <div className='flex justify-center items-center !pt-2'>
            <Button
              onClick={toggleListening}
              className={`!w-80 h-16 rounded-full flex items-center gap-3 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-6 h-6" />
                  <span className="text-lg font-medium">말하기 종료</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6" />
                  <span className="text-lg font-medium">말하기</span>
                </>
              )}
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

      {/* 피드백 모달 */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">🎉 회화 연습 완료!</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseFeedbackModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 피드백 내용만 표시 */}
            {sessionFeedback?.evaluations?.feedback ? (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  회화 피드백
                </h3>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-gray-700 leading-relaxed">{sessionFeedback.evaluations.feedback}</p>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  피드백을 불러올 수 없습니다. 세션이 너무 짧거나 평가 데이터가 없을 수 있습니다.
                </p>
              </div>
            )}

            {/* 종료 메시지 */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                수고하셨습니다! 계속해서 영어 회화 연습을 해보세요.
              </p>
              <Button
                onClick={handleCloseFeedbackModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}