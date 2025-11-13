<template>
  <el-container class="admin-layout">
    <el-aside width="200px" class="sidebar">
      <div class="logo-container">
        <h3>管理后台</h3>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        class="sidebar-menu"
      >
        <el-menu-item index="/admin/review">
          <el-icon><DocumentChecked /></el-icon>
          <span>审核管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/softwares">
          <el-icon><Box /></el-icon>
          <span>软件管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><UserFilled /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <h2 class="page-title">{{ pageTitle }}</h2>
          <div class="user-info">
            <el-dropdown>
              <span class="admin-name">
                <el-icon><User /></el-icon>
                {{ userStore.username }}
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/admin/review')) return '/admin/review'
  return path
})

const pageTitle = computed(() => {
  const titleMap = {
    '/admin/review': '审核管理',
    '/admin/softwares': '软件管理',
    '/admin/users': '用户管理'
  }
  return titleMap[activeMenu.value] || '管理后台'
})

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.sidebar {
  background-color: #001529;
  color: #fff;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #002140;
}

.logo-container h3 {
  margin: 0;
  color: #fff;
  font-size: 18px;
}

.sidebar-menu {
  border: none;
  background-color: #001529;
}

.sidebar-menu .el-menu-item {
  color: rgba(255, 255, 255, 0.85);
}

.sidebar-menu .el-menu-item:hover {
  background-color: #1890ff;
  color: #fff;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #1890ff;
  color: #fff;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.page-title {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.admin-name {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606266;
}

.admin-name:hover {
  color: #409eff;
}

.main-content {
  background-color: #f5f5f5;
  padding: 20px;
}
</style>
