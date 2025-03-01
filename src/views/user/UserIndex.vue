<script setup>
import { getUserInfo } from '@/api/user'
import { reactive, onMounted, ref } from 'vue'
// import { showDialog } from 'vant'
const visibleSig = ref(false)
const visibleRate = ref(false)
onMounted(async () => {
  getUser()
})
const user = reactive({
  username: '',
  signature: '',
  avatar: '',
  rate: 3,
})
const getUser = async () => {
  const res = await getUserInfo()
  //   console.log(res)
  user.username = res.data.username
  user.signature = res.data.signature
  user.avatar = res.data.avatar
  console.log(res, user)
}
const confirmSig = () => {}
</script>
<template>
  <div class="user">
    <div class="head">
      <img class="avatar" :src="user.avatar || '//s.yezgea02.com/1606836859539/onpeice.png'" />
      <div class="info">
        <span class="name">{{ user.username || '' }}</span>
        <span class="slogen">个性签名：{{ user.signature || '' }}</span>
      </div>
    </div>
  </div>
  <div class="content">
    <van-cell icon="edit" @click="visibleSig = true" title="修改个性签名" is-link />
    <van-cell icon="setting-o" to="/useraccount" title="账户安全" is-link />
    <van-cell icon="good-job-o" @click="visibleRate = true" title="软件评分" is-link />
    <van-cell icon="smile-o" title="关于我们" to="/about" is-link />
  </div>
  <van-dialog v-model:show="visibleSig" @confirm="confirmSig" title="个性签名" show-cancel-button>
    <van-field
      v-model="user.signature"
      rows="2"
      type="textarea"
      maxlength="20"
      placeholder="请输入个性签名"
    />
  </van-dialog>
  <van-dialog v-model:show="visibleRate" title="软件评分" show-cancel-button max-width="320">
    <van-rate class="rate" v-model="user.rate" allow-half void-icon="star" void-color="#eee" />
  </van-dialog>
</template>
<style lang="scss" scoped>
.user {
  min-height: 100%;
  background-color: #f5f5f5;
  padding: 12px;
  .head {
    display: flex;
    background: linear-gradient(315deg, #7fcea4 0%, #39be77 100%);
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 3px solid #fff;
      margin-right: 10px;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .name {
        font-size: 18px;
        color: #fff;
        font-weight: 500;
      }
      .slogen {
        color: #fff;
        background: rgba(0, 0, 0, 0.1);
        padding: 1px 5px;
        border-radius: 10px;
      }
    }
  }
}
.rate {
  .van-dialog__content {
    text-align: center;
    padding: 20px 0;
  }
}
</style>
