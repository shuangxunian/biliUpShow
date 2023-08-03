<template>
  <div class="board-main">
    <div class="board-body">
      <div class="find-func">
        <p class="find-func-text">
          查询方法：
        </p>
        <el-select v-model="findFunc" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="find">
        <!-- uid搜索 -->
        <div v-if="findFunc === 0">
          <el-input v-model="findData" placeholder="请输入用户uid"></el-input>
        </div>
        <!-- 用户名搜索 -->
        <div v-if="findFunc === 4">
          <el-input v-model="findData" placeholder="请输入用户名"></el-input>
        </div>
        <!-- 范围搜索 -->
        <div class="aoe-find" v-if="findFunc === 2">
          <p class="find-text">
            当前查询范围为播放量从
          </p>
          <el-input class="input no-number" v-model.number="input" :min="1" :max="49901" :step="1"></el-input>
          <p>
            开始，每组
          </p>
          <el-input class="input no-number" v-model.number="scope" :min="1" :max="49901" :step="1"></el-input>
          <p>
            个
          </p>
          <!-- <p class="find-out-data">
            ~{{ +input + 9 }}
          </p> -->
        </div>
      </div>
      <div class="btn">
        <el-button v-if="findFunc === 2" type="info" plain @click="input -= 10">上一组</el-button>
        <el-button v-else type="info" plain @click="toFind(-1)">上一个</el-button>
        <el-button v-if="findFunc === 2" type="primary" plain @click="input += 10">下一组</el-button>
        <el-button v-else type="primary" plain @click="toFind(1)">下一个</el-button>
      </div>

      <div class="body">
        <div ref="s2Table" class="table"></div>
        <div id="container" class="chart"></div>
      </div>
      <div class="bottom">
        <p class="ins">数据来源：<el-link href="https://space.bilibili.com/2654670" type="primary">狸子</el-link>，技术支持：<el-link href="https://space.bilibili.com/391117803" type="primary">霜序廿</el-link></p>
        <p class="remark">数据截止至23年7月</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from '@antv/g2'
import { TableSheet, S2Event } from '@antv/s2'
import { debounce } from 'lodash'
// import json50000 from './data/data50000.json'

// 初始化图表实例
let chart = {}
let interval = {}
let s2Table = {}

export default {
  name: 'MyBoard',
  data () {
    return {
      input: 1,
      findFunc: 4,
      scope: 10,
      options: [
        { value: 0, label: 'uid搜索' },
        { value: 4, label: '用户名搜索' },
        { value: 2, label: '范围搜索' }
      ],
      sortSelectKey: 1,
      sortKeyOptions: [
        { value: 1, label: '播放量' },
        { value: 2, label: '视频数' },
        { value: 3, label: '粉丝数' }
      ],
      sortSelectMethod: 2,
      sortMethodOptions: [
        { value: 1, label: '升序' },
        { value: 2, label: '降序' }
      ],
      allData: [],
      getData: [],
      findData: '',
      cellHeight: 30,
      nowIndex: 0
    }
  },
  watch: {
    input: {
      handler (newVal, oldVal) {
        if (newVal < 1) {
          this.input = 1
        } else if (newVal + this.scope > 50000) {
          this.input = 50000 - this.scope
        }
        this.getData = this.allData.slice(newVal, newVal + this.scope)
        interval.changeData(this.getData)
      }
    },
    scope: {
      handler (newVal, oldVal) {
        if (newVal < 1) {
          this.scope = 1
        } else if (newVal + this.input > 50000) {
          this.scope = 50000 - this.input
        }
        this.getData = this.allData.slice(newVal, newVal + this.scope)
        interval.changeData(this.getData)
      }
    },
    findData: {
      handler (newVal, oldVal) {
        this.debounce(this.getFindRes, 500)
      },
      deep: true
    },
    sortSelectKey: {
      handler (newVal, oldVal) {
        this.getNewAllData()
      }
    },
    sortSelectMethod: {
      handler (newVal, oldVal) {
        this.getNewAllData()
      }
    }
  },
  created () {
    fetch('https://bili-up-show-1300739927.cos.ap-nanjing.myqcloud.com/data50000.json')
      .then(res => res.json())
      .then(data => {
        this.allData = data
        this.getData = this.allData.slice(0, 10)
        this.getAntvChart()
        this.getTable()
      })
  },
  mounted () {},
  methods: {
    getAntvChart () {
      chart = new Chart({
        container: 'container',
        theme: 'classic',
        autoFit: true
      })
      // 声明可视化
      interval = chart
        .point()
        .data({
          value: this.getData
        })
        .encode('x', '播放量')
        .encode('y', '视频数')
        .axis('x', { labelAutoHide: true, labelAutoRotate: false })
        .label({
          text: 'name',
          transform: [{ type: 'overlapDodgeY' }],
          style: {
            stroke: '#fff',
            textAnchor: 'start',
            textBaseline: 'middle',
            dx: 10,
            position: 'left',
            fontSize: 10,
            lineWidth: 2
          }
        })

      // 渲染可视化
      chart.render()
    },
    getTable () {
      const table = this.$refs.s2Table
      const data = {
        fields: {
          columns: ['upid', 'name', '播放量', '播放量排名', '播放时长', '播放时长排名', '视频数', '粉丝数', '粉丝数排名']
        },
        meta: [
          {
            field: 'upid',
            name: '用户id'
          },
          {
            field: 'name',
            name: '昵称'
          }
        ],
        data: this.allData
      }
      const options = {
        width: 590,
        height: 500,
        style: {
          // 列头宽度始终和数值单元格一致
          cellCfg: {
            width: 120
          }
        }
      }
      s2Table = new TableSheet(table, data, options)
      s2Table.render()
      const debounceRender = debounce((width, height) => {
        s2Table.changeSheetSize(width, height)
        s2Table.render(false) // 不重新加载数据
      }, 200)

      const resizeObserver = new ResizeObserver(([entry] = []) => {
        const [size] = entry.borderBoxSize || []
        debounceRender(size.inlineSize, size.blockSize)
      })
      resizeObserver.observe(table)
      s2Table.on(S2Event.LAYOUT_RESIZE_ROW_HEIGHT, (event) => {
        this.cellHeight = event.info.resizedHeight
      })
    },
    getFindRes () {
      this.getData = []
      if (this.findData === '') {
        this.getData = this.allData.slice(0, this.scope)
      } else if (this.findFunc === 0) {
        for (let i = 0; i < this.allData.length; i++) {
          if (this.allData[i].upid.indexOf(this.findData) !== -1) {
            this.getData.push(this.allData[i])
          }
        }
      } else if (this.findFunc === 4) {
        for (let i = 0; i < this.allData.length; i++) {
          if (this.allData[i].name.indexOf(this.findData) !== -1) {
            this.getData.push(this.allData[i])
          }
        }
      }
      this.nowIndex = 0
      s2Table.updateScrollOffset({
        offsetY: {
          value: this.cellHeight * (this.getData[this.nowIndex]['播放量排名'] - 1),
          animate: true
        }
      })
      interval.changeData(this.getData)
    },
    debounce (fn, wait) {
      if (this.timer !== null) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(fn, wait)
    },
    toFind (num) {
      const len = this.getData.length
      if (this.nowIndex + num < 0 || this.nowIndex + num >= len) return
      this.nowIndex += num
      s2Table.updateScrollOffset({
        offsetY: {
          value: this.cellHeight * (this.getData[this.nowIndex]['播放量排名'] - 1),
          animate: true
        }
      })
    },
    getNewAllData () {}
  }

}
</script>

<style lang="less" scoped>
.board-main {
  width: 100%;
  margin-top: 100px;
  p {
    margin: 0;
  }
  .board-body {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    .find-func {
      display: flex;
      justify-content: center;
      .find-func-text {
        line-height: 40px;
      }
    }
    .find {
      display: flex;
      line-height: 40px;
      margin: 10px auto;
      .aoe-find {
        width: 100%;
        display: flex;
        .input {
          margin: 0 10px;
          width: 80px;
        }
      }
    }
    .btn {
      // margin-top: 10px;
      display: flex;
      justify-content: center;
    }

    .sort-method {
      width: 50%;
      height: 40px;
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .body {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .chart {
        margin-top: 10px;
        min-width: 370px;
        width: 48%;
        height: 500px;
      }
      .table {
        margin-top: 10px;
        width: 48%;
        min-width: 370px;
        height: 500px;
      }
    }
    .bottom {
      margin: 10px auto;
      .ins {}
      .remark {
        text-align: center;
        color: #909399;
      }
    }

  }
}

</style>
