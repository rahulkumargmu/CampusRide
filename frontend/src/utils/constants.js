export const API_BASE = "/api";
export const WS_BASE = `ws://${window.location.host}/ws`;

export const ROLES = {
  ADMIN: "admin",
  DRIVER: "driver",
  RIDER: "rider",
};

export const RIDE_STATUS = {
  PENDING: "pending",
  OFFERED: "offered",
  ACCEPTED: "accepted",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const TIME_TYPES = {
  IMMEDIATE: "immediate",
  SPECIFIC: "specific",
  RANGE: "range",
};
