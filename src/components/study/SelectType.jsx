import React, { useContext } from "react";
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge'
import AppContext from "../../context/AppContext";

export function SelectType() {   
    const { selectedType, setSelectedType } = useContext(AppContext);

    const STUDY_TYPES = [
        { id: 'business', title: '비즈니스', icon: '💼', description: '회의, 프레젠테이션, 이메일' },
        { id: 'travel', title: '여행', icon: '✈️', description: '공항, 호텔, 관광지' },
        { id: 'daily', title: '일상', icon: '🏠', description: '일상 대화, 쇼핑, 식당' },
        { id: 'academic', title: '학술', icon: '🎓', description: '논문, 발표, 토론' }
    ];

     // 타입 선택 핸들러
    const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    console.log('Selected study type:', typeId);
    // 난이도 선택 단계로 이동
    };

    return (
    <div className="select-type">
        <div className="select-type__header">
            <h1>📚 학습 유형 선택</h1>
            <p>어떤 주제로 영어를 학습하고 싶으신가요?</p>
        </div>

       
            {/* 현재 선택된 타입 표시 (디버깅용) */}
            {selectedType && selectedType !== 'type' && (
                <div className="select-type__selected">
                    현재 선택된 타입: <strong>{STUDY_TYPES.find(type => type.id === selectedType)?.title || selectedType}</strong>
                </div>
            )}

            <div className="select-type__grid">
                {STUDY_TYPES.map((type) => (
                <Card 
                    key={type.id}
                    className={`select-type__card ${
                    selectedType === type.id 
                        ? 'active' 
                        : ''
                    }`}
                    onClick={() => handleTypeSelect(type.id)}
                >
                    <CardContent className="select-type__card-content">
                    <div className="select-type__icon">{type.icon}</div>
                    <div>
                        <h3>{type.title}</h3>
                        <p>{type.description}</p>
                    </div>
                    <div className="select-type__badge">
                        <Badge 
                        variant={selectedType === type.id ? "default" : "outline"}
                        >
                        {selectedType === type.id ? '선택됨' : '클릭하여 선택'}
                        </Badge>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>

            {/* 선택된 타입이 있을 때 다음 단계 버튼 */}
            {selectedType && selectedType !== 'type' && (
                <div className="select-type__next">
                <button onClick={() => {
                    // 다음 단계로 이동하는 로직
                    console.log('다음단계로:', selectedType);
                    }}
                >
                    다음 단계로 →
                </button>
                </div>
            )}
        </div>
  );
}
