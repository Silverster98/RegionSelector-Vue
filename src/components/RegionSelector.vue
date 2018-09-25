<template>
  <div class="region_selector">
    <fieldset>
      <legend>下拉选择框实现省市区三级联动</legend>

      您选择的是： <label><input type="text" id="address"></label>
      <br/>

      <select id="province" v-model="current.province" v-on:change="loadCity">
        <option value=''>=请选择省份=</option>
        <option v-for="item in provinceList" :value="item.id" :key="item.id">
          {{ item.name }}
        </option>
      </select>

      <select id="city" v-model="current.city" v-on:change="loadCounty">
        <option value=''>=请选择城市=</option>
        <option v-for="item in cityList" :value="item.id" :key="item.id">
          {{ item.name }}
        </option>
      </select>

      <select id="county" v-model="current.county" v-on:change="selectedCounty">
        <option value=''>=请选择县区=</option>
        <option v-for="item in countyList" :value="item.id" :key="item.id">
          {{ item.name }}
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
      countyList: [],
      current: {province: '', city: '', county: ''} // 记录当前选择
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
    },
    // 加载省份列表
    loadProvince () {
      this.button.disabled = true // 按钮不可点
      const len = region.length
      for (let i = 0; i < len; i++) { // 根据 region 信息添加 option
        const item = {name: region[i].name, id: i}
        this.provinceList.push(item)
      }
    },
    // 加载城市，在选中一个省份后开始加载
    loadCity () {
      this.button.disabled = true // 按钮不可点
      this.cityList = []
      this.countyList = [] // 清空 city 和 county 的 select 中的 option
      this.current.city = ''
      this.current.county = '' // 让城市和县区选择框复位

      if (this.current.province === -1) return // 选择为：=请选择省份=，直接返回

      const cityLen = region[this.current.province].city.length
      for (let j = 0; j < cityLen; j++) { // 添加相应 option
        const item = {name: region[this.current.province]['city'][j].name, id: j}
        this.cityList.push(item)
      }
    },
    // 加载县区列表，在选择一个城市后开始加载
    loadCounty () {
      this.button.disabled = true
      this.countyList = [] // 清空county的select
      this.current.county = '' // 让县区选择框复位

      if (this.current.city === -1) return // 选择为：=请选择城市=，直接返回

      const countyLen = region[this.current.province]['city'][this.current.city].districtAndCounty.length
      if (countyLen === 0) { // 城市下再无县区，可直接点确定
        this.button.disabled = false
        this.current.county = ''
      }
      for (let k = 0; k < countyLen; k++) { // 添加相应 option
        const item = {name: region[this.current.province]['city'][this.current.city]['districtAndCounty'][k], id: k}
        this.countyList.push(item)
      }
    },
    // 选择县区后相关处理
    selectedCounty () {
      if (this.current.county === -1) { // 选择为：=请选择城市=
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
