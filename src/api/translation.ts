/* eslint-disable @typescript-eslint/no-explicit-any */
import AxiosInstance from "./axiosInstance";

const TranslationsAPI = {
  getTranslationHistory: (user_id: string) => {
    return AxiosInstance.get(`/translate/translate-history/${user_id}`);
  },

  getTranslationStatus: (file_id: string) => {
    return AxiosInstance.get(`/translate/translate-status/${file_id}`);
  },

  UploadTranslate: (payload: any) => {
    return AxiosInstance.post(`/translate/upload-translate`, payload);
  },

  ReTranslate: (file_id: string) => {
    return AxiosInstance.post(`/translate/retranslate/${file_id}`);
  },

  deleteTranslation: (file_id: string) => {
    return AxiosInstance.delete(`/translate/delete-translation/${file_id}`);
  },

  DownloadWord: (file_id: string) => {
    return AxiosInstance.post(`/translate/convert-pdf-to-doc/${file_id}`);
  },

  Feedback: (payload: any, file_id: string) => {
    return AxiosInstance.put(`/translate/update-feedback/${file_id}`, payload);
  },
};

export default TranslationsAPI;