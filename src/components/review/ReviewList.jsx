import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ReviewQuestionItem } from './ReviewQuestionItem';

export function ReviewList({ reviewQuestions, onQuestionRetry }) {
    // 특정 인덱스의 문제 다시 풀기
    const handleRetry = (questionIndex) => {
        onQuestionRetry(questionIndex);
    };
    
    // 카테고리별 문제에서 원본 인덱스 찾아서 다시 풀기
    const handleCategoryRetry = (question) => {
        const originalIndex = reviewQuestions.findIndex(q => q.id === question.id);
        onQuestionRetry(originalIndex);
    };

    // 빈 상태 컴포넌트
    const EmptyState = ({ message }) => (
        <div className="text-center !py-8 text-gray-500">
            {message} 🎉
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    🔍 틀린 문제 목록
                    <span className="text-sm font-normal text-gray-500">
                        ({reviewQuestions.length}개)
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid !w-full grid-cols-4 !mb-4">
                        <TabsTrigger value="all">all</TabsTrigger>
                        <TabsTrigger value="sentence">sentence</TabsTrigger>
                        <TabsTrigger value="word">word</TabsTrigger>
                        <TabsTrigger value="conversation">conversation</TabsTrigger>
                    </TabsList>
            
                    <TabsContent value="all" className="!space-y-4 !mt-4">
                        {reviewQuestions.length > 0 ? (
                            reviewQuestions.map((question, index) => (
                                <ReviewQuestionItem
                                    key={question.id}
                                    question={question}
                                    onRetry={() => handleRetry(index)}
                                    showCategory={true}
                                />
                            ))
                        ) : (
                            <EmptyState message="틀린 문제가 없습니다" />
                        )}
                    </TabsContent>
                    
                    <TabsContent value="sentence" className="!space-y-4 !mt-4">
                        {reviewQuestions.filter(q => (q.questionType || q.category || q.type) === 'sentence').length > 0 ? (
                            reviewQuestions.filter(q => (q.questionType || q.category || q.type) === 'sentence').map((question) => (
                                <ReviewQuestionItem
                                    key={question.id}
                                    question={question}
                                    onRetry={() => handleCategoryRetry(question)}
                                    showCategory={false}
                                />
                            ))
                        ) : (
                            <EmptyState message="sentence 관련 틀린 문제가 없습니다" />
                        )}
                    </TabsContent>
                    
                    <TabsContent value="word" className="!space-y-4 !mt-4">
                        {reviewQuestions.filter(q => (q.questionType || q.category || q.type) === 'word').length > 0 ? (
                            reviewQuestions.filter(q => (q.questionType || q.category || q.type) === 'word').map((question) => (
                                <ReviewQuestionItem
                                    key={question.id}
                                    question={question}
                                    onRetry={() => handleCategoryRetry(question)}
                                    showCategory={false}
                                />
                            ))
                        ) : (
                            <EmptyState message="word 관련 틀린 문제가 없습니다" />
                        )}
                    </TabsContent>

                    <TabsContent value="conversation" className="!space-y-4 !mt-4">
                        {reviewQuestions.filter(q => (q.questionType || q.category || q.type) === 'conversation').length > 0 ? (
                            reviewQuestions.filter(q => (q.questionType || q.category || q.type) === 'conversation').map((question) => (
                                <ReviewQuestionItem
                                    key={question.id}
                                    question={question}
                                    onRetry={() => handleCategoryRetry(question)}
                                    showCategory={false}
                                />
                            ))
                        ) : (
                            <EmptyState message="conversation 관련 틀린 문제가 없습니다" />
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}