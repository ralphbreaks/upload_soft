import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'

export const useSoftwareStore = defineStore('software', () => {
  const softwares = ref([])

  // 获取所有软件列表
  function getAllSoftwares() {
    const storedSoftwares = localStorage.getItem('softwares')
    if (storedSoftwares) {
      softwares.value = JSON.parse(storedSoftwares)
    }
    return softwares.value
  }

  // 获取当前用户上传的软件
  function getUserSoftwares() {
    const userStore = useUserStore()
    getAllSoftwares()
    return softwares.value.filter(s => s.userId === userStore.userInfo.id)
  }

  // 获取待审核的软件列表
  function getPendingSoftwares() {
    getAllSoftwares()
    return softwares.value.filter(s => s.status === 'pending')
  }

  // 获取已审核的软件列表
  function getApprovedSoftwares() {
    getAllSoftwares()
    return softwares.value.filter(s => s.status === 'approved')
  }

  // 根据ID获取软件详情
  function getSoftwareById(id) {
    getAllSoftwares()
    return softwares.value.find(s => s.id === Number(id))
  }

  // 上传软件
  function uploadSoftware(softwareData) {
    const userStore = useUserStore()

    const newSoftware = {
      id: Date.now(),
      userId: userStore.userInfo.id,
      username: userStore.username,
      ...softwareData,
      status: 'pending', // pending, approved, rejected
      uploadTime: new Date().toISOString(),
      reviewTime: null,
      reviewComment: ''
    }

    getAllSoftwares()
    softwares.value.push(newSoftware)
    localStorage.setItem('softwares', JSON.stringify(softwares.value))

    return { success: true, message: '软件上传成功，等待审核', data: newSoftware }
  }

  // 审核软件
  function reviewSoftware(id, status, comment = '') {
    getAllSoftwares()
    const software = softwares.value.find(s => s.id === Number(id))

    if (!software) {
      return { success: false, message: '软件不存在' }
    }

    software.status = status
    software.reviewComment = comment
    software.reviewTime = new Date().toISOString()

    localStorage.setItem('softwares', JSON.stringify(softwares.value))

    return { success: true, message: '审核完成' }
  }

  // 删除软件
  function deleteSoftware(id) {
    getAllSoftwares()
    const index = softwares.value.findIndex(s => s.id === Number(id))

    if (index === -1) {
      return { success: false, message: '软件不存在' }
    }

    softwares.value.splice(index, 1)
    localStorage.setItem('softwares', JSON.stringify(softwares.value))

    return { success: true, message: '删除成功' }
  }

  // 统计数据
  function getStatistics() {
    getAllSoftwares()
    return {
      total: softwares.value.length,
      pending: softwares.value.filter(s => s.status === 'pending').length,
      approved: softwares.value.filter(s => s.status === 'approved').length,
      rejected: softwares.value.filter(s => s.status === 'rejected').length
    }
  }

  return {
    softwares,
    getAllSoftwares,
    getUserSoftwares,
    getPendingSoftwares,
    getApprovedSoftwares,
    getSoftwareById,
    uploadSoftware,
    reviewSoftware,
    deleteSoftware,
    getStatistics
  }
})
