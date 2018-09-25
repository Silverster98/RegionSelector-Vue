import Vue from 'vue'
import Router from 'vue-router'
import RegionSelector from '@/components/RegionSelector'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'RegionSelector',
      component: RegionSelector
    }
  ]
})
