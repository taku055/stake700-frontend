import { instance } from "../instance";

export enum IdCardStatus {
  APPROVED = "APPROVED",
  UNDER_REVIEW = "UNDER_REVIEW",
  NO_ID = "NO_ID",
  REJECTED = "REJECTED",
}

export const apiGetIdCardStatus = async (userId: string) => {
  try {
    const response = await instance.get(`/id-card/${userId}/id-card-status`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ID card status:", error);
    throw error;
  }
};
