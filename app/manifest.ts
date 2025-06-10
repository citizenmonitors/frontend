import { MetadataRoute } from 'next';
import primaryMetadata from './metadata';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: primaryMetadata.title,
    short_name: primaryMetadata.openGraph.siteName,
    description: primaryMetadata.description,
    start_url: '/',
    display: 'standalone',
    background_color: 'white',
    icons: [
      {
        src: '/pwa/logo-circle-2.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/pwa/logo-2.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/pwa/logo-circle.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/pwa/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
    ],
  }
}