import vue from 'vue'
import Vuex from 'vuex'
import loadRouter from "./modules/loadRouter"
import login from './modules/login'
import getters from './getters'
import routerHistory from "./modules/routerHistory";

vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    loadRouter,
    login,
    routerHistory
  },
  getters
});

export default store
