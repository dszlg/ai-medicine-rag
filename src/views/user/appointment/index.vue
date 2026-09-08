<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { AppointmentCreateDTO, AppointmentVO } from '@/typings/api/appointment'
import { getMyAppointment, createAppointment } from '@/api/appointment'
import { getDepartmentList } from '@/api/department'
import { getDoctorList } from '@/api/doctor'
import { DepartmentVO } from '@/typings/api/department'
import { DoctorVO } from '@/typings/api/doctor'
import { formatDate } from '@/utils/day'
import { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()
const list = ref<AppointmentVO[]>([])
const departments = ref<DepartmentVO[]>([])
const doctors = ref<DoctorVO[]>([])
const loading = ref(false)
const showDialog = ref(false)

onMounted(async () => {
  list.value = (await getMyAppointment()).data as AppointmentVO[]
  departments.value = (await getDepartmentList()).data as DepartmentVO[]
})

/** 预约时段选项 */
const timeSlotOptions = ['上午', '下午', '晚上']

/** 预约状态映射 */
const statusMap = [
  { type: 'info', label: '待确认' },
  { type: 'success', label: '已确认' },
  { type: 'warning', label: '已完成' },
  { type: 'danger', label: '已取消' }
] as const

const form = reactive<AppointmentCreateDTO>({
  doctor_id: null,
  department_id: null,
  visit_date: '',
  time_slot: '',
  remark: ''
})

const rules = {
  department_id: [{ required: true, message: '请选择部门', trigger: 'change' }],
  doctor_id: [{ required: true, message: '请选择医生', trigger: 'change' }],
  visit_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  time_slot: [{ required: true, message: '请选择时段', trigger: 'change' }]
}

/** 科室变更时重新加载对应医生 */
watch(
  () => form.department_id,
  val => {
    form.doctor_id = null
    loadDoctors(val as number)
  }
)

/** 重置预约表单 */
function resetForm() {
  form.doctor_id = 0
  form.department_id = 0
  form.visit_date = ''
  form.time_slot = ''
  form.remark = ''
}

async function loadDoctors(departmentId?: number) {
  doctors.value = (await getDoctorList('', 1, 100, departmentId)).list as DoctorVO[]
}

const handleCreate = async () => {
  formRef.value?.validate(async valid => {
    if (valid) {
      const { msg } = await createAppointment(form)
      ElMessage.success(msg)
    }
  })
}

const openDialog = () => {
  showDialog.value = true
}
</script>

<template>
  <div class="appointment card">
    <el-button type="primary" class="mb6" @click="openDialog">新建预约</el-button>
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="doctor_name" label="医生" min-width="100" />
      <el-table-column prop="department_name" label="科室" min-width="120" />
      <el-table-column prop="visit_date" label="预约日期" min-width="120" />
      <el-table-column prop="time_slot" label="时段" min-width="80" />
      <el-table-column prop="remark" label="预约原因" min-width="180" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="statusMap[row.status].type">{{
            statusMap[row.status].label ?? '待确认'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" min-width="170">
        <template #default="{ row }">{{ formatDate(row.create_time) }}</template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showDialog" title="新建预约" width="520px">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
        <el-form-item label="科室" prop="department_id">
          <el-select v-model="form.department_id" placeholder="选择科室" style="width: 100%">
            <el-option v-for="d in departments" :key="d.id" :label="d.name" :value="d.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="医生" prop="doctor_id">
          <el-select v-model="form.doctor_id" placeholder="选择医生" style="width: 100%">
            <el-option
              v-for="d in doctors"
              :key="d.id"
              :label="d.real_name || d.username"
              :value="d.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预约日期" prop="visit_date">
          <el-date-picker
            v-model="form.visit_date"
            type="date"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="时段" prop="time_slot">
          <el-select v-model="form.time_slot" placeholder="选择时段" style="width: 100%">
            <el-option v-for="slot in timeSlotOptions" :key="slot" :label="slot" :value="slot" />
          </el-select>
        </el-form-item>
        <el-form-item label="原因">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请简要描述预约原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" class="gradient-btn" @click="handleCreate">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>
