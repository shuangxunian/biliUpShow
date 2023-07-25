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
      <div id="chart" class="chart"></div>
    </div>
  </div>
</template>

<script>
// import * as echarts from 'echarts'
import json50000 from './data/data50000.json'

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
    this.allData = json50000.data
    this.getData = this.allData.slice(0, 20)
  },
  mounted () {
    // this.getChart()
    this.getAntvChart()
  },
  methods: {
    getAntvChart () {},
    getChart () {
      // 基于准备好的dom，初始化echarts实例
      // const myChart = echarts.init(document.getElementById('chart'))
      const myChart = {}
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'B站前5万up播放量/视频数'
        },
        xAxis: {
          // name: '',
          splitLine: { show: false },
          axisLabel: {
            interval: 0,
            rotate: 45,
            margin: 2,
            textStyle: {
              fontWeight: 'bolder',
              color: '#000000'
            }
          }
        },
        yAxis: {
          name: '视频数取对数',
          splitLine: { show: false },
          scale: true
        },
        grid: {
          left: 80,
          right: 130
        },
        series: [
          {
            data: this.getData,
            type: 'scatter',
            symbolSize: (data) => {
              return Math.sqrt(data[2]) / 1e3
            },
            emphasis: {
              focus: 'self'
            },
            labelLayout: function () {
              return {
                x: myChart.getWidth() - 100,
                moveOverlap: 'shiftY'
              }
            },
            labelLine: {
              show: true,
              length2: 5,
              lineStyle: {
                color: '#bbb'
              }
            },
            label: {
              show: true,
              formatter: (param) => {
                return param.data[3]
              },
              position: 'right',
              minMargin: 2
            }
          }
        ]
      })
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
    min-width: 600px;
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
    .chart {
      width: 100%;
      height: 500px;
    }
  }
}

</style>
