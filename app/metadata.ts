import { resetPassword } from './redux/features/userSlice';
const primaryMetadata = {
  title: "Citizen Monitors - Crowdsourcing Electoral Data for Africa",
  description:
    "Citizen Monitors is a platform empowering citizens to hold elections accountable through crowdsourced data. We promote transparency and trust in African democracies.",
  keywords: [
    "citizen monitors", "navalny", "political", "political data", "Africa", "democracy", "accountability", "transparency", "crowdsourcing", "voting", "citizen", "engagement", "democracy"
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: process.env.METADATA_BASEURL!,
    title: "Citizen Monitors - Crowdsourcing Electoral Data for Africa",
    description:
      "Join Citizen Monitors, the leading platform for crowdsourced electoral data in Africa. Ensure transparency and hold elections accountable.",
    siteName: "Citizen Monitors",
    locale: "en_GB",
  },
  metadataBase: new URL(process.env.METADATA_BASEURL!),
};

export const insightsMetadata = {
  title: "Insights - Citizen Monitors",
  description: "Explore deep insights and analysis on African electoral processes, citizen engagement, and transparency through our curated articles and reports.",
  keywords: ["electoral insights", "african elections", "transparency", "voting trends", "citizen data", "election analysis"],
  openGraph: {
    title: "Insights - Citizen Monitors",
    description: "Discover in-depth perspectives and thought leadership on democratic processes in Africa.",
    url: `${process.env.METADATA_BASEURL!}/insights`,
    siteName: "Citizen Monitors",
    type: "article",
    locale: "en_GB",
  },
};

export const pressMetadata = {
  title: "Press - Citizen Monitors",
  description: "Find media coverage, press releases, and official news about Citizen Monitors and our impact on African democracies.",
  keywords: ["citizen monitors", "press", "news", "media", "press release", "democracy", "african politics"],
  openGraph: {
    title: "Press - Citizen Monitors",
    description: "Get the latest press and media coverage about Citizen Monitors.",
    url: `${process.env.METADATA_BASEURL!}/press`,
    siteName: "Citizen Monitors",
    type: "website",
    locale: "en_GB",
  },
};

export const resourcesMetadata = {
  title: "Resources - Citizen Monitors",
  description: "Access helpful guides, tools, and documentation to support electoral observers, volunteers, and the public.",
  keywords: ["electoral tools", "resources", "election guides", "voter education", "citizen monitoring"],
  openGraph: {
    title: "Resources - Citizen Monitors",
    description: "Find everything you need to effectively participate in elections and monitor democratic processes.",
    url: `${process.env.METADATA_BASEURL!}/resources`,
    siteName: "Citizen Monitors",
    type: "website",
    locale: "en_GB",
  },
};

export const donateMetadata = {
  title: "Donate - Citizen Monitors",
  description: "Support our mission to improve election transparency and empower citizens through open data initiatives.",
  keywords: ["donate", "support democracy", "africa", "citizen engagement", "election monitoring"],
  openGraph: {
    title: "Donate - Citizen Monitors",
    description: "Help Citizen Monitors scale impact and drive transparency by donating to our cause.",
    url: `${process.env.METADATA_BASEURL!}/donate`,
    siteName: "Citizen Monitors",
    type: "website",
    locale: "en_GB",
  },
};

export const privacyPolicyMetadata = {
  title: "Privacy Policy - Citizen Monitors",
  description: "Understand how we collect, use, and protect your personal data in compliance with NDPR and GDPR.",
  keywords: ["privacy policy", "data protection", "gdpr", "ndpr", "user data"],
  openGraph: {
    title: "Privacy Policy - Citizen Monitors",
    description: "Read about how Citizen Monitors handles user privacy and data security.",
    url: `${process.env.METADATA_BASEURL!}/privacy-policy`,
    siteName: "Citizen Monitors",
    type: "website",
    locale: "en_GB",
  },
};

export const termsOfUseMetadata = {
  title: "Terms of Use - Citizen Monitors",
  description: "Review the terms and conditions for using Citizen Monitors and participating on the platform.",
  keywords: ["terms of use", "user agreement", "platform rules", "citizen monitors"],
  openGraph: {
    title: "Terms of Use - Citizen Monitors",
    description: "Our terms outline the rules and responsibilities for platform users.",
    url: `${process.env.METADATA_BASEURL!}/terms-of-use`,
    siteName: "Citizen Monitors",
    type: "website",
    locale: "en_GB",
  },
};

export const loginMetadata = {
  title: "Login - Citizen Monitors",
  description: "Access your Citizen Monitors dashboard to submit reports, verify data, and engage with your polling unit.",
  keywords: ["login", "citizen monitors login", "dashboard access", "user login"],
  openGraph: {
    title: "Login - Citizen Monitors",
    description: "Securely log in to your Citizen Monitors account.",
    url: `${process.env.METADATA_BASEURL!}/auth/login`,
    siteName: "Citizen Monitors",
    type: "website",
    locale: "en_GB",
  },
};

export const signupMetadata = {
  title: "Sign Up - Citizen Monitors",
  description: "Become electorally powerful by joining Citizen Monitors. Sign up to observe, volunteer, and contribute to transparent elections.",
  keywords: ["sign up", "citizen monitors", "join", "observer", "volunteer", "african democracy"],
  openGraph: {
    title: "Sign Up - Citizen Monitors",
    description: "Create an account to start contributing to electoral transparency in Africa.",
    url: `${process.env.METADATA_BASEURL!}/auth/signup`,
    siteName: "Citizen Monitors",
    type: "website",
    locale: "en_GB",
  },
};

export const resetPasswordMetadata = {
  title: "Reset Password - Citizen Monitors",
  description: "Reset your Citizen Monitors account password securely.",
  keywords: ["reset password", "citizen monitors", "account recovery", "password reset"],
  openGraph: {
    title: "Reset Password - Citizen Monitors",
    description: "Recover access to your Citizen Monitors account by resetting your password.",
    url: `${process.env.METADATA_BASEURL!}/auth/reset-password`,
    siteName: "Citizen Monitors",
    type: "website",
    locale: "en_GB",
  },
};

export const forgotPasswordMetadata = {
  title: "Account Recovery - Citizen Monitors",
  description: "Request a password reset link to regain access to your Citizen Monitors account.",
  keywords: ["forgot password", "citizen monitors", "account recovery", "password assistance"],
  openGraph: {
    title: "Forgot Password - Citizen Monitors",
    description: "If you've forgotten your password, request a reset link to recover your account.",
    url: `${process.env.METADATA_BASEURL!}/auth/forgot-password`,
    siteName: "Citizen Monitors",
    type: "website",
    locale: "en_GB",
  },
};

export default primaryMetadata;