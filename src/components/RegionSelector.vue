<template>
  <div class="region_selector">
    <fieldset>
      <legend>下拉选择框实现省市区三级联动</legend>

      您选择的是： <label><input type="text" id="address"></label>
      <br/>

      <select id="province" v-model="province">
        <option value=''>=请选择省份=</option>
        <option v-for="item in getProvinceList()" :value="item.id" :key="item.id">
          {{ item.name }}
        </option>
      </select>

      <select id="city" v-model="city">
        <option value=''>=请选择城市=</option>
        <option v-for="item in getCityList()" :value="item.id" :key="item.id">
          {{ item.name }}
        </option>
      </select>

      <select id="county" v-model="county">
        <option value=''>=请选择县区=</option>
        <option v-for="item in getCountyList()" :value="item.id" :key="item.id">
          {{ item.name }}
        </option>
      </select>

      <button type="button" id="button" v-on:click="showRegion" v-bind:disabled="getOk()">确定</button>
    </fieldset>
  </div>
</template>

<script>
import {region} from './region'
export default {
  name: 'RegionSelector',
  data () {
    return {
      province: '',
      city: '',
      county: '' // 记录当前选择
    }
  },
  mounted () {
    this.address = document.getElementById('address')
  },
  methods: {
    // 直接加载省份列表
    getProvinceList () {
      const len = region.length
      let provList = []
      for (let i = 0; i < len; i++) { // 根据 region 信息添加 option
        const item = {name: region[i].name, id: i}
        provList.push(item)
      }
      return provList
    },
    // 加载城市列表，在选择一个省份后开始加载
    getCityList () {
      let cityList = []
      if (this.province === '') return cityList // 选择为：=请选择省份=

      const cityLen = region[this.province].city.length
      for (let j = 0; j < cityLen; j++) { // 添加相应 option
        const item = {name: region[this.province]['city'][j].name, id: j}
        cityList.push(item)
      }
      return cityList
    },
    // 加载县区列表，在选择一个城市后开始加载
    getCountyList () {
      let countyList = []
      if (this.city === '') return countyList // 选择为：=请选择城市=

      const countyLen = region[this.province]['city'][this.city].districtAndCounty.length
      for (let k = 0; k < countyLen; k++) { // 添加相应 option
        const item = {name: region[this.province]['city'][this.city]['districtAndCounty'][k], id: k}
        countyList.push(item)
      }
      return countyList
    },
    // 判断是否 button 可点击
    getOk () {
      if (this.province === '' || this.city === '') return true
      // 当城市无县区时也可点击
      return this.county === '' && region[this.province]['city'][this.city].districtAndCounty.length !== 0
    },
    // 点击确定，显示地区
    showRegion () {
      if (this.county === '') {
        this.address.value = region[this.province].name + '-' + region[this.province]['city'][this.city].name
      } else {
        this.address.value = region[this.province].name + '-' + region[this.province]['city'][this.city].name + '-' + region[this.province]['city'][this.city]['districtAndCounty'][this.county]
      }
    }
  },
  // 不得已使用，因为当改变省份或城市时，需要清空对当前选择，在 getCityList() 和 getCountyList() 中无法清空
  watch: {
    province: function () {
      this.city = ''
    },
    city: function () {
      this.county = ''
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
