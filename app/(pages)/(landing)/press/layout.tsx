import LandingLayout from '@/app/components/landing/_layout'
import { pressMetadata } from '@/app/metadata'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = pressMetadata;

export default function PressLayout({ children }: any) {
  return (
    <LandingLayout>
      { children }
    </LandingLayout>
  )
}
