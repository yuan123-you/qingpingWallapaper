<template>
  <div class="wallpaper-page">
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增壁纸
      </el-button>
    </div>

    <el-table :data="wallpaperList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="封面" width="120">
        <template #default="{ row }">
          <el-image
            :src="row.pic_url"
            fit="cover"
            style="width: 80px; height: 80px; cursor: pointer"
            @click="handlePreview(row.pic_url)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="class_id" label="分类ID" width="100" />
      <el-table-column prop="score" label="评分" width="80" />
      <el-table-column prop="download_count" label="下载量" width="100" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="loadWallpaperList"
      @current-change="loadWallpaperList"
      class="pagination-fixed"
    />

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类" prop="class_id">
          <el-select v-model="form.class_id" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="item in classifyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片URL" prop="pic_url">
          <el-input v-model="form.pic_url" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags" placeholder="请输入标签，用逗号分隔" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">上架</el-radio>
            <el-radio :value="0">下架</el-radio>
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
import { getWallpaperList, addWallpaper, updateWallpaper, deleteWallpaper, getClassifyList } from '@/api'

const wallpaperList = ref([])
const classifyList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增壁纸')
const submitting = ref(false)
const formRef = ref(null)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const previewVisible = ref(false)
const previewUrl = ref('')

const form = reactive({
  id: null,
  title: '',
  class_id: '',
  pic_url: '',
  tags: '',
  desc: '',
  status: 1
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  class_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
  pic_url: [{ required: true, message: '请输入图片URL', trigger: 'blur' }]
}

onMounted(() => {
  loadWallpaperList()
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

async function loadWallpaperList() {
  try {
    const res = await getWallpaperList({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    if (res && res.list) {
      wallpaperList.value = res.list
      total.value = res.total || 0
    }
  } catch (error) {
    console.error('加载壁纸列表失败:', error)
  }
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
  dialogTitle.value = '新增壁纸'
  dialogVisible.value = true
}

function handleEdit(row) {
  dialogTitle.value = '编辑壁纸'
  Object.assign(form, row)
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该壁纸吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteWallpaper(row.id)
      ElMessage.success('删除成功')
      loadWallpaperList()
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
        const data = { ...form }
        if (data.tags) {
          data.tags = data.tags.split(',').map(tag => tag.trim())
        }
        
        if (form.id) {
          await updateWallpaper(data)
          ElMessage.success('更新成功')
        } else {
          await addWallpaper(data)
          ElMessage.success('添加成功')
        }
        
        dialogVisible.value = false
        loadWallpaperList()
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
    title: '',
    class_id: '',
    pic_url: '',
    tags: '',
    desc: '',
    status: 1
  })
}
</script>

<style scoped>
.wallpaper-page {
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

.pagination-fixed {
  position: fixed;
  bottom: 20px;
  left: 220px;
  right: 20px;
  background: #fff;
  padding: 15px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
  display: flex;
  justify-content: flex-end;
  margin: 0;
}

:deep(.pagination-fixed .el-pagination) {
  justify-content: flex-end;
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