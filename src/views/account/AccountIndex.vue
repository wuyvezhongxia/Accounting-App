<script setup>
import PopType from '@/components/PopType.vue'
import PopMonth from '@/components/PopMonth.vue'
import { ref } from 'vue'
const typeRef = ref()
const monthRef = ref()
const type = ref()
const currentDate = ref()
const showType = () => {
  typeRef.value.state.show = true
}
const showMonth = () => {
  monthRef.value.show = true
}
const typeSelect = (item) => {
  console.log(item)
  type.value = item.name
}
const monthSelect = (item) => {
  currentDate.value = item
}
</script>
<template>
  <div class="home">
    <div class="header">
      <div class="type-wrap" @click="showType">
        <span class="title">{{ type || '全部类型' }}</span>
        <i class="iconfont icon-quanbu"></i>
      </div>
      <div class="data-wrap">
        <span class="time" @click="showMonth">
          {{ currentDate || '2020-12 ' }}<i class="iconfont icon-ssanjiao"></i
        ></span>
        <span class="expense">总支出 ¥1000.00</span>
        <span class="income">总收入 ¥2000.00</span>
      </div>
    </div>
    <PopType ref="typeRef" @select="typeSelect"></PopType>
    <PopMonth ref="monthRef" @select="monthSelect"></PopMonth>
  </div>
</template>
<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 80px;
    background-color: vars.$primary;
    color: #fff;
    font-size: 14px;
    padding: 5px 20px;
    z-index: 100;
    .type-wrap {
      background-color: #50ca84;
      display: inline - block;
      padding: 6px;
      border-radius: 4px;
      position: relative;
      align-self: baseline;
      .title {
        position: relative;
        align-self: baseline;
        margin-right: 22px;
      }
      .title::after {
        content: '';
        position: absolute;
        top: 12px;
        bottom: 11px;
        right: 32px;
        width: 1px;
        background-color: #e9e9e9;
      }
    }
    .data-wrap {
      margin-top: 10px;
      font-size: 13px;
      .time {
        margin-right: 12px;
        .sort-down {
          font-size: 12px;
        }
      }
      .expense {
        margin-right: 10px;
      }
    }
  }
}
</style>
