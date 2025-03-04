<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAccountDetail, deleteAccountDetail } from '@/api/account'
import { typeMap } from '@/utils'
import { showConfirmDialog } from 'vant'
import PopAdd from '@/components/PopAdd.vue'
const router = useRouter()
const route = useRoute()
const detail = ref({})
const PopAddRef = ref()
const getDetail = async () => {
  // console.log(route.query.id)
  const { data } = await getAccountDetail(route.query.id)
  detail.value = data
  // console.log(data, detail.value.id)
}
const deleteDetail = () => {
  showConfirmDialog({
    title: '删除',
    message: '确认删除订单吗？',
  })
    .then(async () => {
      await deleteAccountDetail(detail.value.id)
      router.back()
    })
    .catch(() => {})
}
const editDetail = () => {
  PopAddRef.value.state.show = true
}
onMounted(() => {
  getDetail()
})
</script>
<template>
  <div class="detail">
    <van-nav-bar title="账单详情" left-text="返回" left-arrow @click-left="router.go(-1)" />
    <div class="card">
      <div class="type">
        <span :class="detail.pay_type === 1 ? 'expense' : 'income'">
          <i
            class="iconfont"
            :class="detail.type_id ? typeMap[detail.type_id].icon : 'icon-fushi'"
          ></i>
        </span>
        <span>餐饮</span>
      </div>
      <div class="amount">{{ `${detail.pay_type === 1 ? '-' : '+'}${detail.amount}` }}</div>
      <div class="info">
        <div class="time">
          <span>记录时间</span> <span>{{ $filters.transYDM(Number(detail.date)) }}</span>
        </div>
        <div class="remark">
          <span>备注</span><span>{{ detail.remark || '-' }}</span>
        </div>
      </div>
      <div class="operation van-hairline--top">
        <span class="van-hairline--right" @click="deleteDetail"
          ><van-icon name="delete" />删除</span
        >
        <span @click="editDetail"><van-icon name="edit" />编辑</span>
      </div>
    </div>
    <PopAdd v-if="detail.id" ref="PopAddRef" @refreshDetail="getDetail" :detail="detail"></PopAdd>
  </div>
</template>
<style lang="scss" scoped>
.detail {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}
.card {
  border-radius: 12px;
  background-color: #fff;
  margin: 15px 20px;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .type {
    padding: 24px 0 12px 0;
    span:nth-of-type(1) {
      display: inline-block;
      width: 22px;
      height: 22px;
      color: #fff;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      margin-right: 8px;
    }
    .expense {
      background-color: vars.$primary;
    }
    .income {
      background-color: vars.$text-warning;
    }
  }
  .amount {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
  }
  .info {
    width: 100%;
    font-size: 14px;
    text-align: left;
    .time {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 12px;
      span:nth-of-type(1) {
        flex: 3;
        color: vars.$color-text-caption;
      }
      span:nth-of-type(2) {
        flex: 9;
      }
    }
    .remark {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 12px;
      span:nth-of-type(1) {
        flex: 3;
        color: vars.$color-text-caption;
      }
      span:nth-of-type(2) {
        flex: 9;
        color: vars.$color-text-base;
      }
    }
  }
  .operation {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 16px;
    .van-icon {
      margin-right: 4px;
    }
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      flex: 1;
    }
    span:nth-of-type(1) {
      color: red;
    }
  }
}
</style>
