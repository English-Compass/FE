import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectType } from '../../components/study/SelectType';

export default function StudyPage() {
  const navigate = useNavigate();

  return (
    <div className="!p-4 !sm:p-6 !space-y-6">
      <SelectType navigate={navigate}/>
    </div>
  )
}
