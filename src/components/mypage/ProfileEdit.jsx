import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useApp } from '../../context/AppContext';

export default function ProfileEdit({ user, editForm, setEditForm, onSave }) {
  const handleKeywordToggle = (keyword) => {
    setEditForm(prev => ({
      ...prev,
      keywords: prev.keywords.includes(keyword)
        ? prev.keywords.filter(k => k !== keyword)
        : [...prev.keywords, keyword],
    }));
  };

  const { STUDY_TYPES, KEYWORDS_BY_CATEGORY } = useApp();

  return (
    <div className="!space-y-6">
      <div className="flex items-center !space-x-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user?.profileImage} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
            {user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="w-50">{user?.name}</h3>
      </div>

      <div className="!space-y-4 max-w-md">
        {/* '실력 수준' 선택 */}
        <div className="!space-y-2">
          <Label htmlFor="level">실력 수준</Label>
          <Select
            value={editForm.level}
            onValueChange={(value) => setEditForm({ ...editForm, level: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Level A - 초급</SelectItem>
              <SelectItem value="B">Level B - 중급</SelectItem>
              <SelectItem value="C">Level C - 상급</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* '관심 키워드' 선택 */}
        <div className="!space-y-3">
          <Label>관심 키워드</Label>
          {editForm.keywords.length > 0 && (
            <div className="bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800 !mb-2">
                선택된 키워드 ({editForm.keywords.length}개)
              </p>
              <div className="flex flex-wrap gap-2">
                {editForm.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="default"
                    className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                    onClick={() => handleKeywordToggle(keyword)}
                  >
                    {keyword}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="!space-y-4">
            {Object.entries(KEYWORDS_BY_CATEGORY).map(([categoryKey, keywords]) => (
              <div key={categoryKey}>
                <h4 className="text-sm font-medium text-gray-700 !mb-2">
                  {STUDY_TYPES.find(type => type.id === categoryKey)?.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant={editForm.keywords.includes(keyword) ? "default" : "outline"}
                      className={`cursor-pointer text-xs ${editForm.keywords.includes(keyword)
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100'
                        }`}
                      onClick={() => handleKeywordToggle(keyword)}
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">저장</Button>
      </div>
    </div>
  );
}