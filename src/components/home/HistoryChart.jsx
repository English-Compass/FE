import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useApp } from '../../context/AppContext';


export default function StudyHistoryChart() {
    const { weeklyHours, QUESTION_TYPES, STUDY_TYPES } = useApp();

    return (
    <div className="!space-y-6">
        {/* 차트 섹션 */}
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
                <TabsTrigger value="accuracy">문제유형별 정답률</TabsTrigger>
                <TabsTrigger value="category">카테고리 분포</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly" className="!space-y-4 !mt-6">
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Line 
                        type="monotone" 
                        dataKey="time" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center !space-x-2 text-ml text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>일일 학습시간 (분)</span>
                </div>
            </TabsContent>
            
            <TabsContent value="accuracy" className="!space-y-4 !mt-6">
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
                        <div className={`w-3 h-3 rounded-full ${
                        type.accuracy >= 80 ? 'bg-green-500' : 
                        type.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium">{type.type}</span>
                    </div>
                    <div className="flex items-center !space-x-2">
                        <Badge variant={type.accuracy >= 80 ? 'default' : 'secondary'}>
                        {type.accuracy}%
                        </Badge>
                        <span className="text-sm text-gray-600">
                        ({type.correct}/{type.correct + type.wrong})
                        </span>
                    </div>
                    </div>
                ))}
                </div>
            </TabsContent>
            
            <TabsContent value="category" className="!space-y-4 !mt-6">
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={STUDY_TYPES}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {STUDY_TYPES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    </PieChart>
                </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2">
                {STUDY_TYPES.map((category, index) => (
                    <div key={index} className="flex items-center !space-x-2">
                    <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-gray-600">{category.value}%</span>
                    </div>
                ))}
                </div>
            </TabsContent>
            </Tabs>
        </CardContent>
        </Card>
    </div>
    );
}