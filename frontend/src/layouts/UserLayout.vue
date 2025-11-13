<template>
  <el-container class="user-layout">
    <el-header class="header">
      <div class="header-content">
        <h2 class="logo">软件上传系统</h2>
        <el-menu
          mode="horizontal"
          :default-active="activeMenu"
          router
          class="nav-menu"
        >
          <el-menu-item index="/user/upload">上传软件</el-menu-item>
          <el-menu-item index="/user/my-uploads">我的上传</el-menu-item>
          <el-menu-item index="/user/profile">个人中心</el-menu-item>
        </el-menu>
        <div class="user-info">
          <el-dropdown>
            <span class="user-name">
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
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/login')
}
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.logo {
  margin: 0;
  margin-right: 50px;
  font-size: 20px;
  color: #409eff;
  white-space: nowrap;
}

.nav-menu {
  flex: 1;
  border: none;
}

.user-info {
  margin-left: 20px;
}

.user-name {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606266;
}

.user-name:hover {
  color: #409eff;
}

.main-content {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
</style>
