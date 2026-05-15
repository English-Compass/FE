import React from 'react';
import { Outlet } from 'react-router-dom';
import NaviBar from '../components/NaviBar.jsx';
import TopBar from '../components/TopBar.jsx';

export default function Layout() {
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