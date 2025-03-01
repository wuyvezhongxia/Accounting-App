<script setup></script>

<template>
  <router-view></router-view>
  <van-tabbar active-color="#39be77 " route>
    <van-tabbar-item icon="notes-o" to="/account/index">明细</van-tabbar-item>
    <van-tabbar-item icon="bar-chart-o" to="/data">统计</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
  </van-tabbar>
</template>
