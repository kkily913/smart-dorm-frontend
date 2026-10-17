<template>
  <div class="app-container">
    <!-- 查询区域 -->
    <el-card shadow="never" class="mb-4">
      <el-form :inline="true">
        <el-form-item label="楼宇名称">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入楼宇名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 16px">
        <el-button v-has-perm="'biz:building:create'" type="primary" @click="handleAdd">
          新增楼宇
        </el-button>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="buildingList" border>
        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column prop="name" label="楼宇名称" min-width="140" />

        <el-table-column prop="code" label="楼宇编码" min-width="120" />

        <el-table-column prop="floorCount" label="楼层数" width="100" />

        <el-table-column label="性别限制" width="120">
          <template #default="{ row }">
            <span v-if="row.genderLimit === 1">男</span>
            <span v-else-if="row.genderLimit === 2">女</span>
            <span v-else>不限</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">正常</el-tag>

            <el-tag v-else type="danger">停用</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="150" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-perm="'biz:building:update'"
              type="primary"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-perm="'biz:building:update'"
              type="primary"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>

            <el-button
              v-has-perm="'biz:building:delete'"
              type="danger"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑楼宇' : '新增楼宇'" width="500px">
      <el-form :model="formData" label-width="90px">
        <el-form-item label="楼宇名称">
          <el-input v-model="formData.name" placeholder="请输入楼宇名称" />
        </el-form-item>

        <el-form-item label="楼宇编码">
          <el-input v-model="formData.code" placeholder="例如 N-02" />
        </el-form-item>

        <el-form-item label="楼层数">
          <el-input-number v-model="formData.floorCount" :min="1" />
        </el-form-item>

        <el-form-item label="性别限制">
          <el-select v-model="formData.genderLimit">
            <el-option label="不限" :value="0" />
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" />
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
import { onMounted, reactive, ref } from "vue";
import BuildingAPI, { type BuildingItem, type BuildingQueryParams } from "@/api/system/building";
import { ElMessage, ElMessageBox } from "element-plus";
const loading = ref(false);

const buildingList = ref<BuildingItem[]>([]);

const total = ref(0);
const dialogVisible = ref(false);
const editingId = ref<string>();

const formData = reactive({
  name: "",
  code: "",
  genderLimit: 0,
  floorCount: 1,
  status: 1,
  remark: "",
});

const queryParams = reactive<BuildingQueryParams>({
  pageNum: 1,
  pageSize: 10,
  name: "",
});

/**
 * 查询楼宇列表
 */
function handleQuery() {
  loading.value = true;

  BuildingAPI.getPage(queryParams)
    .then((data) => {
      buildingList.value = data.records;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

function handleAdd() {
  editingId.value = undefined;
  Object.assign(formData, {
    name: "",
    code: "",
    genderLimit: 0,
    floorCount: 1,
    status: 1,
    remark: "",
  });

  dialogVisible.value = true;
}
function handleEdit(row: BuildingItem) {
  editingId.value = row.id;

  Object.assign(formData, {
    name: row.name,
    code: row.code,
    genderLimit: row.genderLimit,
    floorCount: row.floorCount,
    managerId: row.managerId,
    status: row.status,
    remark: row.remark,
  });

  dialogVisible.value = true;
}
async function handleDelete(row: BuildingItem) {
  try {
    await ElMessageBox.confirm(`确定要删除楼宇“${row.name}”吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    if (!row.id) return;

    await BuildingAPI.deleteById(row.id);

    ElMessage.success("删除成功");

    handleQuery();
  } catch {
    // 用户取消删除，不做处理
  }
}

async function handleSubmit() {
  try {
    if (editingId.value) {
      await BuildingAPI.update(editingId.value, formData);
      ElMessage.success("修改成功");
    } else {
      await BuildingAPI.create(formData);
      ElMessage.success("新增成功");
    }

    dialogVisible.value = false;

    handleQuery();
  } catch (error) {
    console.error("保存楼宇失败", error);
  }
}
/**
 * 重置查询
 */
function handleReset() {
  queryParams.name = "";
  queryParams.pageNum = 1;
  handleQuery();
}

onMounted(() => {
  handleQuery();
});
</script>
