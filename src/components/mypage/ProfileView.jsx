import React from 'react';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

// API: 서버에서 현재 로그인된 사용자의 프로필 정보를 가져와야 합니다.
// 예: useEffect(() => { fetch('/api/user/profile').then(res => res.json()).then(data => setUser(data)); }, []);

export default function ProfileView({ user, getDifficultyText }) {
  return (
    <div className="!space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user?.profileImage} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
            {user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="!space-y-2">
          <h3 className="text-2xl font-bold text-gray-800">{user?.name}</h3>
          <p className="text-gray-600">{user?.email}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Level {user?.level}</Badge>
            <Badge variant="secondary">{getDifficultyText(user?.level)}</Badge>
          </div>
        </div>
      </div>
        <div className="!my-14">
            <div>
                <h4 className='font-semibold text-gray-800 !mb-2'>현재 실력</h4>
                <p className="flex flex-wrap gap-2">Level {user?.level} - {getDifficultyText(user?.level)}</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-800 !mb-2">관심 키워드</h4>
                <div className="flex flex-wrap gap-2">
                {user?.keywords?.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                    {keyword}
                    </Badge>
                ))}
                </div>
            </div>
        </div>
    </div>
  );
}