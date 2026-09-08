<template>
  <el-pagination
    class="mt20"
    v-show="total > 0"
    v-model:page-size="pageSize"
    v-model:current-page="currentPage"
    :page-sizes="[8, 10, 12, 24, 36]"
    background
    layout="prev, pager, next, ->, total, sizes, jumper"
    :total="total"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const emits = defineEmits(['update:currentPage', 'update:pageSize'])
const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  pageNo: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const currentPage = computed({
  get() {
    return props.pageNo
  },
  set(val) {
    emits('update:currentPage', val)
  }
})
const pageSize = computed({
  get() {
    return props.pageSize
  },
  set(val) {
    emits('update:pageSize', val)
  }
})
</script>

<style scoped></style>
