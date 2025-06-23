/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.METADATA_BASEURL,
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/admin/*',
    '/portal/*',
    '/resources/*',
    '/auth/reset-password',
    '/admin',
    '/portal',
    '/manifest.webmanifest',
    '/apple-icon*.png',
    '/icon*.png',
    '/opengraph-image.png',
    '/twitter-image.png',
    '/auth/signup/*',
  ],
  transform: async (config, path) => {
    const priorityMap = {
      '/': 1.0,
      '/donate': 0.9,
      '/auth/login': 0.8,
      '/auth/signup': 0.8,
      '/insights': 0.7,
      '/press': 0.7,
      '/resources': 0.7,
      '/privacy-policy': 0.5,
      '/terms-of-use': 0.5,
    };
    const priority = priorityMap[path] ?? 0.5;
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*', '/portal/*'],
      },
    ],
  },
};
