import LandingLayout from '@/app/components/landing/_layout'
import React from 'react'

export default function Layout({ children }: any) {
  return (
    <LandingLayout>
      { children }
    </LandingLayout>
  )
};