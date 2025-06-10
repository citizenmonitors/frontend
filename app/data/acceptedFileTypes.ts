const file = {
  // Images
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  // Documents
  pdf: 'application/pdf',
  // Video
  mp4: 'video/mp4',
  mov: 'video/quicktime',
} as const;

const fileTypes = {
  observerID: [file.png, file.jpg],
  profilePicture: [file.png, file.jpg],

  incidentReportPicture: [file.png, file.jpg],
  incidentReportVideo: [file.mp4, file.mov],
  resultPicture: [file.png, file.jpg],
  resultVideo: [file.mp4, file.mov],
} as const;

// Convert the fileTypes values to a string
const fileTypeKeys = Object.keys(fileTypes) as (keyof typeof fileTypes)[];
const acceptedFileTypes: Record<keyof typeof fileTypes, string> = {} as any;
fileTypeKeys.forEach((key) => {
  acceptedFileTypes[key] = fileTypes[key].join(",");
});

export default acceptedFileTypes;
export type FileType = (typeof file)[keyof typeof file];