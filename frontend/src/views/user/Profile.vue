<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="profile-card">
          <template #header>
            <div class="card-header">个人信息</div>
          </template>
          <div class="user-avatar">
            <el-avatar :size="100" :icon="UserFilled" />
          </div>
          <div class="user-info">
            <h3>{{ userStore.username }}</h3>
            <p class="user-email">{{ userStore.email }}</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card class="stats-card">
          <template #header>
            <div class="card-header">上传统计</div>
          </template>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-icon total">
                  <el-icon :size="30"><Box /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.total }}</div>
                  <div class="stat-label">总上传数</div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-icon pending">
                  <el-icon :size="30"><Clock /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.pending }}</div>
                  <div class="stat-label">待审核</div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-icon approved">
                  <el-icon :size="30"><Select /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ stats.approved }}</div>
                  <div class="stat-label">已通过</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <el-card class="info-edit-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">修改信息</div>
          </template>
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="profileForm.username" disabled />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleUpdateInfo">
                保存修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { useSoftwareStore } from '../../stores/software'
import { ElMessage } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'

const userStore = useUserStore()
const softwareStore = useSoftwareStore()
const profileFormRef = ref(null)

const stats = ref({
  total: 0,
  pending: 0,
  approved: 0
})

const profileForm = reactive({
  username: '',
  email: ''
})

const profileRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const loadStats = () => {
  const userSoftwares = softwareStore.getUserSoftwares()
  stats.value = {
    total: userSoftwares.length,
    pending: userSoftwares.filter(s => s.status === 'pending').length,
    approved: userSoftwares.filter(s => s.status === 'approved').length
  }
}

const handleUpdateInfo = async () => {
  if (!profileFormRef.value) return

  await profileFormRef.value.validate((valid) => {
    if (valid) {
      userStore.updateUserInfo({
        email: profileForm.email
      })
      ElMessage.success('信息修改成功')
    }
  })
}

onMounted(() => {
  profileForm.username = userStore.username
  profileForm.email = userStore.email
  loadStats()
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.profile-card {
  text-align: center;
}

.user-avatar {
  margin: 20px 0;
}

.user-info h3 {
  margin: 10px 0;
  font-size: 20px;
  color: #333;
}

.user-email {
  color: #666;
  font-size: 14px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-right: 15px;
  color: #fff;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.approved {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}
</style>
