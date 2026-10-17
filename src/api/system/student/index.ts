import request from "@/utils/request";
import type { StudentQueryParams, StudentForm, StudentPageResult } from "./types";

const STUDENT_BASE_URL = "/api/v1/system/students";

const StudentAPI = {
  getPage(queryParams?: StudentQueryParams) {
    return request<unknown, StudentPageResult>({
      url: STUDENT_BASE_URL,
      method: "get",
      params: queryParams,
    });
  },

  create(data: StudentForm) {
    return request({
      url: STUDENT_BASE_URL,
      method: "post",
      data,
    });
  },

  update(id: string, data: StudentForm) {
    return request({
      url: `${STUDENT_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  deleteById(id: string) {
    return request({
      url: `${STUDENT_BASE_URL}/${id}`,
      method: "delete",
    });
  },
};

export default StudentAPI;

export * from "./types";
