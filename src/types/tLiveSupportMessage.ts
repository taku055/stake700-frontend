import { tUser } from "./tUser";

export type SupportDeliveryStatus = "PENDING" | "SENT" | "FAILED";

export type tLiveSupportMessage = {
  id: number;
  userId: string;
  supporterId?: string | null;
  message: string;
  filepaths: string[];
  filenames: string[];
  replyId: number | null;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  isDeleted: boolean;
  deliveryStatus?: SupportDeliveryStatus;
  telegramMessageId?: number | null;
  telegramSenderId?: number | null;
  senderName?: string | null;

  /** Client-only UI status: 0 sent, 1 sending, 2 error */
  status: number;
  User?: tUser | null;
};

export function isSupportMessageFromCustomer(msg: tLiveSupportMessage): boolean {
  return !msg.supporterId && !msg.telegramSenderId;
}
