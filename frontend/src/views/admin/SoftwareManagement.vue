<template>
  <div class="software-management-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>软件管理</span>
        </div>
      </template>

      <!-- 筛选器 -->
      <el-form :inline="true" class="filter-form">
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部" @change="handleFilter">
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
      </el-form>

      <el-table
        :data="filteredList"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="name" label="软件名称" width="180" />
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            {{ getCategoryLabel(row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="上传者" width="120" />
        <el-table-column prop="uploadTime" label="上传时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.uploadTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="filteredList.length === 0" class="empty-state">
        <el-empty description="暂无软件数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSoftwareStore } from '../../stores/software'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const softwareStore = useSoftwareStore()
const loading = ref(false)
const allSoftwares = ref([])
const filterStatus = ref('')

const categoryMap = {
  system: '系统工具',
  office: '办公软件',
  graphics: '图形图像',
  network: '网络工具',
  media: '多媒体',
  development: '开发工具',
  other: '其他'
}

const statusMap = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝'
}

const filteredList = computed(() => {
  if (!filterStatus.value) {
    return allSoftwares.value
  }
  return allSoftwares.value.filter(s => s.status === filterStatus.value)
})

const getCategoryLabel = (category) => {
  return categoryMap[category] || category
}

const getStatusLabel = (status) => {
  return statusMap[status] || status
}

const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    allSoftwares.value = softwareStore.getAllSoftwares()
    loading.value = false
  }, 500)
}

const handleFilter = () => {
  // 筛选逻辑已经通过 computed 实现
}

const handleDelete = (id) => {
  ElMessageBox.confirm(
    '确定要删除这个软件吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const result = softwareStore.deleteSoftware(id)
    if (result.success) {
      ElMessage.success(result.message)
      loadData()
    } else {
      ElMessage.error(result.message)
    }
  }).catch(() => {
    // 用户取消删除
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.software-management-container {
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.filter-form {
  margin-bottom: 20px;
}

.empty-state {
  padding: 40px 0;
}
</style>
