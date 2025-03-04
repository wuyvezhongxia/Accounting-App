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
  console.log(state.typeSelect)
}
const monthSelect = (item) => {
  state.currentTime = item
  console.log(state.currentTime)
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
  console.log(data)
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
<!-- 总结
 1. 获取数据
    当数据获取完,将列表清空，主要是为了保证下拉刷新操作后展示的数据是最新的，避免新旧数据混合展示给用户带来混淆

 1. onload加载数据时,滚动条与底部距离小于 offset 时触发
    判断当不是下拉刷新操作时，并且当前的页码小于总页数时，将页码加1
 1. 下拉刷新,重新加载数据时，
    使用分页将页码置为1
    将加载状态置为true
    state.finished = false,表示还有数据可以加载
    state.page = 1
    state.refreshing = true,表示正在进行下拉刷新操作,当 state.refreshing 被设置为 true 时，
    -----van - pull - refresh 组件会接收到这个状态变化，进而展示出对应的刷新动画,要是不把 state.refreshing 设置为 true，在 getbill 方法里就不会执行清空列表的操作，从而可能导致新旧数据混合展示，影响用户体验。------
    state.loading = true,表示正在加载数据。
    onLoad()
  Loading
    当发起请求前会将 state.loading 设置为 true
    当异步请求完成并成功获取到数据后，将 state.loading 设置为 false，这样加载动画就会隐藏，告知用户数据加载完成
    还可以用于避免重复加载数据:当 loading 为 true 时，意味着正在加载数据，此时不应该再次触发加载操作，防止重复请求数据。
-->
