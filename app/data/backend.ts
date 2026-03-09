const backendURL = (process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "").trim();
export const backendDomain = backendURL.replace("/api", "");

export const backendRoutes = {
  auth: {
    register: 'auth/register',
    resendEmailVerificationToken: 'auth/resend-token',
    verifyEmail: 'auth/verify-email',
    login: 'auth/signin',
    forgetPassword: 'auth/forgot-password',
    resetPassword: 'auth/reset-password',
    validateToken: 'auth/validate',
    
    // New Routes
    submitDetails: 'auth/submit-details',
    selectRole: 'auth/select-role',
    submitRole: 'auth/submit-role'
  },
  dashboard: {
    user: {
      upgradeAccount: 'volunteer-to-observer',
      updateAccount: 'user',
      deleteAccount: 'user',
      resendEmailVerificationToken: 'user/resend-token',
      verifyEmail: 'user/verify-email',
      updateEmail: 'user/update-email',
      resendEmailUpdateToken: 'user/resend-token',
      verifyEmailUpdate: 'user/verify-email',
      submitSupportTicket: 'support',
    },
    elections: {
      get: 'elections',
      getTypes: 'elections/election-types',
      create: 'elections/active-elections',
      getById: (id: string) => `elections/election/${id}`,
      update: (id: string) => `elections/election/${id}`,
      delete: (id: string) => `elections/active-election/${id}`,
      
      getLiveById: (id: string) => `elections/live-results/${id}`,
      getResults: (id: string) => `elections/election/${id}/results`,
      getPollingUnitResults: () => `elections/user-action`,
      getFlagPermission: () => `elections/flag-action`,
      getActivity: () => `elections/activity-board`,
      getSingleLiveResult: () => `elections/live-result`,

      uploadResult: (id: string) => `elections/election/${id}/results`,
      uploadReport: (id: string) => `elections/election/${id}/report`,
      updateResult: (id: string) => `elections/election/${id}/results`,
      updateReport: (id: string) => `elections/election/${id}/report`,
      deleteResult: (id: string) => `elections/election/${id}/results`,
      deleteReport: (id: string) => `elections/election/${id}/report`,
      fetchUploads: () => `elections/user-election-data`,
    },
    inbox: {
      get: 'podcasts/inbox',
      markRead: (id: string) => `podcast/mark-read/${id}`,
    }
  },
  admin: {
    dashboard: {
      getDashboard: () => `admin/dashboard`,
    },
    elections: {
      get: 'admin/elections',
      getById: (id: string) => `admin/live-election/${id}`,
    },
    uploads: {
      get: 'admin/results',
      getById: (id: string) => `admin/result/${id}`,
      delete: (id: string) => `admin/result/${id}`,
    },
    flaggedUploads: {
      get: 'admin/flagged-results',
      getById: (id: string) => `admin/single-flagged/${id}`,
      restoreFlag: (id: string) => `admin/restore-flagged/${id}`,
      deleteFlag: (id: string) => `admin/delete-flagged/${id}`,
    },
    users: {
      get: 'admin/users',
      getById: (id: string) => `admin/user/${id}`,
      delete: (id: string) => `admin/user/${id}`,
    },
    verification: {
      get: 'admin/observers',
      approve: (id: string) => `admin/approve-observer/${id}`,
      downgrade: (id: string) => `admin/downgrade-observer/${id}`,
      unverify: (id: string) => `admin/unapprove-observer/${id}`,
    },
    activityLog: {
      get: 'admin/access-control'
    },
    admins: {
      get: 'admin/get-admins',
      getById: (id: string) => `admin/single-admin/${id}`,
      suspend: (id: string) => `admin/suspend-admin/${id}`,
      create: 'admin/invite-admin',
      update: (id: string) => `admin/update-admin/${id}`,
    },
    outbox: {
      create: 'admin/podcast',
      get: 'admin/podcast',
      update: (id: string) => `admin/podcast/${id}`,
      getById: (id: string) => `admin/podcast/${id}`,
      delete: (id: string) => `admin/podcast/${id}`,
    },
    notifications: {
      get: 'admin/notifications',
      markRead: (id: string) => `admin/notification/mark-read/${id}`,
      delete: (id: string) => `admin/notification/delete/${id}`,
    },
    schedule: {
      get: 'admin/schedule',
      export: 'admin/schedule/export',
    },
    bookings: {
      update: (id: string) => `admin/bookings/${id}`,
    },
    speakerSlots: {
      events: 'admin/speaker-slots/events',
      createEvent: 'admin/speaker-slots/events',
      eventSchedule: (eventId: string) => `admin/speaker-slots/events/${eventId}/schedule`,
      eventExport: (eventId: string) => `admin/speaker-slots/events/${eventId}/export`,
      eventSlots: (eventId: string) => `admin/speaker-slots/events/${eventId}/slots`,
      slotDelete: (slotId: string) => `admin/speaker-slots/slots/${slotId}`,
      eventInvites: (eventId: string) => `admin/speaker-slots/events/${eventId}/invites`,
      eventBookings: (eventId: string) => `admin/speaker-slots/events/${eventId}/bookings`,
      bookingUpdate: (bookingId: string) => `admin/speaker-slots/bookings/${bookingId}`,
      bookingDelete: (bookingId: string) => `admin/speaker-slots/bookings/${bookingId}`,
    },
  },
  locations: {
    states: 'locations/states',
    localGovernments: (state: string) => `locations/states/${state}/local_governments`,
    wards: (state: string, lga: string) => `locations/states/${state}/local_governments/${lga}/wards`,
    pollingUnits: (state: string, lga: string, ward: string) => `locations/states/${state}/local_governments/${lga}/wards/${ward}/polling_units`,
  },
  speakerInvite: {
    get: (token: string) => `speaker-invite/${token}`,
    book: (token: string) => `speaker-invite/${token}/book`,
  },
  speakerSlots: {
    invite: (token: string) => `speaker-slots/invite/${token}`,
    book: "speaker-slots/book",
    confirm: (bookingId: string) => `speaker-slots/booking/confirm/${bookingId}`,
    ics: (bookingId: string) => `speaker-slots/booking/${bookingId}/ics`,
    seedData: "speaker-slots/seed-data",
  },
  data: {
    banks: 'banks',
    states: 'states',
    localGovernments: (state: string) => `state/${state}`,
    wards: (state: string, lga: string) => `state/${state}/lga/${lga}`,
    pollingUnits: (state: string, lga: string, ward: string) => `state/${state}/lga/${lga}/ward/${ward}`,
  }
} as const;

export default backendURL;
