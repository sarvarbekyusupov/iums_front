import axiosInstance from ".";
import { Notification } from "../helpers/notification";

export function apiConfig() {
  async function getRequest(url: string, params: object = {}) {
    try {
      const res = await axiosInstance.get(url, { params });
      Notification("success", res.data.message);
      return res;
    } catch (error) {
      Notification("error", (error as any)?.message || "Something went wrong");
    }
  }

  async function postRequest(url: string, body: object = {}) {
    try {
      const res = await axiosInstance.post(url, body);
      Notification("success", res.data.message);
      return res;
    } catch (error) {
      Notification("error", (error as any)?.message || "Something went wrong");
    }
  }

  async function putRequest(url: string, body: object = {}) {
    try {
      const res = await axiosInstance.put(url, body);
      Notification("success", res.data.message);
      return res;
    } catch (error) {
      Notification("error", (error as any)?.message || "Something went wrong");
    }
  }

  async function patchRequest(url: string, body: object = {}) {
    try {
      const res = await axiosInstance.patch(url, body);
      Notification("success", res.data.message);
      return res;
    } catch (error) {
      Notification("error", (error as any)?.message || "Something went wrong");
    }
  }

  async function deleteRequest(url: string, params: object = {}) {
    try {
      const res = await axiosInstance.delete(url, params);
      Notification("success", res.data.message);
      return res;
    } catch (error) {
      Notification("error", (error as any)?.message || "Something went wrong");
    }
  }

  return {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    patchRequest
  };
}
