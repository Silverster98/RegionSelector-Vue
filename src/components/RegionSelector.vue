<template>
  <div class="region_selector">
    <fieldset>
      <legend>下拉选择框实现省市区三级联动</legend>

      您选择的是： <input type="text" id="address">
      <br/>

      <select id="province" v-on:change="loadCity">
        <option>=请选择省份=</option>
        <option v-for="item in provinceList" :key="item.value">
          {{ item.value }}
        </option>
      </select>

      <select id="city" v-on:change="loadCounty">
        <option>=请选择城市=</option>
        <option v-for="item in cityList" :key="item.value">
          {{ item.value }}
        </option>
      </select>

      <select id="county" v-on:change="selectedCounty">
        <option>=请选择县区=</option>
        <option v-for="item in countyList" :key="item.value">
          {{ item.value }}
        </option>
      </select>

      <button type="button" id="button" v-on:click="showRegion">确定</button>
    </fieldset>
  </div>
</template>

<script>
import {region} from './region'
export default {
  name: 'RegionSelector',
  data () {
    return {
      provinceList: [],
      cityList: [],
      countyList: []
    }
  },
  mounted () {
    this.initElement()
    this.loadProvince()
  },
  methods: {
    initElement: function () {
      this.button = document.getElementById('button')
      this.address = document.getElementById('address')
      this.current = {province: '', city: '', county: ''} // 记录当前选择
    },
    // 加载省份列表
    loadProvince () {
      this.button.disabled = true // 按钮不可点
      const len = region.length
      for (let i = 0; i < len; i++) { // 根据 region 信息添加 option
        const item = {value: region[i].name}
        this.provinceList.push(item)
      }
    },
    // 加载城市，在选中一个省份后开始加载
    loadCity (item) {
      this.button.disabled = true // 按钮不可点
      const provinceIndex = item.target.selectedIndex - 1 // =请选择省份= 选项在 0 处，故减1
      this.current.province = provinceIndex // 记录选择的 province

      this.cityList = []
      this.countyList = [] // 清空 city 和 county 的 select 中的 option

      if (provinceIndex === -1) return // 选择为：=请选择省份=，直接返回

      const cityLen = region[provinceIndex].city.length
      for (let j = 0; j < cityLen; j++) { // 添加相应 option
        const item = {value: region[provinceIndex]['city'][j].name}
        this.cityList.push(item)
      }
    },
    // 加载县区列表，在选择一个城市后开始加载
    loadCounty (item) {
      this.button.disabled = true
      const cityIndex = item.target.selectedIndex - 1
      this.current.city = cityIndex // 记录选择的 city

      this.countyList = [] // 清空county的select

      if (cityIndex === -1) return // 选择为：=请选择城市=，直接返回

      const countyLen = region[this.current.province]['city'][cityIndex].districtAndCounty.length
      if (countyLen === 0) { // 城市下再无县区，可直接点确定
        this.button.disabled = false
        this.current.county = ''
      }
      for (let k = 0; k < countyLen; k++) { // 添加相应 option
        const item = {value: region[this.current.province]['city'][cityIndex]['districtAndCounty'][k]}
        this.countyList.push(item)
      }
    },
    // 选择县区后相关处理
    selectedCounty (item) {
      const countyIndex = item.target.selectedIndex - 1
      this.current.county = countyIndex
      if (countyIndex === -1) { // 选择为：=请选择城市=
        this.button.disabled = true
        return
      }
      this.button.disabled = false
    },
    // 点击确定，显示地区
    showRegion () {
      if (this.current.county === '') {
        this.address.value = region[this.current.province].name + '-' + region[this.current.province]['city'][this.current.city].name
      } else {
        this.address.value = region[this.current.province].name + '-' + region[this.current.province]['city'][this.current.city].name + '-' + region[this.current.province]['city'][this.current.city]['districtAndCounty'][this.current.county]
      }
    }
  }
}
</script>

<style>
  fieldset{
    width: 500px;
    padding: 20px;
    margin: 30px;
    border: 1px solid #ccc
  }

  legend{
    font-size: 18px;
    font-weight: bold;
  }

  #address{
    width: 250px;
    height: 25px;
    margin-bottom: 10px;
  }

  #button{
    width: 80px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid #ccc;
    outline: none;
    background-color: #aaa;
    margin: 0 20px;
  }
  #button:disabled{
    background-color: #ccc;
  }

  select{
    width: 120px;
    height: 30px;
  }
</style>
