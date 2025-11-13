<template>
  <div class="review-list-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>待审核软件列表</span>
        </div>
      </template>

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <div class="stat-card total">
            <el-icon :size="30"><Box /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.total }}</div>
              <div class="stat-label">全部软件</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card pending">
            <el-icon :size="30"><Clock /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.pending }}</div>
              <div class="stat-label">待审核</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card approved">
            <el-icon :size="30"><Select /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.approved }}</div>
              <div class="stat-label">已通过</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card rejected">
            <el-icon :size="30"><CloseBold /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.rejected }}</div>
              <div class="stat-label">已拒绝</div>
            </div>
          </div>
        </el-col>
      </el-row>

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
        <el-form-item label="分类">
          <el-select v-model="filterCategory" placeholder="全部" @change="handleFilter">
            <el-option label="全部" value="" />
            <el-option label="系统工具" value="system" />
            <el-option label="办公软件" value="office" />
            <el-option label="图形图像" value="graphics" />
            <el-option label="网络工具" value="network" />
            <el-option label="多媒体" value="media" />
            <el-option label="开发工具" value="development" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 软件列表 -->
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
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="goToReview(row.id)"
            >
              {{ row.status === 'pending' ? '立即审核' : '查看详情' }}
            </el-button>
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
        <el-empty description="暂无数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSoftwareStore } from '../../stores/software'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const softwareStore = useSoftwareStore()
const loading = ref(false)
const allSoftwares = ref([])
const filterStatus = ref('')
const filterCategory = ref('')

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

const statistics = computed(() => softwareStore.getStatistics())

const filteredList = computed(() => {
  let list = allSoftwares.value

  if (filterStatus.value) {
    list = list.filter(s => s.status === filterStatus.value)
  }

  if (filterCategory.value) {
    list = list.filter(s => s.category === filterCategory.value)
  }

  return list
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

const goToReview = (id) => {
  router.push(`/admin/review/${id}`)
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
.review-list-container {
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  color: #fff;
}

.stat-card.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.pending {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.approved {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card.rejected {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-info {
  margin-left: 15px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}

.stat-label {
  font-size: 14px;
  margin-top: 5px;
  opacity: 0.9;
}

.filter-form {
  margin-bottom: 20px;
}

.empty-state {
  padding: 40px 0;
}
</style>
