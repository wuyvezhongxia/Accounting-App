<script setup>
import { ref, onMounted } from 'vue'
import { getAccountList } from '@/api/account'

const emit = defineEmits(['select'])
const state = ref({
  active: 'all',
  show: false,
  expense: [],
  income: [],
})
onMounted(async () => {
  const res = await getAccountList()
  // console.log(res)
  const list = res.data.list
  // console.log(list)
  state.value.expense = list.filter((i) => i.type === 1)
  state.value.income = list.filter((i) => i.type === 2)
  // console.log(state.value.expense, state.value.income)
})
const toggle = () => {
  state.value.show = false
}
const choseType = (item) => {
  // console.log(item)
  state.value.active = item.id
  state.value.active
  state.value.show = false
  emit('select', item)
}
defineExpose({
  state,
})
</script>
<template>
  <van-popup v-model:show="state.show" position="bottom" round :style="{ height: '70%' }">
    <div class="pop">
      <div class="header van-hairline--bottom">
        请选择类型
        <van-icon name="cross" class="cross" @click="toggle" />
      </div>
      <div class="content">
        <!-- all: true	始终添加 all 类（固定样式） -->
        <div
          @click="choseType({ id: 'all' })"
          :class="{ all: true, active: state.active === 'all' }"
        >
          全部类型
        </div>
        <div class="title">支出</div>
        <div class="expense-wrap">
          <p
            @click="choseType(item)"
            :class="{ active: state.active === item.id }"
            v-for="item in state.expense"
            :key="item"
          >
            {{ item.name }}
          </p>
        </div>
        <div class="title">收入</div>
        <div class="income-wrap">
          <p
            @click="choseType(item)"
            :class="{ active: state.active === item.id }"
            v-for="item in state.income"
            :key="item"
          >
            {{ item.name }}
          </p>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<style lang="scss" scoped>
.pop {
  position: relative;
  background-color: #f5f5f5;
  .header {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 56px;
    text-align: center;
    font-size: 14px;
    line-height: 56px;
    color: vars.$color-text-base;
    background-color: #fff;
    .cross {
      position: absolute;
      left: 10px;
      top: 50%;
      font-size: 20px;
      transform: translateY(-50%);
      color: vars.$color-text-secondary;
    }
  }
  .content {
    padding: 20px;
    .all {
      display: inline-block;
      padding: 12px 20px;
      font-size: 16px;
      color: vars.$color-text-base;
      background-color: #fff;
    }
    .title {
      color: vars.$color-text-caption;
      margin: 10px 0;
      font-size: 14px;
    }
    .expense-wrap,
    .income-wrap {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      p {
        width: calc((100% - 20px) / 3);
        text-align: center;
        padding: 12px 0;
        margin-bottom: 10px;
        background-color: #fff;
        font-size: 16px;
      }
    }
  }
  .active {
    background-color: vars.$primary !important;
    color: #fff;
  }
}
</style>
