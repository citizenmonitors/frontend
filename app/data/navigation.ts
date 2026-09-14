type Link = {
  name: string;
  href: string;
  highlight?: boolean;
  comingSoon?: boolean;
  subMenu?: Array<Link>;
}

const primaryLinks: Array<Link> = [
  {
    name: 'Home',
    href: '/#home',
  },
  {
    name: 'About',
    href: '/#about',
  },
  {
    name: 'Results',
    href: '/results',
  },
  {
    name: 'Pulse',
    href: '/pulse',
  },
  {
    name: 'Insights',
    href: '/insights',
  },
  {
    name: 'Press',
    href: '/press',
  },
  {
    name: 'Resources',
    href: '/resources',
  },
  {
    name: 'Donate',
    href: '/donate',
    highlight: true,
  },
];

const truncatedLinks = primaryLinks.slice(3);
primaryLinks.push({
  name: 'More',
  href: '',
  subMenu: truncatedLinks
});

const topLinks: Array<Link> = [
  {
    name: 'Privacy Policy',
    href: '/privacy-policy',
  },
  {
    name: 'Terms of Use',
    href: '/terms-of-use',
  },
]

export { primaryLinks, topLinks };