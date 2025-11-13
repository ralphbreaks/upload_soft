import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value.username || '')
  const email = computed(() => userInfo.value.email || '')

  // 登录方法
  function login(loginData) {
    // 模拟登录逻辑（因为没有后端）
    const { username: user, password, isAdminLogin = false } = loginData

    // 简单的模拟验证
    if (isAdminLogin) {
      // 管理员登录（用户名：admin，密码：admin123）
      if (user === 'admin' && password === 'admin123') {
        const adminToken = 'admin_token_' + Date.now()
        const adminInfo = {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin'
        }

        token.value = adminToken
        userInfo.value = adminInfo
        isAdmin.value = true

        localStorage.setItem('token', adminToken)
        localStorage.setItem('userInfo', JSON.stringify(adminInfo))
        localStorage.setItem('isAdmin', 'true')

        return { success: true, message: '管理员登录成功' }
      } else {
        return { success: false, message: '管理员用户名或密码错误' }
      }
    } else {
      // 普通用户登录
      // 从 localStorage 获取已注册用户
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const foundUser = users.find(u => u.username === user && u.password === password)

      if (foundUser) {
        const userToken = 'user_token_' + Date.now()
        const userDetails = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          role: 'user'
        }

        token.value = userToken
        userInfo.value = userDetails
        isAdmin.value = false

        localStorage.setItem('token', userToken)
        localStorage.setItem('userInfo', JSON.stringify(userDetails))
        localStorage.setItem('isAdmin', 'false')

        return { success: true, message: '登录成功' }
      } else {
        return { success: false, message: '用户名或密码错误' }
      }
    }
  }

  // 注册方法
  function register(registerData) {
    const { username: user, email: userEmail, password } = registerData

    // 获取已注册用户
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')

    // 检查用户名是否已存在
    if (users.some(u => u.username === user)) {
      return { success: false, message: '用户名已存在' }
    }

    // 检查邮箱是否已存在
    if (users.some(u => u.email === userEmail)) {
      return { success: false, message: '邮箱已被注册' }
    }

    // 创建新用户
    const newUser = {
      id: Date.now(),
      username: user,
      email: userEmail,
      password: password,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(users))

    return { success: true, message: '注册成功，请登录' }
  }

  // 退出登录
  function logout() {
    token.value = ''
    userInfo.value = {}
    isAdmin.value = false

    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('isAdmin')
  }

  // 更新用户信息
  function updateUserInfo(newInfo) {
    userInfo.value = { ...userInfo.value, ...newInfo }
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  return {
    token,
    userInfo,
    isAdmin,
    isLoggedIn,
    username,
    email,
    login,
    register,
    logout,
    updateUserInfo
  }
})
