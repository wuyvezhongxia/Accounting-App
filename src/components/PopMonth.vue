<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
const emit = defineEmits(['select'])
const show = ref(false)
const currentDate = ref([])
const columnsType = ['year', 'month']
const toggle = () => {
  show.value = false
}
const closeMonth = () => {
  // console.log(currentDate.value)
  show.value = false
  emit('select', dayjs(currentDate.value).format('YYYY-MM'))
}
const formatter = (type, option) => {
  // console.log(type, option)
  if (type === 'year') {
    option.text += '年'
  }
  if (type === 'month') {
    option.text += '月'
  }
    // console.log(option)
  return option
}
defineExpose({
  show,
})
</script>
<template>
  <van-popup v-model:show="show" position="bottom" round :style="{ height: '50%' }">
    <van-date-picker
      v-model="currentDate"
      :columns-type="columnsType"
      title="选择日期"
      :formatter="formatter"
      @confirm="closeMonth"
      @cancel="toggle"
    />
  </van-popup>
</template>
