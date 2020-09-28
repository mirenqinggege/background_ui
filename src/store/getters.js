const getters = {
  routes: state => state.loadRouter.routes,
  isLogin: state => state.login.isLogin,
  routesIsLoaded: state => state.loadRouter.isLoaded,
  routesHistory: state => state.routerHistory.routesHistory
}

export default getters
