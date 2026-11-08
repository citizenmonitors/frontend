type Link = {
  name: string;
  href: string;
  highlight?: boolean;
  comingSoon?: boolean;
  /** Shows a brand-colour dot to flag a newly rolled-out feature */
  isNew?: boolean;
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
    name: 'Collation',
    href: '/collation',
  },
  {
    name: 'Pulse',
    href: '/pulse',
    isNew: true,
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