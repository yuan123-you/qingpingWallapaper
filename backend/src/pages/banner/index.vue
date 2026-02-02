<template>
  <div class="banner-page">
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增轮播图
      </el-button>
    </div>

    <el-table :data="bannerList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="图片" width="200">
        <template #default="{ row }">
          <el-image
            :src="row.pic_url"
            fit="cover"
            style="width: 160px; height: 90px; cursor: pointer"
            @click="handlePreview(row.pic_url)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="jump_url" label="跳转地址" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="图片URL" prop="pic_url">
          <el-input v-model="form.pic_url" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="跳转地址" prop="jump_url">
          <el-input v-model="form.jump_url" placeholder="请输入跳转地址" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <div v-if="previewVisible" class="image-preview-overlay" @click="closePreview">
      <div class="image-preview-container" @click.stop>
        <el-icon class="preview-close" @click="closePreview"><Close /></el-icon>
        <img :src="previewUrl" class="preview-image" alt="预览图片" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBannerList, addBanner, updateBanner, deleteBanner } from '@/api'

const bannerList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增轮播图')
const submitting = ref(false)
const formRef = ref(null)
const previewVisible = ref(false)
const previewUrl = ref('')

const form = reactive({
  id: null,
  pic_url: '',
  jump_url: '',
  sort: 0,
  status: 1
})

const rules = {
  pic_url: [{ required: true, message: '请输入图片URL', trigger: 'blur' }]
}

onMounted(() => {
  loadBannerList()
})

function handlePreview(url) {
  previewUrl.value = url
  previewVisible.value = true
}

function closePreview() {
  previewVisible.value = false
  previewUrl.value = ''
}

async function loadBannerList() {
  try {
    const res = await getBannerList()
    if (res && res.list) {
      bannerList.value = res.list
    }
  } catch (error) {
    console.error('加载轮播图列表失败:', error)
  }
}

function handleAdd() {
  dialogTitle.value = '新增轮播图'
  dialogVisible.value = true
}

function handleEdit(row) {
  dialogTitle.value = '编辑轮播图'
  Object.assign(form, row)
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该轮播图吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteBanner(row.id)
      ElMessage.success('删除成功')
      loadBannerList()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {})
}

async function handleSubmit() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      
      try {
        if (form.id) {
          await updateBanner(form)
          ElMessage.success('更新成功')
        } else {
          await addBanner(form)
          ElMessage.success('添加成功')
        }
        
        dialogVisible.value = false
        loadBannerList()
      } catch (error) {
        console.error('提交失败:', error)
      } finally {
        submitting.value = false
      }
    }
  })
}

function resetForm() {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: null,
    pic_url: '',
    jump_url: '',
    sort: 0,
    status: 1
  })
}
</script>

<style scoped>
.banner-page {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 200px);
}

.page-header {
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

:deep(.el-table) {
  position: relative;
  z-index: 1;
}

:deep(.el-table__body-wrapper) {
  z-index: 1;
}

:deep(.el-table__header-wrapper) {
  z-index: 1;
}

:deep(.el-table__fixed) {
  z-index: 2;
}

:deep(.el-table__fixed-right) {
  z-index: 2;
}

:deep(.el-image) {
  cursor: pointer;
  position: relative;
  z-index: 2;
}

:deep(.el-image__inner) {
  transition: transform 0.3s;
}

:deep(.el-image__inner:hover) {
  transform: scale(1.05);
}

:deep(.el-dialog) {
  z-index: 20000 !important;
}

:deep(.el-dialog__wrapper) {
  z-index: 20000 !important;
}

.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.image-preview-container {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.preview-close {
  position: absolute;
  top: -40px;
  right: 0;
  font-size: 32px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 100000;
}

.preview-close:hover {
  color: #409eff;
  transform: scale(1.1);
}
</style>