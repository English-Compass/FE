import React from 'react';

export default function HowItWorksSection() {
    const steps = [
        {
          number: 1,
          title: "카카오 로그인",
          description: "간편하게 카카오 계정으로 로그인하세요"
        },
        {
          number: 2,
          title: "레벨 테스트",
          description: "받아쓰기와 말하기로 현재 실력을 확인하세요"
        },
        {
          number: 3,
          title: "맞춤 설정",
          description: "난이도와 학습 목적을 선택하세요"
        },
        {
          number: 4,
          title: "학습 시작",
          description: "AI와 함께 체계적인 영어 학습을 시작하세요"
        }
      ];

    const Step = ({ number, title, description }) => {
        return (
            <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center !mx-auto !mb-4">
                    {number}
                </div>
            <h4 className="!mb-2 font-semibold">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
            </div>
        );
    };
      
    return (
        <section className="!py-16 bg-white">
            <div className="container !mx-auto !px-4">
                <h3 className="text-3xl text-center !mb-12">어떻게 시작하나요?</h3>
                <div className="grid md:grid-cols-4 gap-6">
                {steps.map((step) => (
                    <Step
                    key={step.number}
                    number={step.number}
                    title={step.title}
                    description={step.description}
                    />
                ))}
                </div>
            </div>
        </section>
    )
}