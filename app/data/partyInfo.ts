const partyInfo: Record<
  string,
  { logo: string; fullName?: string } | undefined
> = {
  PDP: {
    logo: "/assets/party/pdp.png",
    fullName: "Peoples Democratic Party",
  },
  APC: {
    logo: "/assets/party/apc.png",
    fullName: "All Progressives Congress",
  },
  LP: {
    logo: "/assets/party/lp.png",
    fullName: "Labour Party",
  },
  A: {
    logo: "/assets/party/default.png",
    fullName: "Accord",
  },
  ADC: {
    logo: "/assets/party/default.png",
    fullName: "African Democratic Congress",
  },
  ADP: {
    logo: "/assets/party/default.png",
    fullName: "Action Democratic Party",
  },
  ZLP: {
    logo: "/assets/party/default.png",
    fullName: "Zenith Labour Party",
  },
  AA: {
    logo: "/assets/party/default.png",
    fullName: "Action Alliance",
  },
  AAC: {
    logo: "/assets/party/default.png",
    fullName: "African Action Congress",
  },
  APGA: {
    logo: "/assets/party/default.png",
    fullName: "All Progressives Grand Alliance",
  },
  YPP: {
    logo: "/assets/party/default.png",
    fullName: "Young Progressives Party",
  },
  APM: {
    logo: "/assets/party/default.png",
    fullName: "Allied Peoples Movement",
  },
  SDP: {
    logo: "/assets/party/default.png",
    fullName: "Social Democratic Party",
  },
  NNPP: {
    logo: "/assets/party/default.png",
    fullName: "New Nigeria Peoples Party",
  },
  BP: {
    logo: "/assets/party/default.png",
    fullName: "Boot Party",
  },
  APP: {
    logo: "/assets/party/default.png",
    fullName: "Action Peoples Party",
  },
  PRP: {
    logo: "/assets/party/default.png",
    fullName: "Peoples Redemption Party",
  },
  NDC: {
    logo: "/assets/party/default.png",
    fullName: "Nigeria Democratic Congress",
  },
  Others: {
    logo: "/assets/party/default.png",
    fullName: "Others",
  },
};

export default partyInfo;

export function getPartyLogo(partyCode: string) {
  return partyInfo[partyCode]?.logo || "/assets/party/default.png";
}

export function getPartyFullName(partyCode: string) {
  return (
    partyInfo[partyCode]?.fullName ||
    partyCode
  );
}

/** Abbreviation + full name when they differ (e.g. "APC · All Progressives Congress") */
export function getPartyDisplayLabel(partyCode: string) {
  if (!partyCode || partyCode === "Others") return partyCode || "Others";
  const full = getPartyFullName(partyCode);
  if (full === partyCode) return partyCode;
  return `${partyCode} · ${full}`;
}
