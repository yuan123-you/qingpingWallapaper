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
            :preview-src-list="[row.pic_url]"
            fit="cover"
            style="width: 160px; height: 90px"
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
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
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
}

.page-header {
  margin-bottom: 20px;
}
</style>