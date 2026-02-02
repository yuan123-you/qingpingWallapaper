<template>
  <div class="notice-page">
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增公告
      </el-button>
    </div>

    <el-table :data="noticeList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'system' ? 'primary' : 'danger'">
            {{ row.type === 'system' ? '系统' : '活动' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '发布' : '下架' }}
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

    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="loadNoticeList"
      @current-change="loadNoticeList"
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
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio value="system">系统公告</el-radio>
            <el-radio value="activity">活动公告</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="5" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">发布</el-radio>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getNoticeList, addNotice, updateNotice, deleteNotice } from '@/api'

const noticeList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增公告')
const submitting = ref(false)
const formRef = ref(null)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({
  id: null,
  title: '',
  type: 'system',
  content: '',
  status: 1
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

onMounted(() => {
  loadNoticeList()
})

async function loadNoticeList() {
  try {
    const res = await getNoticeList({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    if (res && res.list) {
      noticeList.value = res.list
      total.value = res.total || 0
    }
  } catch (error) {
    console.error('加载公告列表失败:', error)
  }
}

function handleAdd() {
  dialogTitle.value = '新增公告'
  dialogVisible.value = true
}

function handleEdit(row) {
  dialogTitle.value = '编辑公告'
  Object.assign(form, row)
  dialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该公告吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteNotice(row.id)
      ElMessage.success('删除成功')
      loadNoticeList()
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
          await updateNotice(form)
          ElMessage.success('更新成功')
        } else {
          await addNotice(form)
          ElMessage.success('添加成功')
        }
        
        dialogVisible.value = false
        loadNoticeList()
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
    type: 'system',
    content: '',
    status: 1
  })
}
</script>

<style scoped>
.notice-page {
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
</style>