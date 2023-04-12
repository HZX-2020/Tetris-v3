<template>
  <div>
    <div>来自父组件的msg属性：{{ msg }}</div>
    子组件修改msg
    <button @click="change">修改成：子组件修改了</button>
    <br />
    num:{{ num }}
    <button @click="changeNum">num++</button>
  </div>
  <hr />
  <slot name="btn" :msg="msg"></slot>
  <hr />
  <slot></slot>
  <hr />
  <slot name="link"></slot>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  toRefs,
  onMounted,
  defineProps,
  defineEmits,
} from "vue";
let props = defineProps({
  msg: String,
  num: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits<{
  (event: "change", val: string): void;
  (event: "update:num", n: number): void;
}>();
const change = () => {
  emit("change", "子组件修改了");
};
onMounted(() => {});
// v-model:num 传值 ----固定搭配 update:num 修改事件
let n = props.num;
const changeNum = () => {
  n++;
  emit("update:num", n);
};
</script>

<style scoped lang="less"></style>
