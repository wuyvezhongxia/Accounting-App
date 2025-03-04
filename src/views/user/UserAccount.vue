<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { changeUserPss } from '@/api/user'
import { showFailToast } from 'vant'
const userstore = useUserStore()
const router = useRouter()
const visible = ref(false)
const user = reactive({
  oldPass: '',
  newPass: '',
  newPass2: '',
})
const handleOk = async () => {
  if (user.oldPass === user.newPass) {
    showFailToast('原密码不能跟新密码一致')
    return
  }
  const res = await changeUserPss(user)
  console.log(res)
}
const logout = () => {
  userstore.removeToken()
  router.push('/login')
}
</script>
<template>
  <div class="account">
    <van-nav-bar title="账户安全" left-text="返回" left-arrow @click-left="router.go(-1)" />
    <van-cell title="密码修改" @click="visible = true" is-link />
    <van-button class="logout" type="primary" size="large" @click="logout">退出登录</van-button>
    <van-dialog
      class="modal-pass"
      v-model:show="visible"
      @confirm="handleOk"
      title="修改密码"
      show-cancel-button
    >
      <van-cell-group>
        <van-field v-model="user.oldPass" label="原密码" clearable placeholder="请输入原密码" />
        <van-field v-model="user.newPass" label="新密码" clearable placeholder="请输入新密码" />
        <van-field v-model="user.newPass2" label="确认密码" clearable placeholder="再次输入确认" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>
<style lang="scss">
.account {
  min-height: 100%;
  background-color: #f5f5f5;
  .logout {
    display: block;
    margin: 0 auto;
    width: 90%;
    margin-top: 20px;
    background-color: vars.$primary;
    border-color: vars.$primary;
  }
  .modal-pass {
    .van-dialog__header {
      padding: 10px 0;
    }
    .van-dialog__content {
      .van-cell-group {
        padding: 20px;
      }
    }
  }
}
</style>
