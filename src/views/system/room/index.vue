<template>
  <div class="app-container">
    <el-card shadow="never" class="mb-4">
      <el-form :inline="true">
        <el-form-item label="所属楼宇">
          <el-select
            v-model="queryParams.buildingId"
            placeholder="请选择楼宇"
            clearable
            style="width: 180px"
          >
            <el-option
              v-for="building in buildingList"
              :key="building.id"
              :label="building.name"
              :value="building.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="房间号">
          <el-input v-model="queryParams.roomNumber" placeholder="请输入房间号" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="margin-bottom: 16px">
      <el-button v-has-perm="'biz:room:create'" type="primary" @click="handleAdd">
        新增房间
      </el-button>
    </div>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="roomList" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="所属楼宇" min-width="140">
          <template #default="{ row }">
            {{ getBuildingName(row.buildingId) }}
          </template>
        </el-table-column>
        <el-table-column prop="roomNumber" label="房间号" />
        <el-table-column prop="floorNum" label="楼层" />
        <el-table-column prop="capacity" label="床位数" />
        <el-table-column prop="occupiedCount" label="已入住" />

        <el-table-column label="房型">
          <template #default="{ row }">
            <span v-if="row.roomType === 1">四人间</span>
            <span v-else-if="row.roomType === 2">六人间</span>
            <span v-else-if="row.roomType === 3">二人间</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">正常</el-tag>
            <el-tag v-else type="danger">维修中</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button v-has-perm="'biz:room:update'" type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>

            <el-button v-has-perm="'biz:room:delete'" type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleQuery"
          @size-change="handleQuery"
        />
      </div>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑房间' : '新增房间'" width="520px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="所属楼宇">
          <el-select v-model="formData.buildingId" placeholder="请选择楼宇" style="width: 100%">
            <el-option
              v-for="building in buildingList"
              :key="building.id"
              :label="building.name"
              :value="building.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="房间号">
          <el-input v-model="formData.roomNumber" placeholder="例如 301" />
        </el-form-item>

        <el-form-item label="楼层">
          <el-input-number v-model="formData.floorNum" :min="1" />
        </el-form-item>

        <el-form-item label="床位总数">
          <el-input-number v-model="formData.capacity" :min="1" />
        </el-form-item>

        <el-form-item label="已入住人数">
          <el-input-number v-model="formData.occupiedCount" :min="0" />
        </el-form-item>

        <el-form-item label="房型">
          <el-select v-model="formData.roomType" style="width: 100%">
            <el-option label="四人间" :value="1" />
            <el-option label="六人间" :value="2" />
            <el-option label="二人间" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">维修中</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>

        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import RoomAPI, { type RoomItem, type RoomQueryParams } from "@/api/system/room";
import BuildingAPI, { type BuildingItem } from "@/api/system/building";

type BuildingOption = BuildingItem & { id: string };
const buildingList = ref<BuildingOption[]>([]);
const loading = ref(false);
const roomList = ref<RoomItem[]>([]);
const total = ref(0);
const dialogVisible = ref(false);

const editingId = ref<string>();

const formData = reactive({
  buildingId: "",
  roomNumber: "",
  floorNum: 1,
  capacity: 4,
  occupiedCount: 0,
  roomType: 1,
  status: 1,
});
const queryParams = reactive<RoomQueryParams>({
  pageNum: 1,
  pageSize: 10,
  buildingId: "",
  roomNumber: "",
});

function handleQuery() {
  loading.value = true;

  RoomAPI.getPage(queryParams)
    .then((data) => {
      roomList.value = data.records;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

function handleAdd() {
  editingId.value = undefined;

  Object.assign(formData, {
    buildingId: "",
    roomNumber: "",
    floorNum: 1,
    capacity: 4,
    occupiedCount: 0,
    roomType: 1,
    status: 1,
  });

  dialogVisible.value = true;
}

function handleEdit(row: RoomItem) {
  editingId.value = row.id;

  Object.assign(formData, {
    buildingId: row.buildingId,
    roomNumber: row.roomNumber,
    floorNum: row.floorNum,
    capacity: row.capacity,
    occupiedCount: row.occupiedCount,
    roomType: row.roomType,
    status: row.status,
  });

  dialogVisible.value = true;
}

async function handleDelete(row: RoomItem) {
  if (!row.id) return;

  try {
    await ElMessageBox.confirm(`确定要删除房间“${row.roomNumber}”吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await RoomAPI.deleteById(row.id);

    ElMessage.success("删除成功");

    handleQuery();
  } catch {
    // 点击取消时不做处理
  }
}

async function handleSubmit() {
  try {
    if (editingId.value) {
      await RoomAPI.update(editingId.value, formData);
      ElMessage.success("修改成功");
    } else {
      await RoomAPI.create(formData);
      ElMessage.success("新增成功");
    }

    dialogVisible.value = false;

    handleQuery();
  } catch (error) {
    console.error("保存房间失败", error);
  }
}

function getBuildingName(buildingId?: string) {
  const building = buildingList.value.find((item) => item.id === buildingId);

  return building?.name || "-";
}

async function loadBuildings() {
  const data = await BuildingAPI.getPage({
    pageNum: 1,
    pageSize: 100,
  });

  // 下拉项必须有有效主键；不要用非空断言把缺失 ID 传给 el-option。
  buildingList.value = data.records.filter(
    (building): building is BuildingOption =>
      typeof building.id === "string" && building.id.length > 0
  );
}

function handleReset() {
  queryParams.buildingId = "";
  queryParams.roomNumber = "";
  queryParams.pageNum = 1;

  handleQuery();
}

onMounted(() => {
  loadBuildings();
  handleQuery();
});
</script>
