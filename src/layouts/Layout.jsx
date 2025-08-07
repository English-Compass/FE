import React from 'react';
import { Outlet } from 'react-router-dom';
import NaviBar from '../components/NaviBar.jsx';
import TopBar from '../components/TopBar.jsx';
import '../styles/components/_layout.scss';

export default function Layout() {
    return (
        <div className="layout">
            {/* Header */}
            <TopBar />
            {/* Main Content */}
            <main className="layout__main">
                <div className="layout__main-container">
                    <Outlet />
                </div>
            </main>
            {/* Bottom Navigation */}
            <NaviBar />
        </div>
    )
}