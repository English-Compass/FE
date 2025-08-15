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
                    <TabsList className="grid !w-full grid-cols-3 !mb-4">
                        <TabsTrigger value="all">전체</TabsTrigger>
                        <TabsTrigger value="sentence">문법</TabsTrigger>
                        <TabsTrigger value="word">어휘</TabsTrigger>
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
                        {reviewQuestions.filter(q => q.category === 'sentence').length > 0 ? (
                            reviewQuestions.filter(q => q.category === 'sentence').map((question) => (
                                <ReviewQuestionItem
                                    key={question.id}
                                    question={question}
                                    onRetry={() => handleCategoryRetry(question)}
                                    showCategory={false}
                                />
                            ))
                        ) : (
                            <EmptyState message="문법 관련 틀린 문제가 없습니다" />
                        )}
                    </TabsContent>
                    
                    <TabsContent value="word" className="!space-y-4 !mt-4">
                        {reviewQuestions.filter(q => q.category === 'word').length > 0 ? (
                            reviewQuestions.filter(q => q.category === 'word').map((question) => (
                                <ReviewQuestionItem
                                    key={question.id}
                                    question={question}
                                    onRetry={() => handleCategoryRetry(question)}
                                    showCategory={false}
                                />
                            ))
                        ) : (
                            <EmptyState message="어휘 관련 틀린 문제가 없습니다" />
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}