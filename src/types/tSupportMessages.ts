export type tSupportMessage = {
  id: string;
  message: string;
  type: "AI" | "USER" | "TOPIC";
  createdAt: Date;
};