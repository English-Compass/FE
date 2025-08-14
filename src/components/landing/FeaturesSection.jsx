import React from 'react';
import { Brain, MessageCircle, BarChart3 } from "lucide-react";

export default function FeaturesSection() {
    const features = [
        {
            icon: Brain,
            title: "AI 기반 맞춤 학습",
            description: "개인의 수준과 학습 패턴을 분석하여 최적화된 커리큘럼을 제공합니다.",
            iconColor: "text-blue-600"
        },
        {
            icon: MessageCircle,
            title: "실시간 발음 평가",
            description: "AI 음성 인식 기술로 정확한 발음을 실시간으로 평가하고 피드백을 제공합니다.",
            iconColor: "text-green-600"
        },
        {
            icon: BarChart3,
            title: "상세한 진도 추적",
            description: "학습 진도와 성과를 시각적으로 확인하고 목표를 설정하세요.",
            iconColor: "text-purple-600"
        }
    ];
    
    const FeatureCard = ({ icon, title, description, iconColor }) => {
        const Icon = icon;
        return (
            <div className="bg-white rounded-lg border shadow-sm text-center !p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="!mb-6">
                    <Icon className={`h-12 w-12 ${iconColor} mx-auto !mb-4`} />
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                </div>
                <div>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
            </div>
        );
    };

    return (
        <section className="!py-16 bg-gray-50">
            <div className="container !mx-auto !px-4">
                <h3 className="text-3xl font-bold text-center !mb-12 text-gray-800">
                    왜 English Compass를 선택해야 할까요?
                </h3>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            iconColor={feature.iconColor}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}