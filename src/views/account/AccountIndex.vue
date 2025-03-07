<script setup>
import PopType from '@/components/PopType.vue'
import PopMonth from '@/components/PopMonth.vue'
import CardItem from '@/components/CardItem.vue'
import { getBillList } from '@/api/account'
import { ref, reactive, onMounted, watch } from 'vue'
import PopAdd from '@/components/PopAdd.vue'
const typeRef = ref()
const monthRef = ref()
const addRef = ref()
const state = reactive({
  page: 1,
  page_size: 2,
  totalPage: 2,
  list: [],
  loading: false, //是否正在加载数据，list
  finished: false, //是否已经加载完，list
  refreshing: false, // 是否正在下拉刷新
  typeSelect: { id: 'all' },
  currentTime: '2025-03',
  totalExpense: 0,
  totalIncome: 0,
})
const showType = () => {
  typeRef.value.state.show = true
}
const showMonth = () => {
  monthRef.value.show = true
}
const typesSelect = (item) => {
  state.typeSelect = item
  // console.log(state.typeSelect)
}
const monthSelect = (item) => {
  state.currentTime = item        
}
// 添加账单
const onAdd = () => {
  addRef.value.state.show = true
}

// 下拉加载
const getbill = async () => {
  const params = {
    date: state.currentTime,
    type_id: state.typeSelect.id,
    page: state.page,
    page_size: state.page_size,
  }
  // console.log(params)
  const { data } = await getBillList(params)
  // console.log(data)
  state.totalExpense = data.totalExpense
  state.totalIncome = data.totalIncome
  state.totalPage = data.totalPage
  // state.list = data.list,
  // console.log(state.list)
  if (state.refreshing) {
    state.list = []
    state.refreshing = false
  }
  state.loading = false
  state.list = state.list.concat(data.list)
  if (state.page >= state.totalPage) state.finished = true
}
//滚动条与底部距离小于 offset 时触发
const onLoad = () => {
  if (!state.refreshing && state.page < state.totalPage) {
    state.page = state.page + 1
  }
  getbill()
}
// 下拉刷新
const onRefresh = () => {
  state.finished = false
  state.page = 1
  state.refreshing = true
  state.loading = true
  onLoad()
}
onMounted(() => {
  onRefresh()
})
// 数据发生变化时,重新加载
watch(
  [() => state.typeSelect, () => state.currentTime],
  () => {
    state.page = 1 // 重置分页
    state.list = [] // 清空旧数据
    onRefresh() // 重新加载
  },
  { deep: true },
)
</script>
<template>
  <div class="home">
    <div class="header">
      <div class="type-wrap" @click="showType">
        <span class="title">{{ state.typeSelect.name || '全部类型' }}</span>
        <i class="iconfont icon-quanbu"></i>
      </div>
      <div class="data-wrap">
        <span class="time" @click="showMonth">
          {{ state.currentTime || '2025-3 ' }}<i class="iconfont icon-ssanjiao"></i
        ></span>
        <span class="expense">总支出 {{ state.totalExpense }}</span>
        <span class="income">总收入 {{ state.totalIncome }}</span>
      </div>
    </div>
    <PopType ref="typeRef" @select="typesSelect"></PopType>
    <PopMonth ref="monthRef" @select="monthSelect"></PopMonth>
    <div class="content-wrap">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <CardItem :state="state"></CardItem>
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- add account -->
    <div class="add" @click="onAdd">
      <van-icon name="records-o" />
    </div>
    <PopAdd ref="addRef" @refresh="onRefresh"></PopAdd>
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
      display: inline-block;
      padding: 6px;
      border-radius: 4px;
      position: relative;
      align-self: baseline;
      .title {
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
  .content-wrap {
    height: calc(100vh - 130px);
    // height: calc(100% - 50px);
    overflow: hidden;
    overflow-y: scroll;
    background-color: #f5f5f5;
    padding: 10px;
  }
  .add {
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #e9e9e9;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    color: vars.$primary;
  }
}
</style>
