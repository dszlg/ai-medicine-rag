<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue'
import { formatDate } from '@/utils/day'
import { ConsultCreateDTO, UserConsultVO } from '@/typings/api/consult'
import { getDoctorList } from '@/api/doctor'
import { DoctorVO } from '@/typings/api/doctor'
import { getMyConsult, createConsult } from '@/api/consult'

const list = ref<UserConsultVO[]>([])
const doctors = ref<DoctorVO[]>([])
const loading = ref(false)
const showDialog = ref(false)

const form = reactive({
  doctor_id: null,
  title: '',
  content: ''
})

onMounted(async () => {
  list.value = (await getMyConsult()).data as UserConsultVO[]
  doctors.value = (await getDoctorList('', 1, 100)).list as DoctorVO[]
})

const openDialog = () => {
  showDialog.value = true
}

const handleCreate = async () => {
  if (!form.doctor_id || !form.title || !form.content) {
    ElMessage.warning('请填写完整信息')
    return
  }

  await createConsult({
    doctor_id: form.doctor_id,
    chief_complaint: form.title ? `${form.title}：${form.content}` : form.content
  })

  form.doctor_id = null
  form.title = ''
  form.content = ''
  ElMessage.success('咨询提交成功')
  list.value = (await getMyConsult()).data as UserConsultVO[]
  showDialog.value = false
}
</script>

<template>
  <div class="consult card">
    <el-button class="mb6" type="primary" @click="openDialog">发起咨询</el-button>
    <el-table :data="list" v-loading="loading" class="adaptive-table" stripe>
      <el-table-column
        prop="chief_complaint"
        label="咨询标题"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column prop="doctor_name" label="医生" min-width="100" />
      <el-table-column prop="status" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'warning'" size="small">
            {{ row.status === 1 ? '已回复' : '待回复' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="提交时间" min-width="170">
        <template #default="{ row }">{{ formatDate(row.create_time) }}</template>
      </el-table-column>
      <el-table-column label="医生回复" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">{{
          row.replies?.length ? row.replies[row.replies.length - 1].content : ''
        }}</template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showDialog" title="发起咨询" width="520px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="选择医生">
          <el-select v-model="form.doctor_id" placeholder="请选择医生" style="width: 100%">
            <el-option
              v-for="d in doctors"
              :key="d.id"
              :label="d.real_name || d.username"
              :value="d.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="咨询标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请描述您的问题" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" class="gradient-btn" @click="handleCreate">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
