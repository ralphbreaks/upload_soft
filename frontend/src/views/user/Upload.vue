<template>
  <div class="upload-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>上传软件</span>
        </div>
      </template>

      <el-form
        ref="uploadFormRef"
        :model="uploadForm"
        :rules="uploadRules"
        label-width="100px"
        class="upload-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="软件名称" prop="name">
              <el-input
                v-model="uploadForm.name"
                placeholder="请输入软件名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="软件版本" prop="version">
              <el-input
                v-model="uploadForm.version"
                placeholder="例如：1.0.0"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="软件分类" prop="category">
              <el-select
                v-model="uploadForm.category"
                placeholder="请选择软件分类"
                style="width: 100%"
              >
                <el-option label="系统工具" value="system" />
                <el-option label="办公软件" value="office" />
                <el-option label="图形图像" value="graphics" />
                <el-option label="网络工具" value="network" />
                <el-option label="多媒体" value="media" />
                <el-option label="开发工具" value="development" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="软件大小" prop="size">
              <el-input
                v-model="uploadForm.size"
                placeholder="例如：50MB"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="软件简介" prop="description">
          <el-input
            v-model="uploadForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入软件简介"
          />
        </el-form-item>

        <el-form-item label="软件文件" prop="file">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :file-list="fileList"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持exe、msi、zip等格式，文件大小不超过500MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="软件截图">
          <el-upload
            class="screenshot-upload"
            :auto-upload="false"
            list-type="picture-card"
            :limit="5"
            :on-change="handleScreenshotChange"
            :on-remove="handleScreenshotRemove"
            :file-list="screenshotList"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                最多上传5张截图，支持jpg、png格式
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="uploading"
            @click="handleSubmit"
          >
            提交上传
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useSoftwareStore } from '../../stores/software'
import { ElMessage } from 'element-plus'

const router = useRouter()
const softwareStore = useSoftwareStore()
const uploadFormRef = ref(null)
const uploading = ref(false)
const fileList = ref([])
const screenshotList = ref([])

const uploadForm = reactive({
  name: '',
  version: '',
  category: '',
  size: '',
  description: '',
  file: null,
  screenshots: []
})

const uploadRules = {
  name: [
    { required: true, message: '请输入软件名称', trigger: 'blur' }
  ],
  version: [
    { required: true, message: '请输入软件版本', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择软件分类', trigger: 'change' }
  ],
  size: [
    { required: true, message: '请输入软件大小', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入软件简介', trigger: 'blur' },
    { min: 10, message: '软件简介至少10个字符', trigger: 'blur' }
  ],
  file: [
    { required: true, message: '请选择软件文件', trigger: 'change' }
  ]
}

const handleFileChange = (file, files) => {
  // 检查文件大小（500MB = 524288000 字节）
  if (file.size > 524288000) {
    ElMessage.error('文件大小不能超过500MB')
    fileList.value = files.filter(f => f.uid !== file.uid)
    return
  }
  uploadForm.file = file
  fileList.value = files
}

const handleFileRemove = () => {
  uploadForm.file = null
  fileList.value = []
}

const handleScreenshotChange = (file, files) => {
  // 检查是否为图片
  const isImage = file.raw.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    screenshotList.value = files.filter(f => f.uid !== file.uid)
    return
  }
  uploadForm.screenshots = files
  screenshotList.value = files
}

const handleScreenshotRemove = (file, files) => {
  uploadForm.screenshots = files
  screenshotList.value = files
}

const handleSubmit = async () => {
  if (!uploadFormRef.value) return

  await uploadFormRef.value.validate((valid) => {
    if (valid) {
      uploading.value = true

      // 模拟上传过程
      setTimeout(() => {
        const result = softwareStore.uploadSoftware({
          name: uploadForm.name,
          version: uploadForm.version,
          category: uploadForm.category,
          size: uploadForm.size,
          description: uploadForm.description,
          fileName: uploadForm.file.name,
          screenshotCount: uploadForm.screenshots.length
        })

        uploading.value = false

        if (result.success) {
          ElMessage.success(result.message)
          handleReset()
          // 跳转到我的上传页面
          setTimeout(() => {
            router.push('/user/my-uploads')
          }, 1000)
        } else {
          ElMessage.error(result.message)
        }
      }, 1500)
    }
  })
}

const handleReset = () => {
  uploadFormRef.value?.resetFields()
  uploadForm.file = null
  uploadForm.screenshots = []
  fileList.value = []
  screenshotList.value = []
}
</script>

<style scoped>
.upload-container {
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.upload-form {
  margin-top: 20px;
}

.screenshot-upload {
  width: 100%;
}
</style>
