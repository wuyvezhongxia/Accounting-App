<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <div class="about">
    <van-nav-bar title="关于我们" left-text="返回" left-arrow @click-left="router.go(-1)" />
    <van-divider
      content-position="left"
      :style="{ color: '#39be77', borderColor: '#39be77', padding: '0 16px' }"
    >
      关于公司
    </van-divider>
    <div class="content">
      1、公司简介：记账星数字科技有限公司，简称“记账星”，记账星致力于为广大用户提供技术开发、应用软件开发、互联网服务等多项产品和服务。
    </div>
    <van-divider
      content-position="left"
      :style="{ color: '#39be77', borderColor: '#39be77', padding: '0 16px' }"
    >
      关于产品
    </van-divider>
    <div class="content">
      <p>记账星是一款跨平台同步的手机记账软件</p>
      <p>集手机记账、财务规划、社区教育等功能于一体的个人财务管理和服务品牌。</p>
      <p>
        使用到的技术包括 Vite 构建项目、flexible 移动端适配、Vant 3.x 组件库、Vue-Router 4.x
        路由插件、Echarts 5.x 图表插件等等。
      </p>
      <p>提供在线服务端接口地址，无需自建服务或 Mock 数据。</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.about {
  .content {
    padding: 0 16px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.5);
    line-height: 24px;
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
