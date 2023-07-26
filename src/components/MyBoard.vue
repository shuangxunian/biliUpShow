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
        <div v-if="findFunc === 4">
          <el-input v-model="findData" placeholder="请输入用户uid"></el-input>
        </div>
        <!-- 用户名搜索 -->
        <div v-if="findFunc === 3">
          <el-input v-model="findData" placeholder="请输入用户名"></el-input>
        </div>
        <!-- 范围搜索 -->
        <div class="aoe-find" v-if="findFunc === 2">
          <p class="find-text">
            当前查询范围为播放量前
          </p>
          <el-input class="input no-number" v-model.number="input" :min="1" :max="49901" :step="1"></el-input>
          <p class="find-out-data">
            ~{{ +input + 9 }}
          </p>
        </div>
      </div>
      <div class="btn">
        <el-button type="info" plain @click="input -= 10">上一组</el-button>
        <el-button type="primary" plain @click="input += 10">下一组</el-button>
      </div>
      <p class="ins">数据来源：<el-link href="https://space.bilibili.com/2654670" type="primary">狸子</el-link>，技术支持：<el-link href="https://space.bilibili.com/391117803" type="primary">霜序廿</el-link></p>
      <div class="body">
        <div ref="s2Table" class="table"></div>
        <div id="container" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import * as echarts from 'echarts'
import { Chart } from '@antv/g2'
import { TableSheet } from '@antv/s2'
import json50000 from './data/data50000.json'

// 初始化图表实例
let chart = {}

let table = {}

export default {
  name: 'MyBoard',
  data () {
    return {
      input: 1,
      findFunc: 4,
      options: [
        { value: 4, label: 'uid搜索' },
        { value: 3, label: '用户名搜索' },
        { value: 2, label: '范围搜索' }
      ],
      allData: [],
      getData: [],
      findData: ''
    }
  },
  watch: {
    input: {
      handler (newVal, oldVal) {
        if (newVal < 1) {
          this.input = 1
        } else if (newVal > 49990) {
          this.input = 49990
        }
        this.getData = this.allData.slice(newVal, newVal + 9)
        this.getChart()
        // console.log(newVal)
      }
    },
    findData: {
      handler (newVal, oldVal) {
        this.debounce(this.getFindRes, 500)
      },
      deep: true
    }
  },
  created () {
    this.allData = json50000
    this.getData = this.allData.slice(0, 20)
  },
  mounted () {
    // this.getChart()
    this.getAntvChart()
    this.getTable()
  },
  methods: {
    getAntvChart () {
      chart = new Chart({
        container: 'container',
        theme: 'classic',
        width: 590,
        height: 500
      })
      // 声明可视化
      chart
        .point()
        .data({
          value: this.getData
        })
        .encode('x', '播放量')
        .encode('y', '视频数')
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
      table = this.$refs.s2Table
      // upid":"248380150","播放量":7898400,"视频数":788,"粉丝数":1643,"name":"绿茶浓度过高"
      const data = {
        fields: {
          columns: ['upid', 'name', '播放量', '视频数', '粉丝数']
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
        height: 500
      }
      const s2 = new TableSheet(table, data, options)
      s2.render()
    },
    getFindRes () {
      this.getData = []
      // for (let i = 0; i < this.allData.length; i++) {
      for (let i = 0; i < 10; i++) {
        if (this.allData[i][this.findFunc] === this.findData) {
          this.getData.push(this.allData[i])
          break
        }
      }
      this.getChart()
    },
    debounce (fn, wait) {
      if (this.timer !== null) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(fn, wait)
    }
  }

}
</script>

<style lang="less" scoped>
.board-main {
  width: 100%;
  height: 100%;
  p {
    margin: 0;
  }
  .board-body {
    width: 50%;
    min-width: 1200px;
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
        .find-text {
          width: 160px;
        }
        .input {
          width: 80px;
        }
        .find-out-data {
          margin-left: 20px;
          width: 50px;
        }
      }
    }
    .btn {
      // margin-top: 10px;
      display: flex;
      justify-content: center;
    }
    .ins {
      margin: 10px auto;
    }
    .body {
      display: flex;
      justify-content: space-between;
      .chart {
        width: 590px;
        height: 500px;
      }
      .table {
        width: 590px;
        height: 500px;
      }
    }

  }
}

</style>
