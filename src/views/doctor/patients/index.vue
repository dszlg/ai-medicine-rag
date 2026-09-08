<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { formatDate } from '@/utils/day'
import {
  getPatientRecord,
  getPatientList,
  createPatientRecord,
  updatePatientRecord,
  deletePatientRecord
} from '@/api/record'
import { HealthRecordVO, HealthRecordCreateDTO } from '@/typings/api/record'

const list = ref<HealthRecordVO[]>([])
const loading = ref(false)
const patientOptions = ref<{ id: number; name: string }[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const id = ref(0)

/** 档案类型选项 */
const recordTypeOptions = ['门诊记录', '住院记录', '体检报告', '复诊记录', '其他']

/** 表单默认值 */
const form = reactive<HealthRecordCreateDTO>({
  user_id: 0,
  record_type: '',
  diagnosis: '',
  treatment: '',
  prescription: '',
  visit_date: null
})

onMounted(async () => {
  loadData()
  loadPatientOptions()
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await getPatientRecord()
    list.value = res.data || []
  } catch {
    list.value = []
  } finally {
    loading.value = false
  }
}

const loadPatientOptions = async () => {
  patientOptions.value = (await getPatientList()).data as any
}

const openCreate = () => {
  isEdit.value = false
  form.user_id = null
  form.record_type = ''
  form.diagnosis = ''
  form.treatment = ''
  form.prescription = ''
  form.visit_date = null
  dialogVisible.value = true
}

const openEdit = (row: HealthRecordVO) => {
  isEdit.value = true
  id.value = row.id
  form.user_id = row.user_id
  form.record_type = row.record_type as string
  form.diagnosis = row.diagnosis as string
  form.treatment = row.treatment as string
  form.prescription = row.prescription
  form.visit_date = row.visit_date
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!isEdit.value && !form.user_id) {
    ElMessage.warning('请选择患者')
    return
  }
  if (!form.record_type) {
    ElMessage.warning('请选择档案类型')
    return
  }
  submitting.value = true
  try {
    if (isEdit.value) {
      await updatePatientRecord(id.value, {
        record_type: form.record_type,
        diagnosis: form.diagnosis,
        treatment: form.treatment,
        prescription: form.prescription,
        visit_date: form.visit_date
      })
      ElMessage.success('更新成功')
    } else {
      await createPatientRecord(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
    loadPatientOptions()
  } catch {
    /* */
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (row: HealthRecordVO) => {
  try {
    await ElMessageBox.confirm(`确定删除患者「${row.user_name}」的档案吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    await deletePatientRecord(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch {
    /* */
  }
}
</script>

<template>
  <div class="card">
    <el-button class="mb12" type="primary" @click="openCreate">新增档案</el-button>
    <el-empty v-if="!loading && !list.length" description="暂无患者档案" />
    <el-table v-else :data="list" v-loading="loading" class="adaptive-table" stripe>
      <el-table-column prop="user_name" label="患者姓名" min-width="100" />
      <el-table-column prop="record_type" label="档案类型" min-width="120" />
      <el-table-column prop="diagnosis" label="诊断" min-width="180" show-overflow-tooltip />
      <el-table-column prop="treatment" label="治疗方案" min-width="180" show-overflow-tooltip />
      <el-table-column prop="visit_date" label="就诊日期" min-width="120" />
      <el-table-column prop="create_time" label="记录时间" min-width="170">
        <template #default="{ row }">{{ formatDate(row.create_time || row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑档案' : '新增档案'"
      width="560px"
      destroy-on-close
    >
      <el-form label-width="90px">
        <el-form-item label="患者" required>
          <el-select
            v-if="!isEdit"
            v-model="form.user_id"
            placeholder="请选择患者"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in patientOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-input v-else :model-value="list.find(i => i.id === id)?.user_name" disabled />
        </el-form-item>
        <el-form-item label="档案类型" required>
          <el-select v-model="form.record_type" placeholder="请选择档案类型" style="width: 100%">
            <el-option v-for="item in recordTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="诊断">
          <el-input v-model="form.diagnosis" placeholder="请输入诊断结果" />
        </el-form-item>
        <el-form-item label="治疗方案">
          <el-input
            v-model="form.treatment"
            type="textarea"
            :rows="3"
            placeholder="请输入治疗方案"
          />
        </el-form-item>
        <el-form-item label="处方">
          <el-input
            v-model="form.prescription"
            type="textarea"
            :rows="2"
            placeholder="请输入处方（选填）"
          />
        </el-form-item>
        <el-form-item label="就诊日期">
          <el-date-picker
            v-model="form.visit_date"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择就诊日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
