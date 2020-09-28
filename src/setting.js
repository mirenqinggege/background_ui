import Nprogress from "nprogress"
import router from "./router"
import store from "./store"
import "nprogress/nprogress.css"

Nprogress.configure({
  easing: "ease",
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
});

const whiteList = ["/login"];

router.beforeEach((to, from, next) => {
  Nprogress.start();
  Nprogress.inc();
  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    if (store.getters.routesIsLoaded) {
      if (to.path !== '/index' && !store.getters.routesHistory.length) {
        next("/");
        return;
      }
      next();
    } else {
      store.dispatch("GenerateRoutes").then(accessRoutes => {
        router.addRoutes(accessRoutes);
        store.dispatch("SetLoadStatus", true).then(res => {
          next({...to, replace: true});
        });
      })
    }
  }
});
router.afterEach((to, from) => {
  Nprogress.done();
  if(to.path !== '/'){
    store.dispatch("AddHistory", to).then(resolve => {});
  }
});

