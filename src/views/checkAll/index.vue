<template>
  <div><input type="checkbox" v-model="checkAll" /> 全选/全不选</div>
  <div v-for="(item, index) in list" :key="index">
    <input type="checkbox" v-model="checkList[index]" />
    {{ item }}
  </div>
  <!-- 两种 父子组件传值 -->
  <children :msg="msg" @change="change"></children>
  <div id="a"></div>
  <children v-model:num="num" :msg="msg">
    <div>匿名插槽</div>
    <template v-slot:link>
      <div>具名插槽--link</div>
    </template>
    <template #btn="scope">
      <div>具名插槽--btn--{{ scope.msg }}</div>
    </template>
  </children>
  <!-- 传送门组件 -->
  <Teleport to="#a">
    <div>哈哈哈</div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, computed, onMounted } from "vue";
import children from "./children.vue";
import { DataItf } from "#/index";

let data = reactive<DataItf>({
  list: [10, 20, 30, 40],
  checkList: [],
});
data.checkList = data.list.map(() => false);

let { list, checkList } = toRefs(data);

let checkAll = computed({
  get() {
    return !checkList.value.includes(false);
  },
  set(newV) {
    data.checkList = data.checkList.map(() => newV);
  },
});

// 父传子
let msg = ref("传给子组件的文字");
const change = (val: string) => {
  msg.value = val;
};
// v-model 父子组件通信
let num = ref(20);
onMounted(() => {});

fn("declare");
</script>

<style scoped lang="less"></style>
