<script setup>
import { ref, onMounted } from 'vue'
import ImgVerify from '@/components/ImgVerify.vue'
import { useUserLogin, useUserRegistr } from '@/api/user'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const router = useRouter()
const verifyRef = ref(null)
const formModel = ref({
  username: '',
  password: '',
  verify: '',
  type: 'register',
  imgCode: '',
})
onMounted(() => {
  console.log(verifyRef.value.imgCode)
})
const changeType = () => {
  if (formModel.value.type === 'register') {
    formModel.value.type = 'login'
  } else if (formModel.value.type === 'login') {
    formModel.value.type = 'register'
  }
}
const onSubmit = async () => {
  if (formModel.value.type === 'login') {
    const res = await useUserLogin(formModel.value)
    // console.log(res)
    // console.log(userStore.token)
    userStore.setToken(res.data.token)
    router.push('/account/index')
  } else if (formModel.value.type === 'register') {
    formModel.value.imgCode = verifyRef.value.imgCode || ''
    if (formModel.value.imgCode !== formModel.value.verify) {
      showToast('验证码错误')
    } else {
      const res = await useUserRegistr(formModel.value)
      console.log(res)
      formModel.value.type = 'login'
    }
  }
}
</script>
<template>
  <div class="box">
    <van-nav-bar
      :title="formModel.type === 'register' ? '注册' : '登录'"
      left-text="返回"
      left-arrow
      class="navbar"
    />
    <div class="image">
      <img src="../../assets/haimian.png" />
    </div>
    <van-form>
      <van-cell-group inset>
        <van-field
          v-model="formModel.username"
          name="username"
          label="账号"
          placeholder="请输入账号"
          :rules="[
            { required: true, message: '请输入账号' },
            { pattern: /^\S{1,10}$/, message: '账号必须是1-10的非空字符' },
          ]"
        />
        <van-field
          v-model="formModel.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[
            { required: true, message: '请输入密码' },
            { pattern: /^\S{6,8}$/, message: '密码必须是6-8的非空字符' },
          ]"
        />
        <van-field
          v-if="formModel.type === 'register'"
          v-model="formModel.verify"
          type="text"
          name="verify"
          label="验证码"
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <template #button>
            <ImgVerify ref="verifyRef"></ImgVerify>
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit" @click="onSubmit">
          {{ formModel.type === 'register' ? '注册' : '登录' }}
        </van-button>
      </div>
    </van-form>
    <p @click="changeType">
      {{ formModel.type === 'register' ? '登录已有账号' : '没有账号,前往注册' }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
body {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
van-field input:focus {
  outline: none;
}
.box {
  background-color: hsl(0, 7%, 94%);
  width: 100%;
  height: 100vh;
  .image {
    width: 4rem;
    height: 4rem;
    margin: 10px auto 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    text-align: center;
    font-size: 13px;
    color: #597fe7;
  }
}
</style>
