<script setup lang="ts">
import ThemeSetting from './components/ThemeSetting.vue'
// import Message from './components/Message.vue'
import Fullscreen from './components/Fullscreen.vue'
import Avatar from './components/Avatar.vue'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const username = userStore.getInfo.nickname
</script>

<template>
  <div class="tool-bar-right">
    <div class="header-icon">
      <!-- <Message id="message" /> -->
      <ThemeSetting id="themeSetting" />
      <Fullscreen id="fullscreen" />
    </div>
    <span class="username">{{ username }}</span>
    <Avatar />
  </div>
</template>

<style lang="scss" scoped>
.tool-bar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
    color: var(--el-header-text-color);
  }
}
</style>
