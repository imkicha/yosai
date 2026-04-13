import Notification from "../models/Notification.js";

export const createNotification = async ({ userId, title, message, type, referenceId, referenceModel }) => {
  return Notification.create({ userId, title, message, type, referenceId, referenceModel });
};
