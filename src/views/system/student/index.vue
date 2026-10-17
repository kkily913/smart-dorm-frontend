<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="学号">
          <el-input v-model="queryParams.studentNo" placeholder="请输入学号" clearable />
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
        <el-button
          v-has-perm="'biz:student:create'"
          type="primary"
          style="margin-bottom: 16px"
          @click="handleAdd"
        >
          新增学生
        </el-button>
      </el-form>

      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column prop="studentNo" label="学号" min-width="120" />
        <el-table-column prop="name" label="姓名" min-width="100" />

        <el-table-column label="性别" width="80">
          <template #default="{ row }">
            {{ row.gender === 1 ? "男" : row.gender === 2 ? "女" : "-" }}
          </template>
        </el-table-column>

        <el-table-column prop="college" label="学院" min-width="140" />
        <el-table-column prop="major" label="专业" min-width="140" />
        <el-table-column prop="phone" label="联系电话" min-width="130" />

        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? "在校" : "离校" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" min-width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              v-has-perm="'biz:student:update'"
              link
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>

            <el-button
              v-has-perm="'biz:student:delete'"
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 16px; display: flex; justify-content: flex-end">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
      <el-dialog v-model="dialogVisible" :title="editingId ? '编辑学生' : '新增学生'" width="500px">
        <el-form :model="formData" label-width="80px">
          <el-form-item label="学号">
            <el-input v-model="formData.studentNo" />
          </el-form-item>

          <el-form-item label="姓名">
            <el-input v-model="formData.name" />
          </el-form-item>

          <el-form-item label="性别">
            <el-select v-model="formData.gender" placeholder="请选择性别">
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="学院">
            <el-input v-model="formData.college" />
          </el-form-item>

          <el-form-item label="专业">
            <el-input v-model="formData.major" />
          </el-form-item>

          <el-form-item label="联系电话">
            <el-input v-model="formData.phone" />
          </el-form-item>

          <el-form-item label="身份证号">
            <el-input v-model="formData.idCard" />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="formData.status">
              <el-option label="在校" :value="1" />
              <el-option label="离校" :value="0" />
            </el-select>
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import StudentAPI, {
  type StudentForm,
  type StudentItem,
  type StudentQueryParams,
} from "@/api/system/student";

const dialogVisible = ref(false);

const editingId = ref<string | null>(null);

const formData = reactive<StudentForm>({
  studentNo: "",
  name: "",
  gender: 1,
  college: "",
  major: "",
  phone: "",
  idCard: "",
  status: 1,
});
const loading = ref(false);
const tableData = ref<StudentItem[]>([]);
const total = ref(0);

const queryParams = reactive<StudentQueryParams>({
  pageNum: 1,
  pageSize: 10,
  studentNo: "",
  name: "",
});

const handleAdd = () => {
  editingId.value = null;

  formData.studentNo = "";
  formData.name = "";
  formData.gender = 1;
  formData.college = "";
  formData.major = "";
  formData.phone = "";
  formData.idCard = "";
  formData.status = 1;

  dialogVisible.value = true;
};

const handleEdit = (row: StudentItem) => {
  editingId.value = null;
  editingId.value = row.id ?? null;

  formData.studentNo = row.studentNo;
  formData.name = row.name;
  formData.gender = row.gender;
  formData.college = row.college;
  formData.major = row.major;
  formData.phone = row.phone;
  formData.idCard = row.idCard;
  formData.status = row.status;

  dialogVisible.value = true;
};

const handleSubmit = async () => {
  if (editingId.value) {
    await StudentAPI.update(editingId.value, formData);
    ElMessage.success("修改成功");
  } else {
    await StudentAPI.create(formData);
    ElMessage.success("新增成功");
  }

  dialogVisible.value = false;
  await loadData();
};

const loadData = async () => {
  loading.value = true;

  try {
    const data = await StudentAPI.getPage(queryParams);
    tableData.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  queryParams.pageNum = 1;
  loadData();
};

const handleReset = () => {
  queryParams.studentNo = "";
  queryParams.name = "";
  queryParams.pageNum = 1;
  loadData();
};

const handlePageChange = (page: number) => {
  queryParams.pageNum = page;
  loadData();
};

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  loadData();
};

const handleDelete = async (row: StudentItem) => {
  if (!row.id) {
    return;
  }

  await ElMessageBox.confirm(`确定要删除学生“${row.name}”吗？`, "提示", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  });

  await StudentAPI.deleteById(row.id);

  ElMessage.success("删除成功");

  await loadData();
};

onMounted(() => {
  loadData();
});
</script>
