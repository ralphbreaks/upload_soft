<template>
  <div class="my-uploads-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>我的上传</span>
          <el-button type="primary" @click="goToUpload">
            <el-icon><Plus /></el-icon>
            上传新软件
          </el-button>
        </div>
      </template>

      <el-table
        :data="myUploads"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="name" label="软件名称" width="200" />
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            {{ getCategoryLabel(row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" width="100" />
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
              @click="viewDetail(row)"
            >
              查看详情
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row.id)"
              v-if="row.status === 'pending'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="myUploads.length === 0" class="empty-state">
        <el-empty description="暂无上传记录">
          <el-button type="primary" @click="goToUpload">立即上传</el-button>
        </el-empty>
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="软件详情"
      width="600px"
    >
      <div v-if="currentSoftware">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="软件名称">
            {{ currentSoftware.name }}
          </el-descriptions-item>
          <el-descriptions-item label="版本">
            {{ currentSoftware.version }}
          </el-descriptions-item>
          <el-descriptions-item label="分类">
            {{ getCategoryLabel(currentSoftware.category) }}
          </el-descriptions-item>
          <el-descriptions-item label="大小">
            {{ currentSoftware.size }}
          </el-descriptions-item>
          <el-descriptions-item label="文件名">
            {{ currentSoftware.fileName }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentSoftware.status)">
              {{ getStatusLabel(currentSoftware.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上传时间" :span="2">
            {{ formatTime(currentSoftware.uploadTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="软件简介" :span="2">
            {{ currentSoftware.description }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="currentSoftware.reviewTime"
            label="审核时间"
            :span="2"
          >
            {{ formatTime(currentSoftware.reviewTime) }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="currentSoftware.reviewComment"
            label="审核意见"
            :span="2"
          >
            <el-alert
              :type="currentSoftware.status === 'approved' ? 'success' : 'error'"
              :closable="false"
            >
              {{ currentSoftware.reviewComment }}
            </el-alert>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSoftwareStore } from '../../stores/software'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const softwareStore = useSoftwareStore()
const loading = ref(false)
const myUploads = ref([])
const detailDialogVisible = ref(false)
const currentSoftware = ref(null)

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
    myUploads.value = softwareStore.getUserSoftwares()
    loading.value = false
  }, 500)
}

const viewDetail = (software) => {
  currentSoftware.value = software
  detailDialogVisible.value = true
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

const goToUpload = () => {
  router.push('/user/upload')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.my-uploads-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.empty-state {
  padding: 40px 0;
}
</style>
