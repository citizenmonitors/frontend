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

export default primaryMetadata;