import React, { useContext } from "react";
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge'
import { Button } from '../ui/button';
import { ArrowLeft } from "lucide-react";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

// 라우트 상수화
const ROUTES = {
    DASHBOARD_HOME: '/dashboard/home',
    STUDY_WORKBOOK: '/dashboard/study/workbook'
};

export function SelectType() {  
    const navigate = useNavigate();
    const { selectedType, setSelectedType, STUDY_TYPES } = useContext(AppContext);

    // 타입 선택 핸들러
    const handleTypeSelect = (typeId) => {
        setSelectedType(typeId);
        console.log('Selected study type:', typeId);
    };

    // 학습 시작 핸들러
    const handleStartStudy = () => {
        navigate(ROUTES.STUDY_WORKBOOK);
    };

    // 뒤로가기 핸들러
    const handleGoBack = () => {
        navigate(ROUTES.DASHBOARD_HOME);
    };

    return (
        <div className="!p-4">
            {/* 헤더 섹션 */}
            <div className="!mb-6">
                <div className="flex items-center !space-x-3 !mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleGoBack}
                        className="!p-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-800">📚 학습 유형 선택</h1>
                </div>
                <p className="text-gray-600">어떤 주제로 영어를 학습하고 싶으신가요?</p>
            </div>

            {/* 타입 선택 카드들 */}
            <div className="flex flex-col items-center !space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 !w-full !max-w-4xl">
                {STUDY_TYPES.map((type) => (
                    <Card 
                        key={type.id}
                        className={`cursor-pointer hover:shadow-lg transition-all hover:scale-105 ${
                            selectedType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => handleTypeSelect(type.id)}
                    >
                        <CardContent className="!p-10 text-center !space-y-8">
                            <div className="text-4xl">{type.icon}</div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{type.title}</h3>
                                <p className="text-gray-600 !mt-2">{type.description}</p>
                            </div>
                            <div className="!pt-2">
                                <Badge variant={selectedType === type.id ? "default" : "outline"}>
                                    {selectedType === type.id ? '선택됨' : '클릭하여 선택'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
    

            {/* 학습 시작 버튼 */}
            {selectedType && (          
                <div className="!mt-6 !pt-4 max-w-4xl">
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg w-full" 
                        onClick={handleStartStudy}
                    >
                        학습 시작하기 →
                    </Button>
                </div>
            )}
            </div>
        </div>
    );
}