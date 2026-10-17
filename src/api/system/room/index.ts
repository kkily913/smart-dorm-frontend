import request from "@/utils/request";
import type { RoomQueryParams, RoomForm, RoomPageResult } from "./types";

const ROOM_BASE_URL = "/api/v1/system/rooms";

const RoomAPI = {
  getPage(queryParams?: RoomQueryParams) {
    return request<unknown, RoomPageResult>({
      url: `${ROOM_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },

  create(data: RoomForm) {
    return request({
      url: ROOM_BASE_URL,
      method: "post",
      data,
    });
  },

  update(id: string, data: RoomForm) {
    return request({
      url: `${ROOM_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  deleteById(id: string) {
    return request({
      url: `${ROOM_BASE_URL}/${id}`,
      method: "delete",
    });
  },
};

export default RoomAPI;

export * from "./types";
