import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectType } from '../../components/study/SelectType';

export default function StudyPage() {
  const navigate = useNavigate();

  return (
    <div className='study-page'>
      <SelectType navigate={navigate}/>
    </div>
  )
}
