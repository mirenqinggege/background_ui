import {constantRoutes} from "../../router"
import {getRoutes} from "../../api/menu";
import HelloWorld from "../../components/HelloWorld";


const loadRouter = {
  state: {
    routes: [],
    addRoutes: [],
    isLoaded: false
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
    SET_LOADED: (state, flag) => {
      state.isLoaded = flag;
    }
  },
  actions: {
    GenerateRoutes({commit}) {
      return new Promise(resolve => {
        getRoutes().then(res => {
          const accessedRoutes = filterAsyncRouter(res.data);
          accessedRoutes.push({path: "*", redirect: "/404", hidden: true});
          commit("SET_ROUTES", accessedRoutes);
          resolve(accessedRoutes);
        });
      });
    },
    SetLoadStatus({commit}, payload) {
      return new Promise(resolve => {
        commit("SET_LOADED", payload);
        resolve(payload);
      });
    }
  }
}

function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === "HelloWorld") {
        route.component = HelloWorld;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve);
}

export default loadRouter
