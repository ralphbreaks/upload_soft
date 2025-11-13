<template>
  <div class="review-detail-container">
    <el-card v-if="software">
      <template #header>
        <div class="card-header">
          <span>软件详情</span>
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </template>

      <!-- 软件基本信息 -->
      <el-descriptions title="基本信息" :column="2" border>
        <el-descriptions-item label="软件名称">
          {{ software.name }}
        </el-descriptions-item>
        <el-descriptions-item label="版本">
          {{ software.version }}
        </el-descriptions-item>
        <el-descriptions-item label="分类">
          {{ getCategoryLabel(software.category) }}
        </el-descriptions-item>
        <el-descriptions-item label="大小">
          {{ software.size }}
        </el-descriptions-item>
        <el-descriptions-item label="文件名">
          {{ software.fileName }}
        </el-descriptions-item>
        <el-descriptions-item label="上传者">
          {{ software.username }}
        </el-descriptions-item>
        <el-descriptions-item label="上传时间" :span="2">
          {{ formatTime(software.uploadTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(software.status)">
            {{ getStatusLabel(software.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="截图数量">
          {{ software.screenshotCount || 0 }} 张
        </el-descriptions-item>
        <el-descriptions-item label="软件简介" :span="2">
          {{ software.description }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 审核历史 -->
      <div v-if="software.reviewTime" class="review-history">
        <h3>审核记录</h3>
        <el-alert
          :type="software.status === 'approved' ? 'success' : 'error'"
          :closable="false"
        >
          <p><strong>审核时间：</strong>{{ formatTime(software.reviewTime) }}</p>
          <p><strong>审核结果：</strong>{{ getStatusLabel(software.status) }}</p>
          <p v-if="software.reviewComment">
            <strong>审核意见：</strong>{{ software.reviewComment }}
          </p>
        </el-alert>
      </div>

      <!-- 审核操作 -->
      <div v-if="software.status === 'pending'" class="review-actions">
        <h3>审核操作</h3>
        <el-form
          ref="reviewFormRef"
          :model="reviewForm"
          label-width="100px"
          class="review-form"
        >
          <el-form-item label="审核结果" prop="status">
            <el-radio-group v-model="reviewForm.status">
              <el-radio label="approved">通过</el-radio>
              <el-radio label="rejected">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="comment">
            <el-input
              v-model="reviewForm.comment"
              type="textarea"
              :rows="4"
              placeholder="请输入审核意见（选填）"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="submitting"
              @click="handleSubmitReview"
            >
              提交审核
            </el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 已审核提示 -->
      <div v-else class="reviewed-tip">
        <el-alert
          title="该软件已完成审核"
          type="info"
          :closable="false"
          show-icon
        />
      </div>
    </el-card>

    <el-card v-else>
      <el-empty description="软件不存在" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSoftwareStore } from '../../stores/software'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()
const softwareStore = useSoftwareStore()
const reviewFormRef = ref(null)
const submitting = ref(false)
const software = ref(null)

const reviewForm = reactive({
  status: 'approved',
  comment: ''
})

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
  const id = route.params.id
  software.value = softwareStore.getSoftwareById(id)
}

const handleSubmitReview = async () => {
  if (!reviewFormRef.value) return

  await reviewFormRef.value.validate((valid) => {
    if (valid) {
      submitting.value = true

      setTimeout(() => {
        const result = softwareStore.reviewSoftware(
          software.value.id,
          reviewForm.status,
          reviewForm.comment
        )

        submitting.value = false

        if (result.success) {
          ElMessage.success(result.message)
          setTimeout(() => {
            goBack()
          }, 1000)
        } else {
          ElMessage.error(result.message)
        }
      }, 500)
    }
  })
}

const goBack = () => {
  router.push('/admin/review')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.review-detail-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.review-history {
  margin-top: 30px;
}

.review-history h3 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}

.review-history p {
  margin: 8px 0;
}

.review-actions {
  margin-top: 30px;
}

.review-actions h3 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}

.review-form {
  max-width: 600px;
}

.reviewed-tip {
  margin-top: 30px;
}
</style>
