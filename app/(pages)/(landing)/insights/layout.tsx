import LandingLayout from '@/app/components/landing/_layout'
import { insightsMetadata } from '@/app/metadata'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = insightsMetadata;

export default function Layout({ children }: any) {
  return (
    <LandingLayout>
      {children}
    </LandingLayout>
  )
};