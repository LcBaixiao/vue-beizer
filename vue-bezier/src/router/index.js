import Vue from 'vue'
import Vuex from 'vuex'
import particleSystem from "./moudles/particleSystem";
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    particleSystem
  },
})
