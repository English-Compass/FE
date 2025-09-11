import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NaviBar from '../components/NaviBar.jsx';
import TopBar from '../components/TopBar.jsx';

export default function Layout() {
    const navigate = useNavigate();
    
    useEffect(() => {
        // 로그인 상태 확인
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
            console.log('Layout - 로그인 정보가 없습니다. 랜딩 페이지로 리다이렉트');
            navigate('/landing');
            return;
        }
    }, [navigate]);
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <TopBar />
            
            {/* Main Content */}
            <main className="flex-1 !pb-24">
                <div className="max-w-7xl !mx-auto">
                    <Outlet />
                </div>
            </main>
            
            {/* Bottom Navigation */}
            <NaviBar />
        </div>
    )
}