const getters = {
  routes: state => state.loadRouter.routes,
  isLogin: state => state.login.isLogin,
  routesIsLoaded: state => state.loadRouter.isLoaded,
  routesHistory: state => state.routerHistory.routesHistory,
  cachedTags: state => state.cacheViews.cachedTags,
  cachedViews: state => state.cacheViews.cachedViews
}

export default getters
