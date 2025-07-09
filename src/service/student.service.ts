import { apiConfig } from "@api/config";
import { ApiUrls } from "@api/api-urls";
import { type StudentsType } from "@types";

export const studentService = {
  async getStudents() {
    const res = await apiConfig().getRequest(ApiUrls.STUDENTS);
    return res!.data.students;
  },

  async createStudent(model: StudentsType) {
    const res = await apiConfig().postRequest(ApiUrls.STUDENTS, model);
    return res;
  },

  async deleteStudent(id: number) {
    const res = await apiConfig().deleteRequest(`${ApiUrls.STUDENTS}/${id}`);
    return res;
  },

  async updateStudent(id: number, model: StudentsType) {
    const res = await apiConfig().patchRequest(
      `${ApiUrls.STUDENTS}/${id}`,
      model
    );
    return res;
  },
};
