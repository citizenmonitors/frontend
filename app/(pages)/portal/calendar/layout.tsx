"use client";
import { useAppDispatch } from '@/app/hooks/redux';
import { clearElections, getElections } from '@/app/redux/features/electionSlice';
import React, { useEffect } from 'react'

export default function CalendarLayout({ children }: any) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getElections());

    return () => {
      dispatch(clearElections());
    }
  }, []);

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}
