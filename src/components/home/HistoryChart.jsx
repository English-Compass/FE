import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useApp } from '../../context/AppContext';

// API: 사용자의 학습 기록 데이터(주간 학습 시간, 유형별 정답률 등)를 서버에서 가져와야 합니다.
// 예: useEffect(() => { fetch('/api/history').then(res => res.json()).then(data => setHistory(data)); }, []);

export default function StudyHistoryChart() {
    // reviewQuestions와 QUESTION_TYPE_MAPPING을 AppContext에서 가져옵니다.
    const { weeklyHours, QUESTION_TYPES, reviewQuestions, QUESTION_TYPE_MAPPING } = useApp();

    // QuickReview 컴포넌트의 약점 분석 로직을 가져옵니다.
    const weaknessAnalysis = useMemo(() => {
        if (!reviewQuestions || reviewQuestions.length === 0) return [];

        const typeCount = {};
        const typeNames = {
            'word': '빈칸 채우기',
            'sentence': '문장 의미 파악',
            'conversation': '대화 완성'
        };

        reviewQuestions.forEach(question => {
            const questionType = question.questionType || question.category || 'word';
            const mappedType = QUESTION_TYPE_MAPPING[questionType] || questionType;
            
            if (!typeCount[mappedType]) {
                typeCount[mappedType] = {
                    count: 0,
                    displayName: typeNames[mappedType] || mappedType,
                };
            }
            typeCount[mappedType].count++;
        });

        return Object.entries(typeCount)
            .map(([type, data]) => ({ type, ...data }))
            .sort((a, b) => b.count - a.count);
    }, [reviewQuestions, QUESTION_TYPE_MAPPING]);

    const hasWeakness = weaknessAnalysis.length > 0;
    const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

    return (
        <div className="!space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center !space-x-2">
                        <span>📊</span>
                        <span>학습 분석</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="weekly" className="w-full">
                        <TabsList className="grid !w-full grid-cols-3">
                            <TabsTrigger value="weekly">주간 학습량</TabsTrigger>
                            <TabsTrigger value="accuracy">유형별 정답률</TabsTrigger>
                            {/* 탭 이름을 다시 변경합니다. */}
                            <TabsTrigger value="category">오답 유형 분포</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="weekly" className="!space-y-4 !mt-6">
                            {/* ... 주간 학습량 차트 ... */}
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={weeklyHours}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Line type="monotone" dataKey="time" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex items-center justify-center !space-x-2 text-ml text-gray-600">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span>일일 학습시간 (분)</span>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="accuracy" className="!space-y-4 !mt-6">
                            {/* ... 유형별 정답률 차트 ... */}
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={QUESTION_TYPES}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="type" />
                                        <YAxis />
                                        <Bar dataKey="accuracy" fill="#10B981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="!space-y-2">
                                {QUESTION_TYPES.map((type, index) => (
                                    <div key={index} className="flex items-center justify-between !p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center !space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${type.accuracy >= 80 ? 'bg-green-500' : type.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                            <span className="font-medium">{type.type}</span>
                                        </div>
                                        <div className="flex items-center !space-x-2">
                                            <Badge variant={type.accuracy >= 80 ? 'default' : 'secondary'}>{type.accuracy}%</Badge>
                                            <span className="text-sm text-gray-600">({type.correct}/{type.correct + type.wrong})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        
                        {/* 👇 여기에 원형 차트 UI를 적용합니다. */}
                        <TabsContent value="category" className="!space-y-4 !mt-6">
                            {hasWeakness ? (
                                <>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={weaknessAnalysis}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    innerRadius={60}
                                                    fill="#8884d8"
                                                    paddingAngle={5}
                                                    dataKey="count"
                                                    nameKey="displayName"
                                                >
                                                    {weaknessAnalysis.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 !p-4 border rounded-lg">
                                        {weaknessAnalysis.map((entry, index) => (
                                            <div key={`legend-${index}`} className="flex items-center !space-x-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                ></div>
                                                <span className="text-sm font-medium">{entry.displayName}</span>
                                                <span className="text-sm text-gray-600">({entry.count}문제)</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Card className="bg-gradient-to-r from-green-500 to-emerald-400 !text-white">
                                    <CardContent className="!p-6 text-center">
                                        <h3 className="text-xl font-bold !mb-2">� 완벽해요!</h3>
                                        <p className="text-sm opacity-90">
                                            현재 복습할 틀린 문제가 없습니다.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}