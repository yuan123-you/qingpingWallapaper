<template>
  <div class="classify-page">
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增分类
      </el-button>
    </div>

    <el-table :data="classifyList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="封面" width="120">
        <template #default="{ row }">
          <el-image
            :src="row.cover_url"
            fit="cover"
            style="width: 80px; height: 80px; cursor: pointer"
            @click="handlePreview(row.cover_url)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="desc" label="描述" />
      <el-table-column prop="wall_count" label="壁纸数量" width="100" />
      <el-table-column prop="sort" label="排序" width="80" />
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
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="封面URL" prop="cover_url">
          <el-input v-model="form.cover_url" placeholder="请输入封面URL" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
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
import { getClassifyList, addClassify, updateClassify, deleteClassify } from '@/api'

const classifyList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const submitting = ref(false)
const formRef = ref(null)
const previewVisible = ref(false)
const previewUrl = ref('')

const form = reactive({
  id: null,
  name: '',
  cover_url: '',
  desc: '',
  sort: 0
})

const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  cover_url: [{ required: true, message: '请输入封面URL', trigger: 'blur' }]
}

onMounted(() => {
  loadClassifyList()
})

function handlePreview(url) {
  previewUrl.value = url
  previewVisible.value = true
}

function closePreview() {
  previewVisible.value = false
  previewUrl.value = ''
}

async function loadClassifyList() {
  try {
    const res = await getClassifyList()
    if (res && res.list) {
      classifyList.value = res.list
    }
  } catch (error) {
    console.error('加载分类列表失败:', error)
  }
}

function handleAdd() {
  dialogTitle.value = '新增分类'
  dialogVisible.value = true
}

function handleEdit(row) {
  dialogTitle.value = '编辑分类'
  Object.assign(form, row)
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteClassify(row.id)
      ElMessage.success('删除成功')
      loadClassifyList()
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
          await updateClassify(form)
          ElMessage.success('更新成功')
        } else {
          await addClassify(form)
          ElMessage.success('添加成功')
        }
        
        dialogVisible.value = false
        loadClassifyList()
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
    name: '',
    cover_url: '',
    desc: '',
    sort: 0
  })
}
</script>

<style scoped>
.classify-page {
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