## Model 工具类

Model工具类在`dva model`的基础上，封装更多实用的功能.

Model暴露了两个方法`extend`和`assign`，它们两个使用方式一致，但是`assign`是在`extend`上进一步的封装，所以约定的内容更多一点 
下面我们先介绍extend，使用方式如下：
```
Model.extend({
  state: {},
  subscriptions: {},
  effects: {},
  reducers: {},
})
```

## extend

主要作用是继承并扩展默认的`model`配置, 
参数:

- parent: 自定义model，如果只传一个参数，则继承默认的`model`
- properties: 属性集


下面分别详细说明下`extend`函数对`model`中`state`、`subscriptions`、`effects`、`reducers`的扩展.


### state扩展

添加`loading state`, 默认为空对象

```javascript

state: {
  loading: {}
}

```

### subsciptions扩展

为方便对`path`的监听，在`model`的subscriptions配置函数参数中，额外添加了扩展方法`listen`    
`listen`函数参数如下：

- pathReg
  需要监听的pathName
- action
  action既可以是 redux action,也可以是一个回调函数
  如果`action`是函数，调用时，将传入{ ...location, params }作为其参数
  params参数为类数组，既可以根据关键字顺序来获取对应的值，也可以根据关键字来获取对应的值

listen函数也支持同时对多个pathname的监听，传入的参数需要为`{pathReg: action}`健值对的对象.

listen函数可以传入两个回调，分别表示进入path时和离开path时。

```javascript
import { Model } from 'carno/addons';
import { qs } from 'carno/third-party';

export default Model.extend({

  namespace: 'user',

  subscriptions: {
    setupSubscriber({ dispatch, listen }) {
      
      // action为 redux action
      listen('/user/list', { type: 'fetchUsers'});

      // action为 回调函数
      listen('/user/query', ({ query }) => {
        dispatch({
          type: 'fetchUser',
          payload: query,
        })
      });

      // 参数处理
      listen('/user/:userId/project/:proojectId', ({ params }) => {
        dispatch({
          type: 'fetchUsers',
          payload: {
            userId: params[0],
            projectId: params[1]
          }
        });
      });

      // 支持对多个path的监听
      listen({
        '/user/list': ({ query, params }) => {},
        '/user/query': ({ query, params }) => {},
      });

      // 在之前的用法之上，传入第三个参数表示离开path的回调
      listen('/user/list', { type: 'fetchUsers'}, { type: 'clearUsers'});

      // 同上也支持对多个path的监听
      listen({
        '/user/list': [({ query, params }) => { console.log('enter'); }, ({ query, params }) => { console.log('leave'); }],
        '/user/query': [({ query, params }) => { console.log('enter'); }, ({ query, params }) => { console.log('leave'); }],
      });
  }
})


```


### effects扩展

`effects`扩展主要如下：

**put.sync**
同步put方法，参数与put一致，主要用于同步调用其他effect, 需使用`put.sync`接口，则需要在项目`src/index.js`文件中，使用`store`接口缓存dva app对象

```javascript
// src/index.js
import { store } from 'carno/utils';

const app = store(dva({
  onError(e) {
    console.log(e);
  }
}));

// model/xx.js
Model.extend({
  state: {},
  effects: {
    * fetchUsers({ payload }, { put, select, call }) {
      // 同步执行，保证先执行完fetchDepartments，再执行call
      yield put.sync({ type: 'department/fetchDepartments', payload: { userId: 1 } });
      const { departments } = yield select((state) => state.department);
      const users = yeild call(services.user.getList);
      yield put({ type: 'updateUserDeparts', payload: { users, departments }})
    }
  });

// model/department.js
Model.extend({
  namespace: 'department',
  state: {},
  effects: {
    * fetchDepartments({ payload }, { put, call }) {
      const departmentList = yeild call(services.user.fetchDepartments);
      // 当其他model同步调用当前model的effect,在更新当前model中的state时，需明确指定namespace
      yiele put({ type: 'department/updateState', payload: { departmentList } });
    }
  });
```


**update**
实际开发中，如果需要对第一级的`model`数据更改，又不想添加`reducer`, 则可以使用`update`直接更新数据(底层通过`updateState`来实现)，

```javascript

// model/xx.js
Model.extend({
  state: {},
  effects: {
    * fetchUsers({ payload }, {call, update}) {
      const users = yeild call(services.user.getList);
      yield update({ users });
    }
  });
```

**call**

实际开发场景中，`call`一般应用在调用后台接口，往往需要处理加载状态以及业务消息，我们扩展`saga`原生的`call`方法，配合`withLoading`以及`withMessage`，以更方便的实现消息以及状态处理.

`withloadng`配置参数如下:
- service http请求
- key 嵌套key
- successMsg 调用成功后的反馈信息
- errorMsg 调用失败后的反馈信息
- withDone 设置为true之后，对应的loading属性为Boolean对象，并且包含done属性(true－调用成功，false-调用失败), 如果传递给组件的loading prop则需要转化为boolean值(valueOf()), 如果要与HModal配置，则必须设置withDone为true

```javascript
withLoading(service, key);
withLoading(service, key, '成功', '失败', true);
// 如果第二个参数传入的是对象，则对象包含service之后的参数配置
withLoading(service, { key: 'confirm', successMsg: '成功', errorMsg: '失败', withDone: true });
```

`withConfirmLoading`配置参数如下:

- service http请求
- successMsg 调用成功后的反馈信息
- errorMsg 调用失败后的反馈信息
- withDone 设置为true之后，对应的loading属性为Boolean对象，并且包含done属性(true－调用成功，false-调用失败), 如果传递给组件的loading prop则需要转化为boolean值(valueOf()), 如果要与HModal配置，则必须设置withDone为true

```javascript
withConfirmLoading(service, '保存成功', '保存失败', true);
// 这两种写法等价
withLoading(service, 'confirm', '保存成功', '保存失败', true);
```

`withSpinning`配置参数如下:

- service http请求
- successMsg 调用成功后的反馈信息
- errorMsg 调用失败后的反馈信息
- withDone 设置为true之后，对应的loading属性为Boolean对象，并且包含done属性(true－调用成功，false-调用失败), 如果传递给组件的loading prop则需要转化为boolean值(valueOf()), 如果要与HModal配置，则必须设置withDone为true

```javascript
withSpinning(service, '刷新成功', '刷新失败');
// 这两种写法等价
withLoading(service, 'spinning', '保存成功', '保存失败');
```

`withMessage`配置参数如下:

- successMsg
- errorMsg

```javascript
withMessage(service, '保存成功', '保存失败');
```

**localizeState**

部分`state`需要本地化地，并且能够在下一次使用的时候自动使用上一次记录的值，比如：记录用户习惯

**扩展select**

扩展默认的`select`方法，同之前的用法，在回调函数里传入第二个参数即表示要获取的本地化的state

综合示例如下:
```javascript
import { Model } from 'carno/addons';
import { withLoading, withConfirmLoading, withSpinning } from 'carno/utils';

Model.extend({
  state: {
    loading: {
      list: false,
      confirm: false,
      spinning: false,
    },
  },
  effects: {
    * fetchUsers({ payload }, { put, select, call }) {

      // 介绍 withLoading 用法
      // 发送请求前，显示loading状态，完成后结束loading状态.如果请求成功则提示加载用户成功,失败则提示
      const getList = withLoading(service.user.getList, { key: 'list', successMsg: '加载用户成功', errorMsg: '加载用户失败' });
      // const getList = withLoading(service.user.getList, { key: 'list', successMsg:'加载用户成功',errorMsg:'加载用户失败', withDone: true });
      const users = yeild call(getList, { departId: 12 });

      // 对比 withConfirmLoading 用法
      const saveUser = withLoading(service.user.save, 'confirm', '添加用户成功');
      const saveUser = withConfirmLoading(service.user.save, '添加用户成功');

      // 对比 withSpinning 用法
      withLoading(service.user.getList, 'spinning', '刷新成功');
      withSpinning(service.user.getList, '刷新成功');

      // 介绍 withMessage 用法
      const getList = withMessage(service.user.getList, '加载用户成功', '加载用户失败');
      // 仅处理成功/失败的消息提示
      const users = yeild call(getList, userId, deptId);

      // 更新当前model的state
      yield update({ users })
      // update 方法等同于以下方法
      yield put({
        type: 'updateState',
        payload: {
          users
        }
      });

      // 同步put方法，put.sync只支持dispatch effect，不能用于dipatch reducer
      yield put.sync({ type: 'online/fetchList' });
      yield update({ sync: true }); // 此行代码会在 fetchList中代码快执行完毕后再执行

      // 将users本地化，并且下一次Model.state初始化的能给使用这个数据
      yield localize({ users });
      // 获取本地化的users
      const { state, localState } = yield select((state, localState) => ({ state, localState }));
    }
  }
})

```

### reducer扩展

主要提供如下默认的reducer方法:

- showLoading 将对应key的loading属性设置为true
- hideLoading 将对应key的loading属性设置为false
- updateState 直接更新state
- resetState 重置state
- clearLocalState 清除本地化state
- resetLocalState 重置本地化state

**showLoading/hideLoading**

`loading`相关的`reducer`支持嵌套数据，主要作用是配合`call`、`withLoading`.

```javascript
yield put({ type: 'showLoading', payload: { key: 'spin' } }) // 执行后model中的state为: { loading: { spin: true, ... }};
yield put({ type: 'hideLoading', payload: { key: 'spin' } }) // 执行后model中的state为: { loading: { spin: false, ... }};
```

**resetState**

用户登出以及某些页面切换的时候，需要更新model的数据，提供`resetState reducer`来方便处理这些操作.

用户通过面包屑跳转到父级路由时，往往希望保留父路由的`state`。配合`HLayout`组件一起使用时,`resetState`能自动检测是否由面包屑触发的路由跳转，如果是则会保留当前`model`的`state`数据（visible、loading数据除外）
如果您需要强制更新所有state数据，则可以传递force参数.

```javascript
dispatch({ type: 'resetState', payload: { force: true }});
```

**clearLocalState**

由于`state`是通过`localStorage`存储到本地的，所以提供`clearLocalState`用于清除本地存储state

```javascript
dispatch({ type: 'clearLocalState', payload: { force: true } });
```

**resetLocalState**

略微勉强，没有想好用户场景，算是与`resetState`对应吧

```javascript
dispatch({ type: 'resetLocalState', payload: { force: true } });
```

⚠️：以上本地化操作，只操作本地化`state`，要更新`state`需要用户手动调用`updateState`

## assign
assign是在extend的基础上封装的，保证了用法一致，内置了更多的东西，相当于是一个简化版本的extend

使用方式如下：
```javascript
Model.assign({
  state: {},
  subscriptions: {},
  effects: {},
  reducers: {},
})
```

为了更简洁的使用，需要大家了解下面这些配置和约定

### state
在state中我们内置了下面这些属性
```javascript
state: {
  tc: 0,
  datas: [],
  detail: {},
  search: { pn: 1, ps: 10 },
  loading: { list: false, confirm: false, submit: false, spin: false },
},
```
⚠️注意：当某个路由监听触发的之后，还会将params合并到state中，query合并到state.search中，如：
有params的情况
```javascript
// 定义路由
/deliveryManage/:id/create
// 访问地址
/deliveryManage/12/create
// 获取到的state
console.log(state.id) // 12
```
有query的情况
```javascript
// 定义search
{
  name: '',
  phone: '',
}
// 访问地址
/deliveryManage?phone=18980469321&isTrue=1
// 获取到的state，因为isTrue不属于search的key值，所以没有合并到search中
console.log(state.search) // { pn: 1, ps: 10, name: '', phone: '18980469321' }
```

### subscriptions
为了和Model.extend的subscriptions属性使用一致，这里同步扩展了listen的3种使用方式，如下：
```javascript
// 支持传3个参数
listen(path, listener, force)
// 支持第二个参数为对象
listen(path, { type: 'getList' }, force)
// 支持传2个参数，第一个参数是一个对象，用来处理多个path在同一个model中使用的情况
listen({ path1: listener, path2: listener }, force)
```
这里可以看出使用方式和以前几乎相同，不同的地方在于，最后一个参数force，当它为 true的时候，将不对listeners做扩展，方便用户自定义处理特殊需求

这里还扩展了listen中的listener方法
- 对params和query进行预处理，有在介绍state的时候提到，是将params的数据放在了state中，将query和搜索相关的数据放在了search中
- 这里获取到的params是一个对象，和Model.extend获取到的params有点不同
- 默认会执行resetState方法，重置当前model中所有数据

### effects
内置goBack方法，支持传入path，指定要跳转的路径
```javascript
* goBack({ payload: path }, { put }) {
  if (path) {
    yield put(routerRedux.push(path));
  } else {
    yield put(routerRedux.goBack());
  }
}
```
 
### reducers
内置updateSearch和resetSearch方法
```javascript
updateSearch(state, { payload }) {
  return {
    ...state,
    search: { ...state.search, ...payload },
  };
},
resetSearch(state, { payload }) {
  return {
    ...state,
    search: { ...state.search, ...initialSearch },
  };
},
```


