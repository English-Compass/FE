import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

export function KeywordSelection({
  KEYWORDS_BY_CATEGORY,
  selectedKeywords,
  formData,
  onToggle,
  onPrev,
  handleKeywordToggle,
  handleSubmit,
  canComplete
}) {
  const renderKeywords = (category) =>
    (KEYWORDS_BY_CATEGORY[category] || []).map((keyword) => {
      const isSelected = selectedKeywords.includes(keyword);
      return (
        <Badge
          key={keyword}
          onClick={() => onToggle(keyword)}
          variant={isSelected ? "default" : "outline"}
          className={`cursor-pointer ${isSelected ? "bg-blue-500 text-white" : ""}`}
        >
          {keyword}
        </Badge>
      );
    });

  const renderCategories = () =>
    [
        { id: 'travel', name: '여행' },
        { id: 'business', name: '비즈니스' },
        { id: 'academic', name: '학술' },   
        { id: 'daily', name: '일상' }
    ].map(({ id, name }) => (
      <div key={id} className="!mb-4">
        <h3 className="font-semibold !mb-2">{name}</h3>
        <div className="flex flex-wrap gap-2">{renderKeywords(id)}</div>
      </div>
    ));

  return (
    <div className="!space-y-6">
      <div className="keyword-selection__content">
        <h3 className="text-lg font-semibold text-gray-800 !mb-2">관심 키워드 선택</h3>
        <p className="text-gray-600 !mb-6">
          학습하고 싶은 영어 키워드를 선택해주세요(여러 개 선택 가능)
        </p>

        {/* 선택된 키워드 표시 */}
        {formData.keywords.length > 0 && (
            <div className="w-105 !mb-6 !p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800 !mb-4">
                선택된 키워드 ({formData.keywords.length}개)
            </p>
            <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword) => (
                <Badge
                    key={keyword}
                    variant="default"
                    className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                    onClick={() => handleKeywordToggle(keyword)}
                >
                    {keyword}
                    <X className="w-3 h-3 !ml-1" />
                </Badge>
                ))}
            </div>
            </div>
        )}

        <div className="space-y-4">
          {renderCategories()}
        </div>
      </div>
      
      <div className="flex justify-between !pt-6">
        <Button
            onClick={onPrev}
            variant="outline"
          className="!px-12"
        >
            이전
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canComplete}
          className="bg-blue-600 hover:bg-blue-700 text-white !px-8"
        >
          시작하기 
        </Button>
      </div>
    </div>
  );
}