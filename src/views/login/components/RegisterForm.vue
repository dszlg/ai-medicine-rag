<template>
  <el-form :model="form" :rules="rules" ref="registerFormRef" size="large">
    <el-form-item prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名">
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="realName">
      <el-input v-model="form.real_name" placeholder="请输入用户昵称">
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="phone">
      <el-input v-model="form.phone" placeholder="请输入手机号">
        <template #prefix>
          <el-icon><Phone /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password>
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item prop="confirmPassword">
      <el-input
        v-model="form.confirm_password"
        type="password"
        placeholder="请再次输入密码"
        show-password
      >
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="flx-justify-between">
    <div class="register">
      <el-button :icon="CircleClose" @click="onReset" size="large" round>重置</el-button>
      <el-button :icon="UserFilled" type="primary" @click="onSubmit" size="large" round>
        注册
      </el-button>
    </div>
    <el-text><router-link to="" @click="goLogin">返回登录</router-link></el-text>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { registerAPI } from '@/api/login'
import { RegisterVO } from '@/typings/api/login'
import { FormInstance } from 'element-plus'
import { CircleClose, UserFilled } from '@element-plus/icons-vue'

defineProps<{
  formType: string
}>()
const emit = defineEmits(['goLogin'])

const registerFormRef = ref<FormInstance>()

const form = reactive<RegisterVO>({
  username: '',
  password: '',
  confirm_password: '',
  real_name: '',
  phone: ''
})

// Validation rules
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  real_name: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirm_password: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

function validatePhone(rule, value, callback) {
  if (!value) {
    return callback()
  }
  // 简单校验：中国手机号 11 位且以 1 开头
  const phoneRe = /^1\d{10}$/
  if (!phoneRe.test(value)) {
    return callback(new Error('请输入有效的手机号'))
  }
  return callback()
}

function validateConfirmPassword(rule, value, callback) {
  if (value !== form.password) {
    return callback(new Error('两次输入的密码不一致'))
  }
  return callback()
}

function onSubmit() {
  registerFormRef.value?.validate(async valid => {
    if (valid) {
      await registerAPI(form)
      ElMessage.success('注册成功')
      onReset()
      goLogin()
    }
  })
}

function onReset() {
  registerFormRef.value?.resetFields()
}

function goLogin() {
  emit('goLogin', 'login')
}
</script>

<style scoped></style>
