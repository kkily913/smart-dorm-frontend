/**
 * 楼宇管理类型定义
 */

import type { BaseQueryParams } from "@/api/common";

/** 楼宇分页查询参数 */
export interface BuildingQueryParams extends BaseQueryParams {
  /** 楼宇名称 */
  name?: string;
}

/** 楼宇表单对象 */
export interface BuildingForm {
  /** 楼宇ID */
  id?: string;

  /** 楼宇名称 */
  name?: string;

  /** 楼宇编码 */
  code?: string;

  /** 性别限制：0不限 1男 2女 */
  genderLimit?: number;

  /** 总楼层数 */
  floorCount?: number;

  /** 负责宿管ID */
  managerId?: string;

  /** 状态：0停用 1正常 */
  status?: number;

  /** 备注 */
  remark?: string;
}

/** 楼宇列表对象 */
export interface BuildingItem {
  id?: string;
  name?: string;
  code?: string;
  genderLimit?: number;
  floorCount?: number;
  managerId?: string;
  status?: number;
  remark?: string;
  createTime?: string;
  updateTime?: string;
}
/** 楼宇分页响应 */
export interface BuildingPageResult {
  current: number;
  pages: number;
  records: BuildingItem[];
  size: number;
  total: number;
}
