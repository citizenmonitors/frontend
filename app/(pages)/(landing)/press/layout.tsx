import LandingLayout from '@/app/components/landing/_layout'
import React from 'react'

export default function PressLayout({ children }: any) {
  return (
    <LandingLayout>
      { children }
    </LandingLayout>
  )
}
