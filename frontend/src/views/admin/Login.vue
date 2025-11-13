<template>
  <div class="admin-login-container">
    <div class="login-box">
      <h2 class="login-title">软件上传系统</h2>
      <p class="login-subtitle">管理员登录</p>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入管理员账号"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>

        <div class="login-footer">
          <el-link type="info" @click="goToUserLogin">返回用户登录</el-link>
        </div>

        <el-alert
          title="测试账号"
          type="info"
          :closable="false"
          class="test-info"
        >
          <p>账号：admin</p>
          <p>密码：admin123</p>
        </el-alert>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      setTimeout(() => {
        const result = userStore.login({
          username: loginForm.username,
          password: loginForm.password,
          isAdminLogin: true
        })

        loading.value = false

        if (result.success) {
          ElMessage.success(result.message)
          router.push('/admin/review')
        } else {
          ElMessage.error(result.message)
        }
      }, 500)
    }
  })
}

const goToUserLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-title {
  margin: 0 0 10px 0;
  text-align: center;
  font-size: 28px;
  color: #333;
}

.login-subtitle {
  margin: 0 0 30px 0;
  text-align: center;
  font-size: 16px;
  color: #666;
}

.login-form {
  margin-top: 30px;
}

.login-button {
  width: 100%;
}

.login-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.test-info {
  margin-top: 20px;
}

.test-info p {
  margin: 5px 0;
  font-size: 14px;
}
</style>
