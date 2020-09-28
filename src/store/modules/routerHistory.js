const routerHistory = {
  state: {
    routesHistory: []
  },
  mutations: {
    SET_ROUTE_HISTORY: (state, route) => {
      if (indexOf(state.routesHistory, route) === -1) {
        state.routesHistory.push(route);
      }
    },
    REMOVE_ROUTE: (state, route) => {
      remove(state.routesHistory, route);
    }
  },
  actions: {
    AddHistory({commit}, route) {
      return new Promise(resolve => {
        commit("SET_ROUTE_HISTORY", route);
        resolve(route);
      })
    },
    delHistory({commit}, route) {
      return new Promise(resolve => {
        if(route.name !== "首页"){
          commit("REMOVE_ROUTE", route);
        }
        resolve(route);
      })
    }
  }
}

/**
 *
 * @param array {Array<Route>} 数组
 * @param val {Route} 元素
 * @return {number} 元素下标 如果不包含则返回 -1
 */
export const indexOf = (array, val) => {
  if (array === undefined) {
    throw new Error("数组未定义");
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i].name === val.name) {
      return i;
    }
  }
  return -1;
}

/**
 *
 * @param {Array<Route>} array 数组
 * @param {Route} val 要删除的元素
 * @return {Array} 删除元素后的数组
 */
export const remove = (array, val) => {
  let index = indexOf(array, val);
  if (index !== -1) {
    array.splice(index, 1);
  }
  return array;
}

export const getType = (data) => {
  return Object.prototype.toString.call(data).substring(8).split(/]/)[0]
}

export const comparisonObject = (sourceObj, compareObj) => {
  if (arguments.length < 2) throw "Incorrect number of parameters";
  let sourceType = getType(sourceObj);
  if (sourceType !== getType(compareObj)) return false;
  // Not objects and arrays
  if (sourceType !== "Array" && sourceType !== "Object" && sourceType !== "Set" && sourceType !== "Map") {
    if (sourceType === "Number" && sourceObj.toString() === "NaN") {
      return compareObj.toString() === "NaN"
    }
    if (sourceType === "Date" || sourceType === "RegExp") {
      return sourceObj.toString() === compareObj.toString()
    }
    return sourceObj === compareObj
  } else if (sourceType === "Array") {
    if (sourceObj.length !== compareObj.length) return false;
    if (sourceObj.length === 0) return true;
    for (let i = 0; i < sourceObj.length; i++) {
      if (!comparisonObject(sourceObj[i], compareObj[i])) return false;
    }
  } else if (sourceType === "Object") {
    let sourceKeyList = Reflect.ownKeys(sourceObj);
    let compareKeyList = Reflect.ownKeys(compareObj);
    let key;
    if (sourceKeyList.length !== compareKeyList.length) return false;
    for (let i = 0; i < sourceKeyList.length; i++) {
      key = sourceKeyList[i];
      if (key !== compareKeyList[i]) return false;
      if (!comparisonObject(sourceObj[key], compareObj[key])) return false;
    }
  } else if (sourceType === "Set" || sourceType === "Map") {
    // 把 Set Map 转为 Array
    if (!comparisonObject(Array.from(sourceObj), Array.from(compareObj))) return false;
  }
  return true;
}

export default routerHistory;
