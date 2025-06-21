import { email } from "./links";

export type ListItem = {
  title: string;
  description: string;
}
type Paragraph = string;
type Section = {
  title: string;
  content: ListItem[] | Paragraph[];
}
type Sections = Array<Section>;

export const privacyPolicy: Sections = [
  {
    title: "Introduction",
    content: [
      `Citizen Monitors platform ("Platform") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and protect your data when you use the Platform.`
    ]
  },
  {
    title: "Information We Collect",
    content: [
      {
        title: "Personal Information",
        description: `We may collect personal information such as your name, email address, contact information, and any other information you voluntarily provide when registering or using the Platform.`
      },
      {
        title: "Usage Data",
        description: `We collect data about your interactions with the Platform, including log files, device information, IP addresses, and cookies to improve Platform performance and user experience.`
      }
    ]
  },
  {
    title: "Use of Information",
    content: [
      {
        title: "Platform Services",
        description: `We use your information to provide Platform services, facilitate communication, and personalize your experience.`
      },
      {
        title: "Analytics",
        description: `We may use data for analytics, research, and improving Platform features and functionality.`
      },
      {
        title: "Communication",
        description: `We may send you updates, newsletters, or promotional materials related to the Platform, but you can opt out of such communications at any time.`
      }
    ]
  },
  {
    title: "Data Sharing",
    content: [
      {
        title: "Third-Party Partners",
        description: `We may share your data with trusted third-party partners for services such as analytics, marketing, or technical support. These partners are bound by confidentiality agreements.`
      },
      {
        title: "Legal Compliance",
        description: `We will only disclose your information if ultimately required by law after exhausting all legal channels to do otherwise, and this would be in order to protect our rights, property, or safety, or that of others.`
      }
    ]
  },
  {
    title: "Data Security",
    content: [
      {
        title: "Security Measures",
        description: `We implement industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, or destruction.`
      },
      {
        title: "Data Retention",
        description: `We retain your information only for as long as necessary to fulfil the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.`
      }
    ]
  },
  {
    title: "Cookies and Tracking Technologies",
    content: [
      {
        title: "Cookies",
        description: `We use cookies and similar tracking technologies to enhance user experience.`
      },
      {
        title: "Opt-Out",
        description: `You can modify your browser settings to reject cookies or notify you when cookies are being used. However, this may affect certain features and functionality of the Platform.`
      }
    ]
  },
  {
    title: "Third-Party Links",
    content: [
      `The Platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. Please review their privacy policies before interacting with them.`
    ]
  },
  {
    title: "Children's Privacy",
    content: [
      `The Platform is not intended for children under the age of 18. We do not knowingly collect or solicit personal information from minors. If you believe a minor has provided us with personal information, please contact us immediately.`
    ]
  },
  {
    title: "Updates to Privacy Policy",
    content: [
      `We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of any significant updates via email or through the Platform.`
    ]
  },
  {
    title: "Contact Us",
    content: [
      `If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us at <a class="section-link" rel="noopener" target="_blank" href="mailto:${email}">${email}</a>.`
    ]
  },
];

export const terms: Sections = [
  {
    title: "Introduction",
    content: [
      `Welcome to the Citizen Monitors platform ("Platform"). These terms of use ("Terms") outline the rules and responsibilities governing your use of the Platform as a participant ("User"). By accessing or using the Platform, you agree to comply with these Terms and our Privacy Policy. `
    ]
  },
  {
    title: "User Responsibilities",
    content: [
      {
        title: "Accurate Information",
        description: `Users must provide accurate and truthful information when using the Platform, especially regarding your identity, election data and related content.`
      },
      {
        title: "Lawful Use",
        description: `Users agree to use the Platform in compliance with all applicable laws, regulations, and ethical standards.`
      },
      {
        title: "Respectful Conduct",
        description: `Users must engage in respectful and civil conduct while interacting with other Users and Platform content.`
      },
      {
        title: "Data Accuracy",
        description: `Users are responsible for ensuring the accuracy and integrity of any data or information they contribute to the Platform.`
      }
    ]
  },
  {
    title: "Data Privacy",
    content: [
      {
        title: "Data Collection",
        description: `We collect and process User data in accordance with our Privacy Policy. By using the Platform, you consent to the collection, processing, and storage of your data.`
      },
      {
        title: "Data Security",
        description: `We employ reasonable security measures to protect User data, but we cannot guarantee absolute security. Users are responsible for safeguarding their login credentials and ensuring the security of their devices.`
      },
      {
        title: "Data Usage",
        description: `User data may be used for analysis, research, and improvement of Platform services. We do not share User data with third parties except as outlined in our Privacy Policy or with the users consent.`
      }
    ]
  },
  {
    title: "Intellectual Property",
    content: [
      {
        title: "Ownership",
        description: `The platform retains ownership of all intellectual property rights related to the Platform, including but not limited to trademarks, logos, and content.`
      },
      {
        title: "User Content",
        description: `By uploading election data to the Platform, Users grant Citizen Monitors a non-exclusive, royalty-free license to use, reproduce, modify, and commercially issue the content for the Platforms viability and sustainability.`
      }
    ]
  },
  {
    title: "Prohibited Activities",
    content: [
      {
        title: "Misuse",
        description: `We implement industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, or destruction.`
      },
      {
        title: "Unauthorized Access",
        description: `Users must not attempt to gain unauthorized access to Platform features, data, or systems.`
      },
      {
        title: "Malicious Software",
        description: `Users must not upload or distribute any malicious software or code on the Platform.`
      },
      {
        title: "Illegal Content",
        description: `Users must not upload, share, or distribute illegal, offensive, or inappropriate content on the Platform.`
      },
    ]
  },
  {
    title: "Termination and Classification",
    content: [
      {
        title: "",
        description: `The platform reserves the right to terminate user access to the Platform at any time, with or without cause, if users violate these Terms or engage in misconduct.`
      },
      {
        title: "",
        description: `Users can also be downgraded or upgraded from their class levels of registration based on performance and track record.`
      }
    ]
  },
  {
    title: "Indemnification",
    content: [
      `Users agree to indemnify and hold Citizen Monitors harmless from any claims, damages, or liabilities arising from their use of the Platform or violation of these Terms.`
    ]
  },
  {
    title: "Modifications",
    content: [
      `The Citizen Monitors platform may update or modify these Terms at any time. Users will be notified of significant changes to the Terms.`
    ]
  },
  {
    title: "Governing Law",
    content: [
      `These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of laws principles.`
    ]
  },
  {
    title: "Contact Information",
    content: [
      `If you have any questions, concerns, or requests regarding these Terms or your use of the Citizen Monitors platformn, please contact us at <a class="section-link" rel="noopener" target="_blank" href="mailto:${email}">${email}</a>.`
    ]
  },
];