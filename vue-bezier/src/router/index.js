import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import controller from "@/store/moudles/controller";
import particleSystem from "@/store/moudles/particleSystem";
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    particleSystem
  },
})
