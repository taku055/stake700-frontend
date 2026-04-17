import { instance } from "../instance";

interface SubmitIdCardParams {
  userId: string;
  frontImage: File;
  backImage: File;
  phoneNumber: string;
}

export const apiSubmitIdCard = async ({userId, frontImage, backImage, phoneNumber}: SubmitIdCardParams) => {
  try{
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("frontImage", frontImage);
    formData.append("backImage", backImage);
    formData.append("phoneNumber", phoneNumber);

    const res = await instance.post('/id-card/upload', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res) {
      return res.data;
    }
    throw new Error("Failed to submit ID card");
  }catch(error){
    console.log("Error submitting id card: ", error);
    throw error;
  }
}