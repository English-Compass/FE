import React, { useContext } from "react";
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge'
import { Button } from '../ui/button';
import { ArrowLeft } from "lucide-react";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

// 라우트 상수화  
const ROUTES = {
    DASHBOARD_HOME: '/dashboard/home'
};

export function SelectType({ onTypeSelected }) {  
    const navigate = useNavigate();
    const { 
        STUDY_TYPES, 
        KEYWORDS_BY_CATEGORY,
        formData,
        handleCategoryToggle,
        handleKeywordToggle,
        getKeywordCategoryKey 
    } = useContext(AppContext);

    // 타입 선택 핸들러 (대분류)
    const handleTypeSelect = (typeId) => {
        handleCategoryToggle(typeId);
        console.log('Selected study categories:', formData.selectedCategories);
    };

    // 학습 시작 핸들러
    const handleStartStudy = () => {
        if (formData.selectedCategories.length === 0) {
            alert('최소 1개의 대분류를 선택해주세요.');
            return;
        }
        if (onTypeSelected) {
            onTypeSelected(); // StudyPage의 handleTypeSelected 호출
        } else {
            console.warn('onTypeSelected callback이 제공되지 않았습니다. StudyPage에서 사용해주세요.');
        }
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
                <p className="text-gray-600">어떤 주제로 영어를 학습하고 싶으신가요? (최대 2개까지 선택 가능)</p>
                {formData.selectedCategories.length > 0 && (
                    <p className="text-blue-600 !mt-2">
                        선택된 대분류: {formData.selectedCategories.length}/2
                    </p>
                )}
            </div>

            {/* 타입 선택 카드들 */}
            <div className="flex flex-col items-center !space-y-6">
            {/* 대분류 선택 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 !w-full !max-w-4xl">
                {STUDY_TYPES.map((type) => {
                    const isSelected = formData.selectedCategories.includes(type.id);
                    const isDisabled = !isSelected && formData.selectedCategories.length >= 2;
                    
                    return (
                        <Card 
                            key={type.id}
                            className={`cursor-pointer transition-all ${
                                isDisabled 
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:shadow-lg hover:scale-105'
                            } ${
                                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}
                            onClick={() => !isDisabled && handleTypeSelect(type.id)}
                        >
                            <CardContent className="!p-10 text-center !space-y-8">
                                <div className="text-4xl">{type.icon}</div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{type.title}</h3>
                                    <p className="text-gray-600 !mt-2">{type.description}</p>
                                </div>
                                <div className="!pt-2">
                                    <Badge variant={isSelected ? "default" : "outline"}>
                                        {isSelected ? '선택됨' : isDisabled ? '선택 불가' : '클릭하여 선택'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                </div>

            {/* 소분류(키워드) 선택 */}
            {formData.selectedCategories.length > 0 && (
                <div className="!w-full !max-w-4xl !mt-8">
                    <Card>
                        <CardContent className="!p-6">
                            <h3 className="text-lg font-bold text-gray-800 !mb-4">🏷️ 세부 키워드 선택 (선택사항)</h3>
                            <p className="text-gray-600 !mb-6">관심 있는 키워드를 선택하면 더 맞춤형 학습을 제공합니다.</p>
                            
                            {formData.selectedCategories.map((categoryId) => {
                                const category = STUDY_TYPES.find(t => t.id === categoryId);
                                const key = getKeywordCategoryKey(categoryId);
                                const keywords = KEYWORDS_BY_CATEGORY[key] || [];
                                
                                return (
                                    <div key={categoryId} className="!mb-6">
                                        <h4 className="font-semibold text-gray-700 !mb-3 flex items-center">
                                            <span className="!mr-2">{category?.icon}</span>
                                            {category?.title} 키워드
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {keywords.map((keyword) => {
                                                const isKeywordSelected = formData.keywords.includes(keyword);
                                                return (
                                                    <button
                                                        key={keyword}
                                                        onClick={() => handleKeywordToggle(keyword)}
                                                        className={`!px-3 !py-2 rounded-lg !border-2 !border-gray-200 text-sm font-medium transition-all ${
                                                            isKeywordSelected
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {keyword}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            )}
    

            {/* 학습 시작 버튼 */}
            <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white !px-16 !py-5 rounded-lg" 
                onClick={handleStartStudy}
            >
                학습 시작하기 →
            </Button>
            {/* {formData.selectedCategories.length > 0 && (          
                <div className="!mt-6 !pt-4 max-w-4xl">
                    <div className="bg-gray-50 !p-4 rounded-lg !mb-4">
                        <h4 className="font-semibold text-gray-700 !mb-2">선택 요약</h4>
                        <p className="text-sm text-gray-600">
                            대분류: {formData.selectedCategories.map(id => 
                                STUDY_TYPES.find(t => t.id === id)?.title
                            ).join(', ')}
                        </p>
                        {formData.keywords.length > 0 && (
                            <p className="text-sm text-gray-600 !mt-1">
                                키워드: {formData.keywords.join(', ')}
                            </p>
                        )}
                    </div>
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg w-full" 
                        onClick={handleStartStudy}
                    >
                        학습 시작하기 →
                    </Button>
                </div>
            )} */}
            </div>
        </div>
    );
}