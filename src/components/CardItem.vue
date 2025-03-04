<script setup>
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
const router = useRouter()
const goDetail = (bill) => {
  router.push({
    name: 'detail',
    query: {
      id: bill.id,
    },
  })
}
defineProps({
  state: {
    type: Object,
  },
})
const formattedDate = (date) => {
  return dayjs(date).format('HH:mm')
}
const expense = (list) => {
  return list
    .filter((item) => item.type_id === 1)
    .reduce((sum, item) => (sum += Number(item.amount)), 0)
}
const income = (list) => {
  return list
    .filter((item) => item.type_id === 2)
    .reduce((sum, item) => (sum += Number(item.amount)), 0)
}
</script>
<template>
  <van-cell-group class="item" v-for="item in state.list" :key="item.date">
    <div class="header-date">
      <div>{{ item.date }}</div>
      <div class="money">
        <span><b>支</b>{{ expense(item.bills) }}</span>
        <span><b>收</b>{{ income(item.bills) }}</span>
      </div>
    </div>
    <van-cell
      v-for="bill in item.bills"
      :key="bill.id"
      :class="[bill.type_id === 1 ? 'expense' : 'income']"
      :title="bill.type_name"
      :value="bill.type_id === 1 ? bill.amount * -1 : bill.amount"
      :label="`${formattedDate(Number(bill.date))}|${bill.remark}`"
      @click="goDetail(bill)"
    />
  </van-cell-group>
</template>
<style lang="scss" scoped>
.item {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  .header-date {
    height: 60px;
    display: flex;
    font-size: 12px;
    background-color: #f9f9f9;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    div {
      color: vars.$color-text-base;
    }
    .money {
      span {
        margin-left: 20px;
        font-size: 12px;
        b {
          color: vars.$color-text-caption;
          font-weight: normal;
          background-color: #f5f5f5;
          padding: 3px;
          margin-right: 2px;
        }
      }
    }
  }
  :deep(.expense) {
    .van-cell__title {
      text-align: left;
    }
    .van-cell__value {
      color: vars.$color-text-base !important;
    }
  }
  :deep(.income) {
    .van-cell__title {
      text-align: left;
    }
    .van-cell__value {
      color: vars.$text-warning !important;
    }
  }
}
</style>
