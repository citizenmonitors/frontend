import LandingLayout from '@/app/components/landing/_layout'
import { donateMetadata } from '@/app/metadata'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = donateMetadata;

export default function Layout({ children }: any) {
  return (
    <LandingLayout>
      { children }
    </LandingLayout>
  )
};