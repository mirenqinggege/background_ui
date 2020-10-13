import vue from 'vue'
import Vuex from 'vuex'
import loadRouter from "./modules/loadRouter"
import login from './modules/login'
import getters from './getters'
import routerHistory from "./modules/routerHistory";
import cacheViews from "./modules/cacheViews";

vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    loadRouter,
    login,
    routerHistory,
    cacheViews
  },
  getters
});

export default store
