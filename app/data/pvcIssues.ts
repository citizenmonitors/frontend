export const PVC_ISSUE_TYPE_OTHER = "Other";

export const PVC_ISSUE_TYPES = [
  {
    value: "Marked as 'Unknown' in the voters roll despite valid registration",
    label: "Marked as 'Unknown' in the voters roll despite valid registration",
  },
  {
    value: "PVC not available at collection centre",
    label: "PVC not available at collection centre",
  },
  {
    value: "PVC collection point inaccessible / unreasonably far",
    label: "PVC collection point inaccessible / unreasonably far",
  },
  {
    value: "Biometric data mismatch or capture failure",
    label: "Biometric data mismatch or capture failure",
  },
  {
    value: "Registration completed but PVC never issued",
    label: "Registration completed but PVC never issued",
  },
  {
    value: "PVC defaced or damaged",
    label: "PVC defaced or damaged",
  },
  {
    value: PVC_ISSUE_TYPE_OTHER,
    label: "Other",
  },
] as const;

export type PvcIssueType = (typeof PVC_ISSUE_TYPES)[number]["value"];

export const PVC_CONSENT_TEXT =
  "I consent to Citizen Monitors collecting and storing the data I have provided. I authorise Citizen Monitors to use this information to represent my case in engagement with the Independent National Electoral Commission (INEC), and to contact me as part of efforts to build a legal case to push for my fundamental right to vote as enshrined in the Nigerian Constitution.";

export const PVC_CONFIRMATION_MESSAGE =
  "Thank you for submitting your report. Your case has been received and added to Citizen Monitors' national PVC issues record. A member of our team may reach out for follow-up. Your voice matters — and your vote should too.";

export const PVC_DESCRIPTION_MAX = 1000;
export const PVC_EVIDENCE_MAX_FILE_SIZE = 5 * 1024 * 1024;

export function getPvcIssueLabel(value: string) {
  return PVC_ISSUE_TYPES.find((issue) => issue.value === value)?.label ?? value;
}
