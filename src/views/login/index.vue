<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import registerForm from './components/RegisterForm.vue'
import SwitchDark from '@/components/SwitchDark/index.vue'

const app_title = import.meta.env.VITE_GLOB_APP_TITLE

type FormType = 'login' | 'register'
const formType = ref<FormType>('login')
const handleFormType = (type: FormType) => {
  formType.value = type
}
</script>

<template>
  <div class="login-container flx-center">
    <SwitchDark class="switch-dark" />
    <div class="login-box">
      <div class="login-left">
        <img class="login-left-img" src="@/assets/images/login_left.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/images/logo.svg" alt="logo" />
          <h2 class="logo-text">{{ app_title }}</h2>
        </div>
        <!-- 登录表单 -->
        <template v-if="formType === 'login'">
          <LoginForm :form-type="formType" @go-register="handleFormType" />
        </template>
        <!-- 注册表单 -->
        <template v-else>
          <registerForm :form-type="formType" @go-login="handleFormType" />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './index';
</style>
