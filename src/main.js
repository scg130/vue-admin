import echarts from 'echarts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import Vue from 'vue'
import VueAMap from 'vue-amap'
import VueQuillEditor from 'vue-quill-editor'
import App from './App.vue'
import './global.js'
import axios from './http'
import router from './router'
import store from './store/index'
Vue.prototype.$echarts = echarts 
Vue.prototype.$moment = moment 
Vue.use(VueQuillEditor)

 
 
 Vue.use(VueAMap);
Vue.config.productionTip = false

//百度地图	
VueAMap.initAMapApiLoader({
  key: '	3f5bdc7cb6cfffbafe7fbbb18528d7bb',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

Vue.prototype.$axios = axios

//全局时间格式化过滤
Vue.filter('moment', function (value, formatString) {
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
    return moment(value).format('YYYY-MM-DD');
});


Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
