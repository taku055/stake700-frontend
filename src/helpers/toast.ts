import { addToast } from "@heroui/toast";

export const toast = {
  error: (message: string) => {
    addToast({
      title: "Error",
      description: message,
      color: "danger",
    });
  },
  info: (message: string) => {
    addToast({
      description: message,
      color: "primary",
    });
  },
  success: (message: string) => {
    addToast({
      description: message,
      color: "success",
    });
  },
};
