import { UserRole } from "@/app/redux/types";

export function canUploadElectionData(role: UserRole): boolean {
  return role === "volunteer" || role === "observer";
}

export function canAppraiseObserverUploads(role: UserRole): boolean {
  return role === "volunteer" || role === "observer";
}

export function canUpgradeToObserver(role: UserRole): boolean {
  return role === "volunteer";
}

export function canUpgradeToVolunteer(role: UserRole): boolean {
  return role === "public-viewer";
}

export function getNoObserverUploadMessage(role: UserRole): string {
  if (canUpgradeToVolunteer(role)) {
    return "No data is available for your polling unit as there’s currently no accredited observer. Upgrade to Volunteer first if you want to take on a more active role.";
  }
  if (canUpgradeToObserver(role)) {
    return "No data is available for your polling unit as there’s currently no accredited observer for your polling unit. You can upgrade now to become the accredited observer for your polling unit.";
  }
  return "No data is available for your polling unit as there’s currently no accredited observer.";
}

export function getDashboardRoutesForRole<T extends { title: string; subRoutes?: unknown[] }>(
  routes: T[],
  role: UserRole
): T[] {
  if (canUploadElectionData(role)) return routes;
  return routes.filter((route) => route.title !== "Records");
}
