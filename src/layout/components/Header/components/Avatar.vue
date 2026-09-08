<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const logout = () => {
  userStore.logout()
}
</script>

<template>
  <el-dropdown trigger="click">
    <div class="avatar">
      <img src="@/assets/images/avatar.png" alt="avatar" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="$router.push('/profile')">
          <el-icon><User /></el-icon>个人中心
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          <el-icon><SwitchButton /></el-icon>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
