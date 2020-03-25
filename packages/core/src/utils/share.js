// import cloneDeep from 'clone-deep';

/**
 * 日期格式化方法
 */
export function formatDate(dt, patter) {
  let format = patter;
  let date = dt;
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${date.getFullYear()}`
      .substr(4 - RegExp.$1.length));
  }

  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ?
        o[k] : (`00${o[k]}`).substr(`${o[k]}`.length));
    }
  });
  return format;
}


/**
 * @param  name {String}
 * @return  {String}
 */
export function queryURL(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r !== null) return decodeURI(r[2]);
  return null;
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
export function queryArray(array, key, keyAlias = 'key') {
  if (!(array instanceof Array)) {
    return null;
  }
  const item = array.filter(_ => _[keyAlias] === key);
  if (item.length) {
    return item[0];
  }
  return null;
}
/**
 *
 * @param {*} array
 */
export function getRealArray() {
  const result = [];
  return function deep(array, dp) {
    if (result.length > 0 && !dp) return result;
    for (let i = 0; i < array.length; i += 1) {
      result.push(array[i]);
      if (array[i].children && array[i].children.length > 0) {
        deep(array[i].children, true);
      }
    }

    return result;
  };
}
const cacheArray = getRealArray();
export function queryDeepArray(array, key, keyAlias) {
  const searchArray = cacheArray(array);
  return queryArray(searchArray, key, keyAlias);
}


/**
 * 判断是否是对象
 * @param {*} obj obj
 */
export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

/**
 *
 * @param {*} a 对象深比较A
 * @param {*} b 对象深比较A
 */
export function looseEqual(a, b) {
  if (a === b) return true;
  const isObjectA = isObject(a);
  const isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a);
      const isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => looseEqual(e, b[i]));
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(key => looseEqual(a[key], b[key]));
      }
      /* istanbul ignore next */
      return false;
    } catch (e) {
      /* istanbul ignore next */
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}
// 保留两位小数，四舍五入
export const toPercent = number => Math.round(number * 100) / 100;

/* eslint-disable */
// 生成随机字符串
export function createUUID() {
    return 'xy-4yx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 || 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// form 参数 转化为Obj
export function urlStrToObj(url) {
    if (!url) return;
    //const urlStr = decodeURIComponent(url);
    return url.split('&').map(it => {
        const [key, value] = it.split('=');
        return {
            [key]: decodeURIComponent(value)
        }
    }).reduce((p, next) => {
        Object.assign(p, next);
        return p;
    }, {});
}

// 将对象转成字符串
export function objToUrlStr(obj) {
    if (!obj) return;
    return Object.keys(obj).map(key => {
        return `${key}=${encodeURIComponent(obj[key])}`
    }).join('&');
}

// 深度去除空格
export function deepTrim(param) {
    param && isObject(param) && Object.keys(param).forEach(key => {
        //  const value = ;
        if (!!param[key]) {
            if (typeof param[key] === 'string') {
                param[key] = param[key].trim();
                //数组方式忽略
            } else if (typeof param[key] === 'object' && !Array.isArray(param[key])) {
                deepTrim(param[key])
            }
        }
    });
    return param;
}

/**
 * 数组转化成tree
 * @param {*} data
 */
export function dataToTreeV2(data) {
    return new Promise(resolve => {
        groupBy(data, (item, callback) => {
            callback(null, item.parentId);
        }, (err, result) => {
            resolve(loopTransform(result, 0, {}));
        })
    })
}

/**
 * 遍历数组转化成树
 * @param {*} data
 * @param {*} startIndex
 * @param {*} result
 */
function loopTransform(data, startIndex, result) {
    const items = data[startIndex];
    Array.isArray(items) && items.length > 0 &&
        items.forEach(it => {
            const item = {
                ...it
            };
            item.label = it.name;
            item.value = `${it.id}`;
            item.key = `${it.id}`;
            if (Array.isArray(result.children)) {
                result.children.push(item);
            } else {
                result.children = [item];
            }
            if (Array.isArray(data[it.id])) {
                loopTransform(data, it.id, item);
            }
        });
    return result.children;
}

export function convert(list) {
    const res = []
    const map = list.reduce((res, v) => (res[v.id] = v, res), {})
    for (const item of list) {
        if (item.parentId === 0) {
            res.push(item)
            continue
        }
        if (item.parentId in map) {
            const parent = map[item.parentId]
            parent.children = parent.children || []
            parent.children.push(item)
        }
    }
    return res
}


export const treeToArr = (treeData) => {
    const arr = []
    const recursion = (treeData, parentKey) => {
      treeData.forEach((value) => {
        if (value.children) {
          arr.push({ ...value, parentKey: [...parentKey] })
          recursion(value.children, [...parentKey, value.key])
        } else {
          arr.push({ ...value, parentKey: [...parentKey] })
        }
      })
    }
    recursion(treeData, [])
    return arr
  }

  export function openWindowSafe(url) {
    const aele = document.createElement('a');
    const $url = `${location.origin}${location.pathname}${location.search}#${url}`;
    aele.href = $url;
    Object.assign(aele, {
      target: '_blank',
      rel: 'noopener'
    });
    // aele.target = '_blank',
    // aele.rel = 'noopener';
    aele.style.visibility = 'hidden';
    document.body.appendChild(aele);
    aele.click();
    nextTick(() => {
      aele.remove();
    });
  }
  export function isObjStr(str) {
    return /^\{.*\}$/g.test(str);
  }

  /**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export function arrayToTree(array, id = 'id', pid = 'pid', children = 'children') {
  return convert(array);
}