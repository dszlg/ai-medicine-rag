<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { CircleClose, UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'
import { loginAPI } from '@/api/login'
import { LoginVO, LoginResultVO } from '@/typings/api/login'

defineProps<{
  formType: string
}>()
const emit = defineEmits(['goRegister'])

const loading = ref(false)
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()

// 表单相关
const formData = reactive<LoginVO>({
  username: 'user01',
  password: '123456',
  role: 'user'
})
const rules = reactive<FormRules<LoginVO>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
})

const options = [
  {
    label: '用户',
    value: 'user'
  },
  {
    label: '医生',
    value: 'doctor'
  },
  {
    label: '管理员',
    value: 'admin'
  }
]

// 登录
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        const { data } = await loginAPI(formData)
        userStore.login(data as LoginResultVO)
        loading.value = false
      } catch (e) {
        loading.value = false
      }
    }
  })
}
// 重置表单
const resetForm = () => {
  formData.username = ''
  formData.password = ''
  formData.role = 'user'
}

// 切换到注册表单
const goRegister = () => {
  emit('goRegister', 'register')
}

onMounted(() => {
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      login(loginFormRef.value)
    }
  }
})

onBeforeUnmount(() => {
  document.onkeydown = null
})
</script>

<template>
  <!-- 登录表单 -->
  <el-form ref="loginFormRef" :model="formData" :rules="rules" size="large">
    <el-form-item prop="username">
      <el-input v-model="formData.username" placeholder="用户名: user01/doctor01/admin">
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="formData.password" show-password placeholder="密码:123456">
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="role">
      <el-select v-model="formData.role" placeholder="Select">
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <!-- <el-divider /> -->
  </el-form>
  <div class="flx-justify-between">
    <div class="login">
      <el-button :icon="CircleClose" round size="large" @click="resetForm"> 重置 </el-button>
      <el-button
        :icon="UserFilled"
        round
        size="large"
        type="primary"
        :loading="loading"
        @click="login(loginFormRef)"
      >
        登录
      </el-button>
    </div>
    <el-text>
      没有账号？
      <router-link to="" @click="goRegister">点击注册</router-link>
    </el-text>
  </div>
</template>

<style lang="scss" scoped></style>
