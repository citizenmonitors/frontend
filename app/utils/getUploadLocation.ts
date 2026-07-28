export type UploadLocation = {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
  capturedAt: string;
};

function mapGeolocationError(error: GeolocationPositionError): Error {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return new Error(
        "Location permission denied. Please turn on location access in your browser settings, then try again."
      );
    case error.POSITION_UNAVAILABLE:
      return new Error(
        "Your location is currently unavailable. Please enable GPS/location services and try again."
      );
    case error.TIMEOUT:
      return new Error(
        "Timed out while getting your location. Please try again with location turned on."
      );
    default:
      return new Error(
        "Unable to get your location. Please enable location and try again."
      );
  }
}

/**
 * Captures the observer's current GPS position for election uploads.
 * Backend expects uploadLocation on observer result/incident submissions.
 */
export default async function getUploadLocation(): Promise<UploadLocation> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    throw new Error(
      "Location services are not available on this device. Please use a browser that supports location, then try again."
    );
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 20_000,
      maximumAge: 0,
    });
  }).catch((error: GeolocationPositionError) => {
    throw mapGeolocationError(error);
  });

  const { latitude, longitude, accuracy } = position.coords;

  return {
    latitude,
    longitude,
    address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    accuracy: typeof accuracy === "number" ? accuracy : 0,
    capturedAt: new Date().toISOString(),
  };
}
