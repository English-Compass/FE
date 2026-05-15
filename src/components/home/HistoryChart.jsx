import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useApp } from '../../context/AppContext';

export default function StudyHistoryChart({ weeklyStats, loading, questionTypeAccuracy, accuracyLoading, weaknessDistribution, weaknessLoading }) {
    // reviewQuestions와 QUESTION_TYPE_MAPPING을 AppContext에서 가져옵니다.
    const { reviewQuestions, QUESTION_TYPE_MAPPING } = useApp();
    
    // 주간 학습량 차트의 Y축 도메인을 동적으로 계산
    const weeklyYAxisDomain = useMemo(() => {
        if (!weeklyStats || weeklyStats.length === 0) return [0, 10];
        const maxValue = Math.max(...weeklyStats.map(item => item.sessionCount || 0));
        // 최대값의 1.2배를 상한으로 설정 (최소 10, 최대값이 있으면 그보다 약간 크게)
        const upperBound = Math.max(10, Math.ceil(maxValue * 1.2));
        // 5의 배수로 반올림
        return [0, Math.ceil(upperBound / 5) * 5];
    }, [weeklyStats]);

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
                            {loading ? (
                                <div className="h-64 flex items-center justify-center">
                                    <span className="text-gray-500">주간 학습 데이터를 불러오는 중...</span>
                                </div>
                            ) : weeklyStats && weeklyStats.length > 0 ? (
                                <>
                                    <div className="h-80 min-h-[320px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart 
                                                data={weeklyStats} 
                                                margin={{ top: 5, right: 10, left: -10, bottom: 80 }}
                                                barCategoryGap="15%"
                                            >
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                <XAxis 
                                                    dataKey="weekLabel" 
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={80}
                                                    tick={{ fontSize: 10, fill: '#6B7280' }}
                                                    interval={0}
                                                    label={{ value: '주간', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#374151', fontSize: 12 } }}
                                                />
                                                <YAxis 
                                                    domain={weeklyYAxisDomain}
                                                    tick={{ fontSize: 11, fill: '#6B7280' }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    label={{ value: '세션 수', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#374151', fontSize: 12 } }}
                                                />
                                                <Bar 
                                                    dataKey="sessionCount" 
                                                    fill="#3B82F6" 
                                                    radius={[6, 6, 0, 0]}
                                                    minPointSize={3}
                                                >
                                                    <LabelList 
                                                        dataKey="sessionCount" 
                                                        position="top" 
                                                        style={{ fontSize: '11px', fill: '#374151', fontWeight: 500 }}
                                                        offset={5}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex items-center justify-center !space-x-2 text-sm text-gray-600">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span>주간 완료한 세션 수</span>
                                    </div>
                                </>
                            ) : (
                                <div className="h-64 flex items-center justify-center">
                                    <span className="text-gray-500">주간 학습 데이터가 없습니다.</span>
                                </div>
                            )}
                        </TabsContent>
                        
                        <TabsContent value="accuracy" className="!space-y-4 !mt-6">
                            {accuracyLoading ? (
                                <div className="h-64 flex items-center justify-center">
                                    <span className="text-gray-500">유형별 정답률 데이터를 불러오는 중...</span>
                                </div>
                            ) : questionTypeAccuracy && questionTypeAccuracy.length > 0 ? (
                                <>
                                    <div className="h-80 min-h-[320px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart 
                                                data={questionTypeAccuracy} 
                                                margin={{ top: 5, right: 5, left: -10, bottom: 70 }}
                                                barCategoryGap="25%"
                                            >
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                <XAxis 
                                                    dataKey="type" 
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={70}
                                                    interval={0}
                                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                                    axisLine={{ stroke: '#D1D5DB' }}
                                                />
                                                <YAxis 
                                                    domain={[0, 100]} 
                                                    ticks={[0, 20, 40, 60, 80, 100]}
                                                    tickFormatter={(value) => `${value}%`}
                                                    width={35}
                                                    tick={{ fontSize: 11, fill: '#6B7280' }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <Bar 
                                                    dataKey="accuracy" 
                                                    fill="#10B981" 
                                                    radius={[6, 6, 0, 0]}
                                                    minPointSize={3}
                                                >
                                                    <LabelList 
                                                        dataKey="accuracy" 
                                                        position="top" 
                                                        formatter={(value) => `${value.toFixed(1)}%`}
                                                        style={{ fontSize: '12px', fill: '#374151', fontWeight: 500 }}
                                                        offset={5}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="!space-y-2">
                                        {questionTypeAccuracy.map((type, index) => (
                                            <div key={index} className="flex items-center justify-between !p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center !space-x-3">
                                                    <div className={`w-3 h-3 rounded-full ${type.accuracy >= 80 ? 'bg-green-500' : type.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                                    <span className="font-medium">{type.type}</span>
                                                </div>
                                                <div className="flex items-center !space-x-2">
                                                    <Badge variant={type.accuracy >= 80 ? 'default' : 'secondary'}>{Math.round(type.accuracy)}%</Badge>
                                                    <span className="text-sm text-gray-600">({type.correctAnswers}/{type.totalQuestions})</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="h-64 flex items-center justify-center">
                                    <span className="text-gray-500">유형별 정답률 데이터가 없습니다.</span>
                                </div>
                            )}
                        </TabsContent>
                        
                        {/* 👇 여기에 원형 차트 UI를 적용합니다. */}
                        <TabsContent value="category" className="!space-y-4 !mt-6">
                            {weaknessLoading ? (
                                <div className="h-64 flex items-center justify-center">
                                    <span className="text-gray-500">약점 유형 분포 데이터를 불러오는 중...</span>
                                </div>
                            ) : weaknessDistribution && weaknessDistribution.length > 0 ? (
                                <>
                                    <div className="h-80 min-h-[320px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={weaknessDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={120}
                                                    innerRadius={70}
                                                    fill="#8884d8"
                                                    paddingAngle={3}
                                                    dataKey="count"
                                                    nameKey="displayName"
                                                    label={({ name, percent }) => {
                                                        // 5% 이상인 경우만 레이블 표시
                                                        if (percent >= 0.05) {
                                                            return `${name}: ${(percent * 100).toFixed(0)}%`;
                                                        }
                                                        return '';
                                                    }}
                                                >
                                                    {weaknessDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 !p-4 border rounded-lg">
                                        {weaknessDistribution.map((entry, index) => (
                                            <div key={`legend-${index}`} className="flex items-center justify-between !p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center !space-x-3">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                    ></div>
                                                    <div>
                                                        <span className="text-sm font-medium">{entry.displayName}</span>
                                                        <div className="flex items-center !space-x-2 text-xs text-gray-600 mt-1">
                                                            <span>푼 문제: {entry.questionsSolved || entry.count}개</span>
                                                            <span>•</span>
                                                            <span>정답: {entry.correctAnswers}개</span>
                                                            <span>•</span>
                                                            <span>정답률: {Math.round(entry.accuracyRate || entry.categoryProficiency || 0)}%</span>
                                                            <span>•</span>
                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                entry.weaknessGrade === 'HIGH' ? 'bg-red-100 text-red-800' :
                                                                entry.weaknessGrade === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-green-100 text-green-800'
                                                            }`}>
                                                                {entry.weaknessGrade === 'HIGH' ? '높음' : 
                                                                 entry.weaknessGrade === 'MEDIUM' ? '보통' : '낮음'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-semibold text-gray-700">
                                                        우선순위 {entry.priority}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Card className="bg-gradient-to-r from-green-500 to-emerald-400 !text-white">
                                    <CardContent className="!p-6 text-center">
                                        <h3 className="text-xl font-bold !mb-2">� 완벽해요!</h3>
                                        <p className="text-sm opacity-90">
                                            현재 약점이 될 만한 문제 유형이 없습니다.
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