import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function AccountManagementCard() {
  const handleLogout = () => console.log('Logout requested');
  const handleDeleteAccount = () => {
    if (window.confirm('정말로 회원 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) {
      console.log('Account deletion requested');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="account-management__title">계정 관리</CardTitle>
      </CardHeader>
      <CardContent className="account-management__content">
        <div className="space-y-3">
          <Button onClick={handleLogout} variant="outline" className="account-management__content-button">
            로그아웃
          </Button>
          <Button variant="destructive" className="account-management__content-button" onClick={handleDeleteAccount}>
            회원 탈퇴
          </Button>
        </div>
        <div className="account-management__content-notice">
          회원 탈퇴 시 모든 학습 데이터가 영구적으로 삭제되며, 복구할 수 없습니다.
        </div>
      </CardContent>
    </Card>
  );
}