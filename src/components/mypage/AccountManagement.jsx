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
        <CardTitle className="text-red-600">계정 관리</CardTitle>
      </CardHeader>
      <CardContent className="!space-y-4">
        <div className="!space-y-3">
          <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-gray-700">
            로그아웃
          </Button>
          <Button variant="destructive" className="w-full justify-start" onClick={handleDeleteAccount}>
            회원 탈퇴
          </Button>
        </div>
        <div className="text-xs text-gray-500 bg-gray-50 !p-3 rounded-lg">
          회원 탈퇴 시 모든 학습 데이터가 영구적으로 삭제되며, 복구할 수 없습니다.
        </div>
      </CardContent>
    </Card>
  );
}