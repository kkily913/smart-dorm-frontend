import type { BaseQueryParams } from "@/api/common";

export interface StudentQueryParams extends BaseQueryParams {
  studentNo?: string;
  name?: string;
}

export interface StudentForm {
  id?: string;
  studentNo?: string;
  name?: string;
  gender?: number;
  college?: string;
  major?: string;
  phone?: string;
  idCard?: string;
  status?: number;
}

export interface StudentItem {
  id?: string;
  studentNo?: string;
  name?: string;
  gender?: number;
  college?: string;
  major?: string;
  phone?: string;
  idCard?: string;
  status?: number;
  createTime?: string;
  updateTime?: string;
  isDeleted?: number;
}

export interface StudentPageResult {
  list: StudentItem[];
  total: number;
}
