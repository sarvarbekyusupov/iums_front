import { apiConfig } from "@api/config";
import { ApiUrls } from "@api/api-urls";
import { type GroupsType } from "@types";



export const groupService = {
  async getGroups() {
    const res = await apiConfig().getRequest(ApiUrls.GROUPS);
    return res?.data.data;
    console.log("res", res);
    console.log("data", res!.data);
    
  },

  async createGroups(model: GroupsType) {
    const res = await apiConfig().postRequest(ApiUrls.GROUPS, model);
    return res;
  },

  async deleteGroup(id: number) {
    const res = await apiConfig().deleteRequest(`${ApiUrls.GROUPS}/${id}`);
    return res;
  },

  async updateGroup(id: number, model:GroupsType) {
    const res = await apiConfig().patchRequest(`${ApiUrls.GROUPS}/${id}`, model);
    return res;
  },
};
  

