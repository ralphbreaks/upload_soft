<template>
  <div class="user-management-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
        </div>
      </template>

      <el-table
        :data="userList"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="username" label="用户名" width="200" />
        <el-table-column prop="email" label="邮箱" width="250" />
        <el-table-column prop="createdAt" label="注册时间" width="200">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="上传数量" width="120">
          <template #default="{ row }">
            {{ getUserUploadCount(row.id) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="viewUserDetail(row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="userList.length === 0" class="empty-state">
        <el-empty description="暂无用户数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSoftwareStore } from '../../stores/software'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const softwareStore = useSoftwareStore()
const loading = ref(false)
const userList = ref([])

const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const getUserUploadCount = (userId) => {
  const softwares = softwareStore.getAllSoftwares()
  return softwares.filter(s => s.userId === userId).length
}

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    userList.value = users
    loading.value = false
  }, 500)
}

const viewUserDetail = (user) => {
  ElMessage.info(`用户 ${user.username} 的详细信息`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-management-container {
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.empty-state {
  padding: 40px 0;
}
</style>
