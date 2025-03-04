<script setup>
import { reactive, onMounted, ref } from 'vue'
import PopMonth from '@/components/PopMonth.vue'
import { getAccountDate } from '@/api/account'
import { typeMap } from '@/utils'
import * as echarts from 'echarts'

const state = reactive({
  total_expense: '',
  total_income: '',
  currentMonth: '2025-03',
  totalType: 'expense',
  expense_data: [],
  income_data: [],
  pieType: 'expense',
})
const popMonthRef = ref()
const monthToggle = () => {
  popMonthRef.value.show = true
}
const selectMonth = (value) => {
  state.currentMonth = value
  getMonthData()
}
const getMonthData = async () => {
  // console.log(state.currentMonth)
  const { data } = await getAccountDate(state.currentMonth)
  // console.log(data)
  state.total_expense = data.total_expense
  state.total_income = data.total_income
  state.expense_data = data.total_data.filter((item) => item.pay_type === 1)
  state.income_data = data.total_data.filter((item) => item.pay_type === 2)
  setPieChart()
}
const changeTotalType = (type) => {
  state.totalType = type
}
// 绘制饼图
let myChart
const setPieChart = () => {
  const chartDom = document.getElementById('proportion')
  if (!myChart) {
    myChart = echarts.init(chartDom)
  }
  // 绘制图表
  const data = state.pieType === 'expense' ? state.expense_data : state.income_data
  const selectedData = {}
  if (data.length > 0) {
    selectedData[data[0].type_name] = true
    // console.log(selectedData)
  }
  myChart.setOption({
    tooltip: {
      trigger: 'item',
      // 自定义数据项的显示内容和格式系列名称 \n数据项名称 : 数据值 (百分比%)
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      left: 'center',
      data: data.map((item) => item.type_name),
    },
    series: [
      {
        name: '支出',
        type: 'pie',
        radius: '60%',
        data: data.map((item) => ({ value: item.number, name: item.type_name })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        selected: selectedData, // 设置默认选中项
      },
    ],
  })
}
const changePieType = (type) => {
  state.pieType = type
  setPieChart()
}

onMounted(() => {
  getMonthData()
})
</script>
<template>
  <div class="data">
    <div class="total">
      <div class="time" @click="monthToggle">
        <span>{{ state.currentMonth }}</span> <van-icon name="notes-o" />
      </div>
      <div class="title">共支出</div>
      <div class="expense">¥{{ state.total_expense || 0 }}</div>
      <div class="income">共收入¥{{ state.total_income || 0 }}</div>
    </div>
    <div class="structure">
      <div class="head">
        <span class="title">收支构成</span>
        <div class="tab">
          <span
            @click="changeTotalType('expense')"
            class="expense"
            :class="{ active: state.totalType == 'expense' }"
          >
            支出
          </span>
          <span
            @click="changeTotalType('income')"
            class="income"
            :class="{ active: state.totalType == 'income' }"
          >
            收入
          </span>
        </div>
      </div>
      <div class="content">
        <div
          class="item"
          v-for="item in state.totalType == 'expense' ? state.expense_data : state.income_data"
          :key="item.type_id"
        >
          <div class="left">
            <div class="type">
              <span
                :class="{
                  expense: state.totalType == 'expense',
                  income: state.totalType == 'income',
                }"
              >
                <i class="iconfont" :class="item.type_id ? typeMap[item.type_id].icon : 0"></i>
              </span>
              <span>{{ item.type_name }}</span>
            </div>
            <div class="progress">
              {{
                Number(
                  (item.number /
                    Number(
                      state.totalType == 'expense' ? state.total_expense : state.total_income,
                    )) *
                    100,
                ).toFixed(2)
              }}%
            </div>
          </div>
          <div class="right">
            <div class="percent">
              <van-progress
                :percentage="
                  Number(
                    (item.number /
                      Number(
                        state.totalType == 'expense' ? state.total_expense : state.total_income,
                      )) *
                      100,
                  )
                "
                stroke-width="6px"
                :show-pivot="false"
                track-color="#ffffff"
                color="#39be77"
              />
            </div>
            <div class="money">¥{{ Number(item.number).toFixed(2) || 0 }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="proportion">
      <div class="head">
        <span class="title">收支构成</span>
        <div class="tab">
          <span
            @click="changePieType('expense')"
            class="expense"
            :class="{ active: state.pieType == 'expense' }"
            >支出</span
          >
          <span
            @click="changePieType('income')"
            class="income"
            :class="{ active: state.pieType == 'income' }"
            >收入</span
          >
        </div>
      </div>
      <div id="proportion"></div>
    </div>
    <PopMonth ref="popMonthRef" @select="selectMonth"></PopMonth>
  </div>
</template>
<style lang="scss" scoped>
.data {
  min-height: 100%;
  background-color: #f5f5f5;
  .total {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    margin-bottom: 10px;
    .time {
      position: relative;
      width: 96px;
      padding: 6px;
      background-color: #f5f5f5;
      color: vars.$color-text-base;
      border-radius: 4px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      span:nth-of-type(1)::after {
        content: '';
        position: absolute;
        top: 9px;
        bottom: 8px;
        right: 28px;
        width: 1px;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .van-icon-notes-o {
        font-size: 16px;
        color: vars.$color-text-caption;
      }
    }
    .title {
      color: vars.$primary;
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: 500;
    }
    .expense {
      font-size: 24px;
      color: vars.$primary;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .income {
      color: vars.$color-text-caption;
      font-weight: 500;
      font-size: 12px;
    }
  }
  .structure {
    padding: 0 16px;
    background-color: #fff;
    margin-bottom: 10px;
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      .title {
        font-size: 18px;
        color: vars.$color-text-base;
      }
      .tab {
        span {
          display: inline-block;
          width: 40px;
          height: 24px;
          background-color: #f5f5f5;
          text-align: center;
          line-height: 24px;
          margin-left: 10px;
          border-radius: 4px;
        }
        .expense {
          font-size: 12px;
          &.active {
            background-color: rgba(57, 190, 119, 0.2);
            color: vars.$primary;
          }
        }
        .income {
          font-size: 12px;
          &.active {
            background-color: rgba(236, 190, 37, 0.2);
            color: vars.$text-warning;
          }
        }
      }
    }
    .content {
      font-size: 11px;
      .item {
        display: flex;
        height: 50px;
        align-items: center;
        .left {
          flex: 4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-right: 10px;
          .type {
            display: flex;
            align-items: center;
            span:nth-of-type(1) {
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              margin-right: 10px;
              color: #fff;
            }
            .expense {
              background-color: vars.$primary;
            }
            .income {
              background-color: vars.$text-warning;
            }
          }
        }
        .right {
          flex: 8;
          display: flex;
          align-items: center;
          .percent {
            width: 160px;
          }
          .momey {
            width: 100px;
          }
        }
      }
    }
  }
  .proportion {
    background-color: #fff;
    padding: 12px;
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      .title {
        font-size: 18px;
        color: vars.$color-text-base;
      }
      .tab {
        font-size: 12px;
        span {
          display: inline-block;
          width: 40px;
          height: 24px;
          background-color: #f5f5f5;
          text-align: center;
          line-height: 24px;
          margin-left: 10px;
          border-radius: 4px;
        }
        .expense {
          &.active {
            background-color: rgba(57, 190, 119, 0.2);
            color: vars.$primary;
          }
        }
        .income {
          &.active {
            background-color: rgba(236, 190, 37, 0.2);
            color: vars.$text-warning;
          }
        }
      }
    }
    #proportion {
      width: 100%;
      height: 400px;
    }
  }
}
</style>
