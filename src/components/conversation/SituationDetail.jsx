import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

export function SituationDetail({ scenario, onBack, onSituationSelect }) {
  return (
    <div className="situation-detail p-4 sm:p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <span className="text-3xl">{scenario.icon}</span>
            <span>{scenario.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{scenario.description}</p>
          
          <div>
            <h4 className="font-medium mb-3">상황을 선택하세요:</h4>
            <div className="space-y-3">
              {scenario.situations.map((situation, index) => (
                <button
                  key={index}
                  onClick={() => onSituationSelect(situation)}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <p className="font-medium">{situation}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}