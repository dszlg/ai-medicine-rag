<script lang="ts" setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { updateAvatar, updatePassword, updateProfile } from '@/api/profile'
import { ProfileUpdateDTO } from '@/typings/api/profile'

const userStore = useUserStore()
const activeTab = ref('info')
const saving = ref(false)
const uploading = ref(false)

const avatarUrl = computed(() => userStore.avatar)
const avatarText = computed(() => userStore.nickname.slice(0, 1))
const displayName = ref('')

/** 当前用户角色 */
const userRole = computed(() => userStore.getRole)

/** 个人资料表单（按角色展示不同字段） */
const infoForm = reactive<ProfileUpdateDTO>({
  nickname: '',
  real_name: '',
  phone: '',
  email: '',
  gender: 1,
  age: null,
  allergy_history: '',
  title: '',
  specialty: '',
  introduction: ''
})

/** 密码修改表单 */
const pwdForm = reactive({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

const handleAvatarUpload = ({ file }): Promise<unknown> => {
  return new Promise(async () => {
    uploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await updateAvatar(formData)
      userStore.avatar = res.data?.avatar || ''
      ElMessage.success('头像上传成功')
    } catch {
      /* */
    } finally {
      uploading.value = false
    }
  })
}

/**
 * 构建角色对应的提交数据（仅发送后端支持的字段）
 */
function buildSavePayload() {
  if (userRole.value === 'admin') {
    return {
      nickname: infoForm.nickname || null,
      phone: infoForm.phone || null,
      email: infoForm.email || null
    }
  }
  if (userRole.value === 'doctor') {
    return {
      real_name: infoForm.real_name || null,
      phone: infoForm.phone || null,
      title: infoForm.title || null,
      specialty: infoForm.specialty || null,
      introduction: infoForm.introduction || null
    }
  }
  return {
    real_name: infoForm.real_name || null,
    phone: infoForm.phone || null,
    gender: infoForm.gender ?? 1,
    age: infoForm.age ?? null,
    allergy_history: infoForm.allergy_history || null
  }
}

const saveInfo = async () => {
  saving.value = true
  try {
    const payload = buildSavePayload()
    await updateProfile(payload)
    ElMessage.success('资料更新成功')
  } catch {
    /* */
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (pwdForm.new_password !== pwdForm.confirm_password) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }
  saving.value = true
  try {
    await updatePassword({
      old_password: pwdForm.old_password,
      new_password: pwdForm.new_password
    })
    ElMessage.success('密码修改成功')
    Object.assign(pwdForm, { old_password: '', new_password: '', confirm_password: '' })
    // 重新登录
    userStore.logout()
  } catch {
    /* */
  } finally {
    saving.value = false
  }
}

watch(
  () => userStore.nickname,
  () => {
    displayName.value = userStore.nickname
  }
)
</script>

<template>
  <el-row :gutter="12">
    <!-- 左侧菜单 -->
    <el-col :xs="24" :sm="6">
      <div class="profile-sidebar card">
        <div class="avatar-section">
          <el-upload :show-file-list="false" :http-request="handleAvatarUpload" accept="image/*">
            <el-avatar :size="80" :src="avatarUrl" class="avatar-click">
              {{ avatarText }}
            </el-avatar>
          </el-upload>
          <p class="avatar-tip">点击头像上传</p>
          <h3>{{ displayName }}</h3>
        </div>
        <el-menu :default-active="activeTab" @select="k => (activeTab = k)">
          <el-menu-item index="info">资料修改</el-menu-item>
          <el-menu-item index="password">密码修改</el-menu-item>
        </el-menu>
      </div>
    </el-col>

    <!-- 右侧内容 -->
    <el-col :xs="24" :sm="18">
      <div class="profile-content card">
        <!-- 资料修改 -->
        <div v-show="activeTab === 'info'">
          <h3 class="content-title">个人资料</h3>
          <el-form :model="infoForm" label-width="90px" style="max-width: 480px">
            <!-- 管理员：用户昵称、手机号、邮箱 -->
            <template v-if="userRole === 'admin'">
              <el-form-item label="用户昵称">
                <el-input v-model="infoForm.nickname" placeholder="请输入用户昵称" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="infoForm.phone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="infoForm.email" placeholder="请输入邮箱" />
              </el-form-item>
            </template>

            <!-- 医生：姓名、职称、专长等 -->
            <template v-else-if="userRole === 'doctor'">
              <el-form-item label="医生姓名">
                <el-input v-model="infoForm.real_name" placeholder="请输入医生姓名" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="infoForm.phone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="职称">
                <el-input v-model="infoForm.title" placeholder="请输入职称" />
              </el-form-item>
              <el-form-item label="专长">
                <el-input v-model="infoForm.specialty" placeholder="请输入专长领域" />
              </el-form-item>
              <el-form-item label="简介">
                <el-input
                  v-model="infoForm.introduction"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入个人简介"
                />
              </el-form-item>
            </template>

            <!-- 患者：姓名、性别、年龄等 -->
            <template v-else>
              <el-form-item label="用户昵称">
                <el-input v-model="infoForm.real_name" placeholder="请输入用户昵称" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="infoForm.phone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="infoForm.gender">
                  <el-radio :value="1">男</el-radio>
                  <el-radio :value="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="年龄">
                <el-input-number v-model="infoForm.age" :min="1" :max="150" />
              </el-form-item>
              <el-form-item label="过敏史">
                <el-input
                  v-model="infoForm.allergy_history"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入过敏史，无则填无"
                />
              </el-form-item>
            </template>

            <el-form-item>
              <el-button type="primary" class="gradient-btn" :loading="saving" @click="saveInfo">
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 密码修改 -->
        <div v-show="activeTab === 'password'">
          <h3 class="content-title">修改密码</h3>
          <el-form :model="pwdForm" label-width="100px" style="max-width: 480px">
            <el-form-item label="原密码">
              <el-input v-model="pwdForm.old_password" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="pwdForm.new_password" type="password" show-password />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="pwdForm.confirm_password" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="gradient-btn"
                :loading="saving"
                @click="changePassword"
                >修改密码</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="scss">
@use './index';
</style>
