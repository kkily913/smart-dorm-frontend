import type { BaseQueryParams } from "@/api/common";

export interface RoomQueryParams extends BaseQueryParams {
  buildingId?: string;
  roomNumber?: string;
}

export interface RoomForm {
  id?: string;
  buildingId?: string;
  roomNumber?: string;
  floorNum?: number;
  capacity?: number;
  occupiedCount?: number;
  roomType?: number;
  status?: number;
}

export interface RoomItem {
  id?: string;
  buildingId?: string;
  roomNumber?: string;
  floorNum?: number;
  capacity?: number;
  occupiedCount?: number;
  roomType?: number;
  status?: number;
  createTime?: string;
  updateTime?: string;
  isDeleted?: number;
}

export interface RoomPageResult {
  current: number;
  pages: number;
  records: RoomItem[];
  size: number;
  total: number;
}
