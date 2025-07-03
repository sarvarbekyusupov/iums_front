import { apiConfig } from "@api/config";
import { ApiUrls } from "@api/api-urls";
import type { Groups } from "../types/groups";



export const groupService = {
    async getGroups() {
      const res = await apiConfig().getRequest(ApiUrls.GROUPS);
      return res.data.data; 
    },
  
    async createGroups(model: Groups) {
      const res = await apiConfig().postRequest(ApiUrls.GROUPS, model);
      return res;
    }
  };
  

