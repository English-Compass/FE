import React from 'react';
import { Button } from '../ui/button';

export default function HeroSection() {

    const handleLogin = () => {
        // 백엔드의 카카오 로그인 엔드포인트로 직접 이동
        window.location.href = 'http://54.180.60.200:8080/oauth2/authorization/kakao';
    }
    
    return (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white !py-20">
                <div className="container !mx-auto !px-4 text-center">
                    <div className="max-w-3xl !mx-auto">
                    <h2 className="text-4xl !md:text-5xl !mb-6">
                        AI와 함께하는
                        <br />
                        <span className="text-yellow-300">스마트 영어 학습</span>
                    </h2>
                    <p className="text-lg !md:text-xl !mb-8">
                        개인 맞춤형 AI 튜터가 당신의 영어 실력 향상을 도와드립니다.
                        <br />
                        언제 어디서나 효과적인 영어 학습을 경험해보세요.
                    </p>
                    
                    <div className="flex flex-col items-center !space-y-4">
                        <Button 
                        className="!bg-yellow-400 !text-black hover:!bg-yellow-500 !px-10 !py-6 text-lg !rounded-md transition-colors flex items-center"
                        onClick={handleLogin}
                        >
                        <svg className="!w-5 !h-5 !mr-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3C6.48 3 2 6.55 2 10.86c0 2.74 1.86 5.15 4.64 6.55l-.94 3.43c-.09.32.25.57.53.39l4.09-2.69c.55.08 1.12.12 1.68.12 5.52 0 10-3.55 10-7.86S17.52 3 12 3z"/>
                        </svg>
                        카카오로 시작하기
                        </Button>
                        <p className="text-lg text-white/80">
                        간편하게 맞춤형 학습을 시작해 보세요!
                        </p>
                    </div>
                    </div>
                </div>
    </section>
    )
}