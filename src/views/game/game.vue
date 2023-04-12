<template>
  <div class="container">
    <div class="game-div" id="hzx">
      <div class="left-view">
        <div v-for="(row, i) in frame" :key="i" class="row">
          <div
            v-for="(col, j) in row"
            :key="j"
            :style="{ background: col.bg }"
            class="square"
          ></div>
        </div>
      </div>
      <div class="right-view">
        <div v-for="(row, i) in ass" :key="i" class="row">
          <div
            v-for="(col, j) in row"
            :key="j"
            :style="{ background: col.bg }"
            class="square"
          ></div>
        </div>
        <div class="info">
          <p>得分</p>
          <p>{{ score }}</p>
        </div>
        <div class="info">
          <p>等级</p>
          <p>{{ level }}</p>
        </div>
        <div class="info">
          <p>消除</p>
          <p>{{ times }}</p>
        </div>
        <div class="play" @click="stopOrStartGame">
          {{ stop ? "开始" : "暂停" }}
        </div>
        <div class="play" @click="refresh">
          重开
        </div>
      </div>
    </div>
    <div class="control">
      <div class="bt change" @keydown.space="inMoveChange" @click="inMoveChange">旋转</div>
      <div class="direction">
        <div class="bt" @keydown.space="inMoveChange" @click="inMoveChange">旋转</div>
        <div class="zy" @keydown.left="moveLeft">
          <div class="bt"  @click="moveLeft">向左</div>
          <div class="bt" @keydown.right="moveRight" @click="moveRight">向右</div>
        </div>
        <div class="bt down" @keydown.down="moveDown" @click="moveDown">向下</div>

      </div>
    </div>
  </div>
  <div v-if="stop" class="mask" @click="stopOrStartGame">
    <div class="btn">
      点击屏幕继续游戏
    </div>
  </div>
  <div v-if="end" class="mask" @click="stopOrStartGame">
    <div class="btn">
      游戏结束
    </div>
  </div>

</template>

<script>
import { color, blockMod, transition } from "@/utils/blockData";
import { ref, reactive, toRefs, onMounted } from "vue";
export default {
  data() {
    return {
      theme: {
        bg: '#000',

      },
      row: 20, // 行
      col: 10, // 列
      bg: "transparent", // 方块默认背景
      frame: [],
      ass: [],
      block: [], // 方块集合
      now: { b: 0, c: 0 }, // 当前方块，及其旋转角度
      next: { b: 0, c: 0 }, // 下一个方块，及其旋转角度
      nowBlock: [], // 当前方块数据
      nextBlock: [], // 下一个方块数据
      xz: 0, // 当前旋转值
      speed: 800, // 速度等级
      score: 0, // 得分
      level: 1, // 等级
      times: 0, // 消除次数
      timer: '', // 下落定时器
      stop: true, // 暂停
      removeRow: [], // 可消除行的index 数组
      end:false, // 游戏结束
    };
  },
  methods: {
    refresh() {
      location.reload()
    },
    gameFrame() {
      // 主屏幕
      for (let i = 0; i < this.row; i++) {
        let a = [];
        for (let j = 0; j < this.col; j++) {
          let b = {
            data: 0,
            bg: this.bg,
          }
          a.push(b);
        }
        this.frame.push(a);
      }
      // 副屏幕
      for (let i = 0; i < 4; i++) {
        let a = [];
        for (let j = 0; j < 4; j++) {
          let b = {
            data: 0,
            bg: this.bg,
          }
          a.push(b);
        }
        this.ass.push(a);
      }
      // 模拟数据
      // this.frame[4][4].bg = '#0060ef'
      // this.frame[4][4].data = 1
    },
    // 渲染方块
    getBlock(e) {
      this.block = blockMod(color[e]);
      // console.log(this.block);
    },
    //下一个方块
    async getNext() {
      // 随机获取形状
      this.next.b = Math.floor(Math.random() * this.block.length);
      this.next.c = Math.floor(Math.random() * 4); // 4表示旋转4次后还原初始状态
    },
    // 渲染当前形状
    init() {
      // 获取到下一个方块数据
      // this.now = { ...this.next };
      this.now = JSON.parse(JSON.stringify(this.next));
      this.xz = this.now.c; // 当前旋转值
      // 当前形状数据
      this.nowBlock = JSON.parse(JSON.stringify(this.block[this.now.b]));

      // 渲染形状数据
      this.renderBlock(this.nowBlock, this.frame, 1);

      // 旋转方块
      if (this.now.c > 0) {
        // 需要旋转
        for (let i = 0; i < this.now.c; i++) {
          this.change(this.nowBlock, this.frame, this.now, i);
        }
      }

      this.getNext().then(() => {
        // TODO
        if (this.nextBlock.site) {
          this.renderBlock(this.nextBlock, this.ass, 0);
        }
        // 下一个方块 渲染到副屏
        this.nextBlock = JSON.parse(JSON.stringify(this.block[this.next.b]));
        this.renderBlock(this.nextBlock, this.ass, 1);
        // 旋转方块
        if (this.next.c > 0) {
          // 需要旋转
          for (let i = 0; i < this.next.c; i++) {
            this.change(this.nextBlock, this.ass, this.next, i);
          }
        }
      });
    },

    // 渲染方块
    // b:方块数据  d: 位置（主屏 副屏） n: 0擦除 1：生成 2：确定落到底
    renderBlock(b, d, n) {
      let c = b.site;
      // console.log("c", c);
      if (n == 0) {
        // 擦除
        for (let i = 0; i < c.length; i += 2) {
          d[c[i]][c[i + 1]].bg = this.bg;
        }
      } else if (n == 1) {
        // 生成
        for (let i = 0; i < c.length; i += 2) {
          d[c[i]][c[i + 1]].bg = b.color;
        }
      } else if (n == 2) {
        // 落地
        for (let i = 0; i < c.length; i += 2) {
          d[c[i]][c[i + 1]].data = 1;
        }
      }
    },

    // 旋转方块
    // 旋转 b: 当前方块  d:主屏、副屏 z:渲染的对象，当前还是下一个 xz：当前旋转角度
    change(b, d, z, xz) {
      this.renderBlock(b, d, 0); // 先清空旧的图形
      // 记录第一块位置
      const x = b.site[0];
      const y = b.site[1];
      for (let i = 0; i < b.site.length; i += 2) {
        // 循环每个小方块
        let a = b.site[i];
        b.site[i] = b.site[i + 1] - y + x + transition[z.b][xz].x;
        b.site[i + 1] = -(a - x) + y + transition[z.b][xz].y;
      }
      xz++;
      if (xz == 4) {
        xz = 0;
      }
      this.renderBlock(b, d, 1); // 旋转后 生成新的方块
    },

    // 自动下落
    autoMoveDown() {
      this.timer = setInterval(() => {
        this.moveDown();
      }, this.speed);
    },
    stopOrStartGame() {
      console.log('11111');
      this.stop = !this.stop;
      if (this.stop) {
        clearInterval(this.timer);
      } else {
        this.autoMoveDown();
      }
    },
    // 向下移动
    moveDown() {
      if (this.canMove(3)) {
        // 先清理当前的 在渲染
        this.renderBlock(this.nowBlock, this.frame, 0);
        for (let i = 0; i < this.nowBlock.site.length; i += 2) {
          this.nowBlock.site[i]++;
        }
        this.renderBlock(this.nowBlock, this.frame, 1);
      } else {
        // 已经不能下落了
        this.renderBlock(this.nowBlock, this.frame, 2); // 锁死当前块
        // 判断是否有可消除的行
        this.removeBlock();
      }
    },
    // 向左移动
    moveLeft() {
      if (this.canMove(2)) {
        // 先清理当前的 在渲染
        this.renderBlock(this.nowBlock, this.frame, 0);
        for (let i = 1; i < this.nowBlock.site.length; i += 2) {
          if (this.nowBlock.site[i] > 0) {
            this.nowBlock.site[i]--;
          }
        }
        this.renderBlock(this.nowBlock, this.frame, 1);
      }
    },
    // 向右移动
    moveRight() {
      if (this.canMove(1)) {
        // 先清理当前的 在渲染
        this.renderBlock(this.nowBlock, this.frame, 0);
        for (let i = 1; i < this.nowBlock.site.length; i += 2) {
          if (this.nowBlock.site[i] < 10) {
            this.nowBlock.site[i]++;
          }
        }
        this.renderBlock(this.nowBlock, this.frame, 1);
      }
    },
    // 是否可以继续移动  key: 1：向右 2：向左  3：向下  4：旋转
    canMove(key) {
      const temp = this.nowBlock.site;
      let flag = 0; //是否会碰撞
      switch (key) {
        case 1:
          // 判断Y轴
          for (let i = 0; i < temp.length; i += 2) {
            if (temp[i + 1] == this.col - 1) {
              // if (temp[i + 1] >= this.col - 1) {
              return false;
            }
            flag += this.frame[temp[i]][temp[i + 1] + 1].data; // 循环判断当前块 往下移一步后的元素data
          }
          if (flag > 0) {
            return false;
          }
          break;
        case 2:
          // 判断Y轴
          for (let i = 0; i < temp.length; i += 2) {
            // if (temp[i + 1] == 0) {
            if (temp[i + 1] <= 0) {
              return false;
            }
            flag += this.frame[temp[i]][temp[i + 1] - 1].data; // 循环判断当前块 往下移一步后的元素data
          }
          if (flag > 0) {
            return false;
          }
          break;
        case 3:
          // 判断Y轴
          for (let i = 0; i < temp.length; i += 2) {
            // if (temp[i] == this.row - 1) {
            if (temp[i] >= this.row - 1) {
              return false;
            }
            flag += this.frame[temp[i] + 1][temp[i + 1]].data; // 循环判断当前块 往下移一步后的元素data
          }
          if (flag > 0) {
            return false;
          }
          break;
      }
      return true;
    },

    // 移动中旋转 b: 当前方块   z:渲染的对象，当前还是下一个 xz：当前旋转角度
    inMoveChange() {
      const b = JSON.parse(JSON.stringify(this.nowBlock)); // 备份当前， 旋转失败后得还原上一次
      // 记录第一块位置
      const x = b.site[0];
      const y = b.site[1];
      let flag = true; // 是否合理
      for (let i = 0; i < b.site.length; i += 2) {
        // 循环每个小方块
        let a = b.site[i];
        b.site[i] = b.site[i + 1] - y + x + transition[this.now.b][this.xz].x;
        b.site[i + 1] = -(a - x) + y + transition[this.now.b][this.xz].y;

        // 判断旋转后该点时候合理
        if (
          b.site[i + 1] < 0 ||
          b.site[i + 1] >= this.col ||
          b.site[i] >= this.row ||
          this.frame[b.site[i]][b.site[i + 1]].data == 1
        ) {
          flag = false;
        }
      }
      // 旋转合理， 清除后重新渲染
      if (flag) {
        this.renderBlock(this.nowBlock, this.frame, 0); // 先清空旧的图形
        this.xz++;
        if (this.xz == 4) {
          this.xz = 0;
        }
        this.nowBlock = b;
        this.renderBlock(this.nowBlock, this.frame, 1); // 旋转后 生成新的方块
      }
    },
    // 消除行 块
    removeBlock() {
      // 遍历整个界面
      for (let i = 0; i < this.row; i++) {
        let data = 0;
        for (let j = 0; j < this.col; j++) {
          data += this.frame[i][j].data;
        }
        if (data == this.col) {
          // 本行data之和等于列数，说明都填满了，可以消除
          this.removeRow.push(i);
        }
      }
      // 查看是否可以消除
      if (this.removeRow.length > 0) {
        let l = this.removeRow;
        for (let i = 0; i < this.removeRow.length; i++) {
          let j = 0;
          let timer = setInterval(() => {
            this.frame[this.removeRow[i]][j] = { bg: this.bg, data: 0 };
            j++;
            if (j == this.col) {
              clearInterval(timer);
            }
          }, 20);
        }
        setTimeout(() => {
          // 上面的方块下移，从下往上判断
          for (let i = this.row - 1; i >= 0; i--) {
            let a = 0;
            for (let j = 0; j < this.removeRow.length; j++) {
              if (this.removeRow[j] > i) {
                // 删除的行index 大于 当前行
                a++;
              }
            }
            if (a > 0) {
              for (let k = 0; k < this.col; k++) {
                if (this.frame[i][k].data == 1) {
                  // 先向下移动
                  this.frame[i + a][k] = this.frame[i][k];
                  // 再清除当前的
                  this.frame[i][k] = { bg: this.bg, data: 0 };
                }
              }
            }
          }

          // 清除删除的行记录
          this.removeRow = [];
          // 生成下一个
          this.init();
        }, 20 * this.col); // 每行消除需要的时间 20 * 列数

        // 得分。数据处理
        this.times += l.length;
        this.score += ((l.length * (l.length + 1)) / 2) * 100 * this.level;
        this.level = Math.floor(this.score / 1500) + 1
        if (this.level < 21) {
          // 20级内做减法
          this.speed = 500 - (this.level - 1) * 20; 
        }else{
          this.speed = 100;
        }
        // 清除当前下落
        clearInterval(this.timer);
        // 加速后 重新开始下落
        this.autoMoveDown();
      } else {
        // 没有可清除的行，直接生成下一个
        // 生成下一个
        this.init();
      }
    },
  },
  mounted() {
    this.gameFrame();
    this.getBlock(0);
    this.getNext();
    this.init();
  },
};
</script>

<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  padding:0 12px;
  box-sizing: border-box;
  background-image: linear-gradient(180deg, #373B44, #4286f4);
  .game-div {
    display: flex;
    border: 2px solid #333;
    .left-view {
      background-color: #000;
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
      .play {
        width: 56px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-radius: 12px;
        background-color: #666;
        cursor: pointer;
        margin-bottom: 10px;
        
      }
      .info{
        color: #F2994A;
        font-weight: 700;
      }
    }
  }
  .control {
    box-sizing: border-box;
    width: 100%;
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .direction{
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .zy {
        display: flex;
      }

    }
    .bt {
        height: 54px;
        line-height: 54px;
        text-align: center;
        background: #0060ef;
        color: #fff;
        width: 54px;
        margin: 0px 30px;
        cursor: pointer;
        border-radius: 20px;
        // background: linear-gradient(315deg, #2883da, #2f9cff);
        // box-shadow:  -5px -5px 10px #2885dc,
        //        5px 5px 10px #309fff;
      }
    .change{
      height: 100px;
      line-height: 100px;
    }
  }
}
.mask{
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height: 100vh;
  z-index:100;
  background-color: rgba(0,0,0,0.3);
  .btn{
    position: absolute;
    bottom: 40px;
    font-size: 16px;
    text-align: center;
    width:100%;
    animation: change 2s ease infinite;
  }
  @keyframes change {
    0% {
      transform: scale(1);
    }
    25% {
    }
    50% {
      transform: scale(1.5);

    }
    75% {
    }
    100% {
      transform: scale(1);
    }
  }
}

#hzx {
//  --border-radius: 15px;
 --border-width: 4px;
 appearance: none;
 position: relative;
 padding: 1em 2em;
 border: 0;
 background-color: #212121;
 font-family: "Roboto", Arial, "Segoe UI", sans-serif;
 font-size: 18px;
 font-weight: 500;
 color: #fff;
 z-index: 2;
}

#hzx::after {
 --m-i: linear-gradient(#000, #000);
 --m-o: content-box, padding-box;
 content: "";
 position: absolute;
 left: 0;
 top: 0;
 width: 100%;
 height: 100%;
 padding: var(--border-width);
 border-radius: var(--border-radius);
 background-image: conic-gradient(
		#488cfb,
		#29dbbc,
		#ddf505,
		#ff9f0e,
		#e440bb,
		#655adc,
		#488cfb
	);
  z-index: -1;
 -webkit-mask-image: var(--m-i), var(--m-i);
 mask-image: var(--m-i), var(--m-i);
 -webkit-mask-origin: var(--m-o);
 mask-origin: var(--m-o);
 -webkit-mask-clip: var(--m-o);
 mask-composite: exclude;
 -webkit-mask-composite: destination-out;
 filter: hue-rotate(0);
 animation: rotate-hue linear 500ms infinite;
 animation-play-state: paused;
}

#hzx:hover::after {
 animation-play-state: running;
}

@keyframes rotate-hue {
 to {
  filter: hue-rotate(1turn);
 }
}

#hzx,
#hzx::after {
 box-sizing: border-box;
}

#hzx:active {
 --border-width: 5px;
}
</style>
