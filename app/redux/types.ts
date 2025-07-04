// Abstract
export type Region = 'state' | 'lga' | 'ward' | 'pollingUnit';
export type BinaryOption = 'yes' | 'no';
export type RatingOption = 'good' | 'okay' | 'poor';
export type IncidentTypes = "Thuggery and Violence" | "Lack of electoral materials" | "Fraudulent electoral officers" | "Late commencement" | "Over voting" | "Other";
export type CurrencyCode = "ngn" | "usd" | "gbp";

export type FileInfo = {
  _id: string;
  name: string;
  type: string;
  size: number;
  location: string;
  url: string;
}

export type SupportTicket = {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  category: string,
  message: string,
};

export type DBObject = {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

// App
export type FetchState = 'not started' | 'pending' | 'fulfilled' | 'rejected';
export type UserRole = 'observer' | 'volunteer' | 'super-admin' | 'admin';

export type ObserverVerificationDetails = {
  observerId: Array<FileInfo>;
  phoneNumber: string;
  bankName?: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export type NotificationSettings = {
	email: {
		inbox: boolean;
		election: boolean;
		newsletter: boolean;
	}
}

export type User = DBObject & {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  profileImage: FileInfo | null;
  gender: string;
  dateOfBirth: string;
  state: string;
  lga: string;
  ward: string;
  pollingUnit: string;
  isRegisteredVoter: boolean;
  isPoliticalPartyMember: boolean;
  isElectionWitnessReady: boolean;
  isOpenToSurvey: boolean;
  observerVerificationDetails: ObserverVerificationDetails;
  isObserverInPollingUnit: boolean;
  pendingObserverVerification: boolean;
	notifications: NotificationSettings;
} & ObserverVerificationDetails;

export type FetchedElection = DBObject & Election & {
  incidentReports: Array<ElectionReport>;
  results: Array<ElectionResult>;
}

export type ElectionType = DBObject & {
  electionType: string;
  electionName: string;
}

// Active Elections
export type ActiveElection = {
	electionLocation: string | null;
	startDate: string;
	endDate: string;
	mockElection: boolean;
}

export type Election = DBObject & ActiveElection & {
  electionType: string;
  electionName: string;
  politicalParties: Array<ElectionParty>;
  resultsCount: number;
  results: Array<string>;
  incidentReports: Array<string>;
}

export type ElectionParty = {
  name: string;
  code: string;
  logo: string;
}

export type ElectionPartyResult = {
  party: string;
  count: number;
}

export type ElectionResult = DBObject & {
  timeBegan: string;
  accreditedVoters: number;
  rejectedPapers: number;
  spoiledBallotPapers: number;
  usedBallotPapers: number;
  partiesVotes: Array<ElectionPartyResult>;
  resultPicture: FileInfo;
  resultVideo: FileInfo | null;
  state: string,
  lga: string,
  ward: string,
  pollingUnit: string,
  election: Pick<Election, '_id' | 'electionType' | 'startDate' | 'endDate' | 'electionName' | 'electionLocation'>;
  // Survey
  voteBuying: BinaryOption;
  voterIntimidation: BinaryOption;
  voteRating: RatingOption;
};

export type ElectionReport = DBObject & {
  _id?: string;
  selectIncident: string;
  incidentNote: string;
  incidentPictures: Array<FileInfo>;
  incidentVideos: Array<FileInfo>;
  state: string,
  lga: string,
  ward: string,
  pollingUnit: string,
  election: Pick<Election, '_id' | 'electionType' | 'startDate' | 'endDate' | 'electionName' | 'electionLocation'>;
  // Survey
  electionRating: RatingOption;
}

export type PollingUnitUploadAction = 'agree' | 'flag';
export type PollingUnitUploadType = 'incident' | 'election';
export type PollingUnitUploadProps = {
  electionYear: string,
  electionType: string,
  electionTypeId: string,
  electionName: string,
  electionId: string,
  uploadedAt: string,
  agreed: boolean,
  flagged: boolean,
}
export type PollingUnitResult = ElectionResult & PollingUnitUploadProps;
export type PollingUnitReport = ElectionReport & PollingUnitUploadProps;


// ===============================================================
type LiveVotesPerParty = { party: string } & Record<string, number>;
export type BaseLiveElectionResult = {
  chart: Array<LiveVotesPerParty>;
  aggregateAnalysis: Record<string, number>;
  footer?: Record<string, number>;
  restriction?: { name: string, value: string } | null;
};
export type GroupedLiveElectionResult = Array<
  { [groupRegion: string]: string } & BaseLiveElectionResult
>;
export type LiveIncidentsPerRegion = { [groupRegion: string]: string } & Record<IncidentTypes, number>;
export type BaseLiveElectionIncident = {
  chart: Array<LiveIncidentsPerRegion>;
  aggregateAnalysis: Record<string, number>;
  footer?: Record<string, number>;
  restriction?: { name: string, value: string } | null;
}
export type LiveOverallSentimentAnalysis = {
  voteRating: Record<RatingOption, number>;
  voterIntimidation: Record<BinaryOption, number>;
  voteBuying: Record<BinaryOption, number>;
};
// ===============================================================

export type LiveElection = {
  electionDetails: Pick<Election, 'mockElection' | 'electionLocation' | 'electionType' | 'electionName' | 'startDate' | 'endDate'>;

  result: BaseLiveElectionResult | GroupedLiveElectionResult | null;
  incidentReport: BaseLiveElectionIncident | null;
  sentimentAnalysis: {
    chart: LiveOverallSentimentAnalysis | null;
    aggregateAnalysis?: Record<string, number>;
  } | null

  partyColors: Record<string, string>;
}




// Notifications
export type NotificationType = 'upload' | 'verification';
export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
}

// Activity Board
export type ActivityNotification = DBObject & {
  type: string,
  body: string,
  info: string,
}

export type ActivityLiveElection = Pick<LiveElection, 'electionDetails' | 'result' | 'partyColors'>;

// ============ ADMIN ==============

export type AdminPermissions = 'getAdmins' | 'viewResults' | 'viewResult' | 'deleteResult' | 'viewUsers' | 'viewUser' | 'deleteUser' | 'approveObserver' | 'downgradeObserver' | 'deleteFlagged' | 'restoreFlagged' | 'createElection' | 'updateElection' | 'createActiveElection' | 'updateActiveElection' | 'deleteElection' | 'deleteActiveElection';

// Month Comparison
export type MonthComparison = {
  count: number,
  lastMonthComparison: number | string,
  data: Array<number>,
}

export type AdminDashboardGraphs = {
  registeredUsers: MonthComparison,
  observers: MonthComparison,
  activeUsers: MonthComparison,
  resultsUploaded: MonthComparison,
  userInfo: {
    gender: Array<{ count: number, name: string }>,
    roles: Array<{ count: number, name: string }>
  },
  admins: Array<Pick<User, '_id' | 'email' | 'firstName' | 'lastName' | 'profileImage'>>,
  dailyTraffic: MonthComparison,
}

export type AdminUserGraphs = {
  registeredUsers: MonthComparison,
  userInfo: {
    gender: Array<{ count: number, name: string }>,
    roles: Array<{ count: number, name: string }>
  },
}

export type AdminElectionUpload = {
  id: string,
  createdAt: string,
  firstName: string,
  lastName: string,
  email: string,
  role: UserRole,
  election: string,
  state: string,
  lga: string,
  resultUploaded: "Election Result" | "Incident Report",
  pictures: Array<FileInfo>,
  videos: Array<FileInfo>,
};

export type AdminFlaggedUpload = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  role: UserRole,
  election: string,
  state: string,
  lga: string,
  pollingUnit: string,
  createdAt: string,
  hidden: boolean,
  priorityLevel: number,
  pictures: Array<FileInfo>,
  videos: Array<FileInfo>,
  resultUploaded: "Election Result" | "Incident Report",
}

export type DetailedResult = DBObject & {
  electionDetails: Pick<Election, 'electionType' | 'electionName' | 'startDate' | 'endDate'>,
  election: string,
  user: string,
  userRole: string,
  state: string,
  lga: string,
  ward: string,
  pollingUnit: string,
  resultPicture: FileInfo,
  resultVideo: FileInfo,
  partiesVotes: Array<ElectionPartyResult>,
  voteRating: string,
  voterIntimidation: string,
  voteBuying: string,
  isApproved: boolean,
  timeBegan: string,
  accreditedVoters: number;
  rejectedPapers: number;
  spoiledBallotPapers: number;
  usedBallotPapers: number;
}

export type DetailedIncident = DBObject & {
  electionDetails: Pick<Election, 'electionType' | 'electionName' | 'startDate' | 'endDate'>,
  election: string,
  user: string,
  userRole: UserRole,
  state: string,
  lga: string,
  ward: string,
  pollingUnit: string,
  selectIncident: string,
  incidentNote: string,
  electionRating: string,
  incidentPictures: Array<FileInfo>,
  incidentVideos: Array<FileInfo>,
}

export type AdminDetailedUpload = {
  result?: DetailedResult,
  incident?: DetailedIncident
}

export type AdminDetailedFlaggedUpload = {
  result?: DetailedResult;
  incident?: DetailedIncident;
  counterEvidence: Array<DetailedIncident> | Array<DetailedResult>;
};

export type AdminAdminGraphs = {
  logs: MonthComparison,
  admins: Array<Pick<User, '_id' | 'email' | 'firstName' | 'lastName' | 'profileImage'>>
};

export type AdminPodcast = {
  title: string,
  content: string,
  recipients: Array<string>,
  sender: string
} & DBObject;

export type AdminNotification = {
  type: string,
  body: string,
  info: string,
  read: boolean,
} & DBObject;

export type Podcast = {
  title: string,
  content: string,
  read: boolean,
} & DBObject;
