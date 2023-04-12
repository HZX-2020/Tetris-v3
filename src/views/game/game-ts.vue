<template>
  <div class="container">
    <div class="game-div">
      <div class="left-view">
        <div v-for="(row, i) in data.frame" :key="i" class="row">
          <div
            v-for="(col, j) in row"
            :key="j"
            :style="{ background: col.bg }"
            class="square"
          ></div>
        </div>
      </div>
      <div class="right-view">
        <div v-for="(row, i) in data.ass" :key="i" class="row">
          <div
            v-for="(col, j) in row"
            :key="j"
            :style="{ background: col.bg }"
            class="square"
          ></div>
        </div>
        <div>
          <p>得分</p>
          <p>123</p>
        </div>
        <div>
          <p>等级</p>
          <p>1</p>
        </div>
        <div>
          <p>消除</p>
          <p>12</p>
        </div>
        <div class="play">开始</div>
      </div>
    </div>
    <div class="control">
      <div class="bt change">旋转</div>
      <div class="zy">
        <div class="bt">向左</div>
        <div class="bt">向右</div>
      </div>
      <div class="bt down">向下</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { color, blockMod, BlockType} from '@/utils/blockData-ts'
import { ref, reactive, toRefs, onMounted } from "vue";
interface MyArrItf {
  frame: Array<Array<sqType>>;
  ass: Array<Array<sqType>>;
  block: Array<BlockType>;
}
type sqType = {
  data: number;
  bg: string;
};

const row = ref(20); // 行
const col = ref(10); // 列
const bg = ref("#eee"); // 方块默认背景
const data: MyArrItf = reactive({
  frame: [],
  ass: [],
  block:[], // 方块集合
});

// 绘制游戏屏幕
function gameFrame() {
  // 主屏幕
  for (let i = 0; i < row.value; i++) {
    let a: Array<sqType> = [];
    for (let j = 0; j < col.value; j++) {
      a.push({
        data: 0,
        bg: bg.value,
      });
    }
    data.frame.push(a);
  }
  // 副屏幕
  for (let i = 0; i < 4; i++) {
    let a: Array<sqType> = [];
    for (let j = 0; j < 4; j++) {
      a.push({
        data: 0,
        bg: bg.value,
      });
    }
    data.ass.push(a);
  }
}


// 渲染方块
function getBlock(e:number) {
  data.block = blockMod(color[e])
  console.log(data.block);
}


onMounted(() => {
  gameFrame();
  getBlock(0)
});
</script>

<style scoped lang="less">
.container {
  width: 100%;
  padding: 12px;
  
  // border: 1px solid #333;
  .game-div {
    // height: 200px;
    display: flex;

    .left-view {
      .row {
        display: flex;
        padding-top: 1px;
        .square {
          width: 20px;
          height: 20px;
          margin: 0 1px 0 0;
        }
      }
    }
    .right-view {
      padding-left: 20px;
      .row {
        display: flex;
        padding-top: 1px;
        .square {
          width: 16px;
          height: 16px;
          margin: 0 1px 0 0;
        }
      }
      .play{
        width: 56px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-radius: 12px;
        background-color: #aaa;
        cursor: pointer;
      }
    }
  }
  .control {
    width: 212px;
    padding-top: 12px;
    // background-color: #2c92f2;
    .bt {
      height: 36px;
      line-height: 36px;
      text-align: center;
      background: #999;
      color: #fff;
      width: 94px;
      margin: 6px;
      cursor: pointer;
      border-radius: 50px;
      // background: linear-gradient(315deg, #2883da, #2f9cff);
      // box-shadow:  -5px -5px 10px #2885dc,
      //        5px 5px 10px #309fff;
    }
    .zy {
      display: flex;
    }
    .change,
    .down {
      width: 200px;
    }
  }
}
</style>
