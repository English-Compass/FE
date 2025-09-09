import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { fetchWrongQuestions, createWrongAnswerSession } from '../../services/api.js';

export function WrongAnswerCard({ navigate }) {
  const [wrongQuizzes, setWrongQuizzes] = React.useState([]);

  React.useEffect(() => {
    const run = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const userId = storedUser ? JSON.parse(storedUser).userId : null;
        if (!userId) return;
        const data = await fetchWrongQuestions(userId);
        const list = Array.isArray(data) ? data : (data?.questions || []);
        setWrongQuizzes(list.map((q, idx) => ({
          id: q.id || q.questionId || idx + 1,
          question: q.question || q.questionText || '',
          options: q.options || [q.optionA, q.optionB, q.optionC].filter(Boolean)
        })));
      } catch {
        setWrongQuizzes([]);
      }
    };
    run();
  }, []);

  const samples = React.useMemo(() => {
    if (!Array.isArray(wrongQuizzes) || wrongQuizzes.length === 0) return [];
    const idx = Array.from({ length: wrongQuizzes.length }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx.slice(0, 3).map(i => wrongQuizzes[i]);
  }, [wrongQuizzes]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>❌</span>
          <span>오답 퀴즈</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-lg text-gray-600 !p-4 flex flex-col gap-2">
        <p>틀렸던 문제들을 다시 풀어보세요</p>
        {samples.map((quiz, index) => (
        <div key={quiz.id} className="!p-4 bg-red-50 border border-red-200 rounded-lg">
  <p className="text-lg text-gray-600 !mb-3">
    Q{index + 1}. {quiz.question}
  </p>
  <div className="flex gap-2">
    {quiz.options.slice(0, 2).map((option, optIndex) => (
      <Badge key={optIndex} variant="secondary">
        {option}
      </Badge>
    ))}
    <Badge variant="secondary">...</Badge>
  </div>
</div>
    ))}
{/* <Badge variant="destructive" className="!mb-4">
  {wrongQuizzes.length}문제 대기 중
</Badge> */}
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={async () => {
            try {
              const storedUser = localStorage.getItem('user');
              const userId = storedUser ? JSON.parse(storedUser).userId : null;
              if (!userId) {
                alert('로그인이 필요합니다.');
                return;
              }

              // 오답세션 생성
              const session = await createWrongAnswerSession({ 
                userId, 
                categories: ['study'] // 기본 카테고리
              });
              
              if (session.sessionId) {
                navigate(`/dashboard/review?sessionId=${session.sessionId}&type=wrong-answer`);
              } else {
                navigate('/dashboard/review');
              }
            } catch (error) {
              console.error('오답세션 생성 실패:', error);
              // 사용자에게 구체적인 에러 메시지 표시
              if (error.message.includes('422')) {
                alert('오답 기록이 없습니다. 먼저 문제를 풀어주세요!');
              } else {
                alert(`오답세션 생성 실패: ${error.message}`);
              }
              // 실패 시 기본 리뷰 페이지로
              navigate('/dashboard/review');
            }
          }}
        >
          오답 풀기 ({wrongQuizzes.length}문제)
        </Button>
      </CardContent>
    </Card>
  );
}