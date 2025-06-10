"use client";
import { useAppDispatch } from '@/app/hooks/redux';
import { showAlert } from '@/app/redux/features/alertSlice';
import { useRouter } from 'next/navigation'
import React, { use, useEffect } from 'react'

export default function PollsAndSurveys() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    router.replace('/portal/dashboard');
    dispatch(showAlert({ message: 'Polls and surveys is coming soon.', type: 'info' }));
  }, []);
  return (
    <div>Polls & Surveys</div>
  )
}
