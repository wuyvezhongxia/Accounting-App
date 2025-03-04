<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { typeMap } from '@/utils'
import { getAccountList, addBillList, updateAccountDetail } from '@/api/account'
import dayjs from 'dayjs'
const emit = defineEmits(['refresh', 'refreshDetail'])
const remarkVisible = ref(false)
const props = defineProps({
  detail: {
    type: Object,
  },
})
const id = computed(() => props.detail?.id)
const formatDate = (date, boolean = true) => {
  // date是一个时间戳
  if (boolean) {
    return dayjs(date).format('YYYY-MM-DD').split('-')
  }
  return date
}

// 计算属性是一个响应式对象，无法获取真正的id
console.log(id.value)
const state = reactive({
  show: false,
  showDay: false,
  payType: id.value ? (props.detail.pay_type == 1 ? 'expense' : 'income') : 'expense',
  date: id.value ? formatDate(props.detail.date) : formatDate(dayjs().valueOf()),
  amount: id.value ? props.detail.amount : '',
  expense: [],
  income: [],
  typeMap: typeMap,
  currentType: id.value
    ? {
        id: props.detail.type_id,
        name: props.detail.type_name,
      }
    : {}, //接收传递的对象类型
  remark: id.value ? props.detail.remark : '',
})
onMounted(async () => {
  const {
    data: { list },
  } = await getAccountList()
  // console.log(list)
  state.expense = list.filter((i) => i.type === 1)
  state.income = list.filter((i) => i.type === 2)
  if (!id.value) {
    state.currentType = state.expense[0]
  }
})
const changeType = (type) => {
  state.payType = type
  // 切换类型时，默认选中当前类型的第一项为当前项
}
const choseDay = (value) => {
  console.log(value)
  state.date = value
  state.showDay = false
}
// const formattedDate = (date) => {
//   return dayjs(Number(date)).format('MM-DD')
// }
const remove = () => {
  state.amount = state.amount.slice(0, -1)
}
const onInput = (value) => {
  if (state.amount + value === '.') {
    state.amount = '0.'
  }
  if (state.amount.includes('.') && value === '.') return
  if (
    value !== '.' &&
    state.amount.includes('.') &&
    state.amount &&
    state.amount.split('.')[1].length >= 2
  )
    return
  state.amount += value
}
const choseType = (item) => {
  // console.log(item)
  state.currentType = item
}
const addBill = async () => {
  const params = {
    amount: Number(state.amount).toFixed(2),
    type_id: state.currentType.id,
    type_name: state.currentType.name,
    date: dayjs(state.date).unix() * 1000,
    pay_type: state.payType === 'expense' ? 1 : 2,
    remark: state.remark || '',
  }
  if (id.value) {
    params.id = id.value
    await updateAccountDetail(params)
    state.show = false
    emit('refresh')
    emit('refreshDetail')
  } else {
    await addBillList(params)
    state.amount = ''
    state.payType = 'expense'
    state.currentType = state.expense[0]
    state.show = false
    state.date = new Date()
    state.remark = ''
    // 告知父组件刷新列表
    emit('refresh')
  }
  // console.log(res.data)
}
defineExpose({
  state,
})
</script>
<template>
  <van-popup v-model:show="state.show" position="bottom" round :style="{ height: '95%' }">
    <div class="add-wrap">
      <header class="header">
        <span class="close" @click="state.show = false">
          <van-icon name="cross" />
        </span>
        <van-button class="add-btn" type="primary" size="small" @click="addBill"> 确定 </van-button>
      </header>
      <div class="filter">
        <div class="type">
          <span
            @click="changeType('expense')"
            :class="{ expense: true, active: state.payType == 'expense' }"
          >
            支出
          </span>
          <span
            @click="changeType('income')"
            :class="{ income: true, active: state.payType == 'income' }"
          >
            收入
          </span>
        </div>
        <div @click="state.showDay = true" class="time">
          {{ $filters.transDay(state.date) }} <i class="iconfont sort-down"></i>
        </div>
      </div>
      <div class="money">
        <span class="sufix">¥</span> <span class="amount animation">{{ state.amount }}</span>
      </div>
      <div class="type-warp">
        <div class="type-body" v-if="state.payType == 'expense'">
          <div
            class="type-item"
            v-for="item in state.expense"
            :key="item.id"
            @click="choseType(item)"
          >
            <span
              :class="{
                'iconfont-wrap': true,
                expense: true,
                active: state.currentType.id === item.id,
              }"
            >
              <i class="iconfont" :class="typeMap[item.id].icon"></i>
            </span>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="type-body" v-else>
          <div
            class="type-item"
            v-for="item in state.income"
            :key="item.id"
            @click="choseType(item)"
          >
            <span
              :class="{
                'iconfont-wrap': true,
                income: true,
                active: state.currentType.id == item.id,
              }"
            >
              <i class="iconfont" :class="typeMap[item.id].icon"></i>
            </span>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <!-- 添加备注 -->
      <div class="remark" v-if="state.remark" @click="remarkVisible = true">{{ state.remark }}</div>
      <div class="remark" v-else @click="remarkVisible = true">添加备注</div>
      <van-number-keyboard :show="true" extra-key="." @delete="remove" @input="onInput" />
    </div>
  </van-popup>
  <van-popup v-model:show="state.showDay" position="bottom" round :style="{ height: '46%' }">
    <van-date-picker
      v-model="state.date"
      type="date"
      title="选择时间"
      @confirm="choseDay"
      @cancel="state.showDay = false"
    />
  </van-popup>
  <van-dialog v-model:show="remarkVisible" title="备注" show-cancel-button>
    <van-field
      v-model="state.remark"
      rows="2"
      autosize
      type="textarea"
      maxlength="10"
      placeholder="请输入备注"
      show-word-limit
    />
  </van-dialog>
</template>
<style lang="scss" scoped>
.add-wrap {
  padding-top: 12px;
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
    .van-icon-cross {
      font-size: 20px;
      color: vars.$color-text-secondary;
    }
    .close {
      display: flex;
      align-items: center;
    }
    .add-btn {
      padding: 0 12px;
      background-color: vars.$primary;
      border-color: vars.$primary;
    }
  }
  .filter {
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .type {
      span {
        display: inline-block;
        background: #f5f5f5;
        color: vars.$color-text-caption;
        padding: 4px 12px;
        font-size: 12px;
        border-radius: 24px;
        border: 1px solid #f5f5f5;
      }
      .expense {
        margin-right: 6px;
        &.active {
          background-color: #eafbf6;
          border-color: vars.$primary;
          color: vars.$primary;
        }
      }
      .income {
        &.active {
          background-color: #fbf8f0;
          border-color: vars.$text-warning;
          color: vars.$text-warning;
        }
      }
    }
    .time {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 12px;
      font-size: 12px;
      background-color: #f0f0f0;
      border-radius: 20px;
      color: vars.$color-text-base;
      .sort-down {
        font-size: 12px;
        margin-left: 5px;
      }
    }
  }
  .money {
    padding-bottom: 12px;
    border-bottom: 1px solid #e9e9e9;
    margin: 0 24px;
    .sufix {
      font-size: 36px;
      font-weight: bold;
      vertical-align: top;
    }
    .amount {
      font-size: 40px;
      padding-left: 10px;
    }
  }
  .type-warp {
    display: flex;
    overflow-x: auto;
    margin: 0 24px;
    margin-bottom: 20px;
    * {
      touch-action: pan-x;
    }
    .type-body {
      display: flex;
      white-space: nowrap;
      font-size: 12px;
      .type-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 16px 12px 10px 12px;
        .iconfont-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          margin-bottom: 5px;
          .iconfont {
            color: vars.$color-text-caption;
            font-size: 20px;
          }
        }
        .expense {
          &.active {
            background-color: vars.$primary;
            .iconfont {
              color: #fff;
            }
          }
        }
        .income {
          &.active {
            background-color: vars.$text-warning;
            .iconfont {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .remark {
    font-size: 12px;
    padding: 0 24px;
    padding-bottom: 12px;
    color: #4b67e2;
  }
  .animation::after {
    content: '';
    display: inline-block;
    margin-left: 5px;
    width: 2px;
    height: 28px;
    animation: blink 1s infinite steps(1, start);
  }
  @keyframes blink {
    0% {
      background-color: white;
    }
    50% {
      background-color: vars.$color-text-secondary;
    }
    100% {
      background-color: white;
    }
  }
  .van-number-keyboard {
    position: unset;
  }
}
</style>
