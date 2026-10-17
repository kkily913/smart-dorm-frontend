import request from "@/utils/request";
import type { BuildingQueryParams, BuildingForm, BuildingItem, BuildingPageResult } from "./types";

const BUILDING_BASE_URL = "/api/v1/system/buildings";

const BuildingAPI = {
  /** 获取楼宇分页数据 */
  getPage(queryParams?: BuildingQueryParams) {
    return request<unknown, BuildingPageResult>({
      url: `${BUILDING_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },

  /** 新增楼宇 */
  create(data: BuildingForm) {
    return request({
      url: BUILDING_BASE_URL,
      method: "post",
      data,
    });
  },

  /** 修改楼宇 */
  update(id: string, data: BuildingForm) {
    return request({
      url: `${BUILDING_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /** 删除楼宇 */
  deleteById(id: string) {
    return request({
      url: `${BUILDING_BASE_URL}/${id}`,
      method: "delete",
    });
  },
};

export default BuildingAPI;

export * from "./types";
