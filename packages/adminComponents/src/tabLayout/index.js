
import React, { createContext } from 'react';
import { Tabs } from 'antd';
import { Page } from '../page/';
import './index.module.less';

const { TabPane } = Tabs;

export const tabContext = createContext({
  remove: () => {}
});


export default class TabLayout extends React.Component {
  // 更新tab
  static getDerivedStateFromProps(nextProps, state) {
    const { panes } = state;
    const {
      location, content, menuMapKeys, getMenuPath
    } = nextProps;
    const path = getMenuPath(location.pathname);
    const currentMenu = menuMapKeys.get(path);
    if (currentMenu.key === state.activeKey) {
      return null;
    }
    if (state.panes.get(currentMenu.key)) {
      const it = state.panes.get(currentMenu.key);
      state.panes.set(currentMenu.key, {
        ...it,
        pathname: location.pathname
      });
      return {
        activeKey: currentMenu.key
      };
    }
    return {
      panes: panes.set(
        currentMenu.key,
        {
          ...currentMenu,
          content,
          pathname: location.pathname
        }
      ),
      activeKey: currentMenu.key
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      panes: new Map(),
      contextMenu: false
    };
    this.contextMenuLeft = 0;
    this.contextMenuTop = 0;
    this.opKey = '';
  }
  componentDidMount() {
    window.addEventListener('click', () => {
      if (this.state.contextMenu) {
        this.setState({
          contextMenu: false
        });
      }
    });
  }
  componentWillUnmount() {
    window.removeEventListener('click', () => {
      this.setState({
        contextMenu: false
      });
    });
  }
  onChange = (activeKey) => {
    const menu = this.state.panes.get(activeKey);
    this.props.push(menu.pathname);
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };
  // onContextMenu={(e)=>{this.onContextMenu(e,node);}}
  onContextMenu=(e, DefaultTabBarProps) => {
    // const { panes} = this.state;
    // console.log(DefaultTabBarProps);
    this.opKey = DefaultTabBarProps.key;
    e.preventDefault();
    this.contextMenuLeft = e.clientX;
    this.contextMenuTop = e.clientY;
    this.setState({
      contextMenu: true
    });
  }
  reLoad=(panes) => {
    // console.error(this.opKey, panes.get(this.opKey));
    // return ;
    const { getCurrentMenu } = this.props;
    panes.set(this.opKey, {
      ...panes.get(this.opKey),
      content: <div />
    });
    this.setState({
      panes
    });
    const menu = getCurrentMenu(this.opKey);
    let CurrentComponent = () => <div />;
    this.props.route.routes.forEach((item) => {
      if (menu.path === item.path) {
        CurrentComponent = item.component;
      }
    });
    setTimeout(() => {
      panes.set(this.opKey, {
        ...panes.get(this.opKey),
        content: <CurrentComponent />
      });
      this.setState({ panes });
    }, 0);
  }
  closeTab=(type) => {
    const { panes, activeKey } = this.state;
    const keyArr = [...panes.keys()];
    let deleteKey = [];
    if (type === 'left') {
      deleteKey = keyArr.slice(0, keyArr.indexOf(this.opKey));
    } else {
      deleteKey = keyArr.slice(keyArr.indexOf(this.opKey) + 1, keyArr.length + 1);
    }
    deleteKey = deleteKey.filter(key => key !== activeKey);
    deleteKey.forEach((key) => {
      panes.delete(key);
    });
    this.setState({
      panes
    });
  }
  remove=(targetKey) => {
    const { panes, activeKey } = this.state;
    const { push } = this.props;
    let nextKey = activeKey;
    panes.delete(targetKey);
    const len = panes.size;
    // let last
    if (activeKey === targetKey && len > 0) {
      nextKey = Array.from(panes.keys())[len - 1];
    } else if (len === 0) {
      return push('/');
    }
    const menu = panes.get(nextKey);
    push(menu.pathname);
    return this;
  }
  findTab=(key) => {
    return this.state.panes.get(key);
  }
  render() {
    const { panes, activeKey, contextMenu } = this.state;
    return (
      <>
        {contextMenu &&
        <div
          className="contextMenu"
          style={{ left: this.contextMenuLeft, top: this.contextMenuTop }}
        >
          <ul>
            <li onClick={() => this.reLoad(panes)}>刷新当前页</li>
            <li onClick={() => this.closeTab('left')}>关闭左侧标签</li>
            <li onClick={() => this.closeTab('right')}>关闭右侧标签</li>
          </ul>
        </div>}
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={activeKey}
          type="editable-card"
          renderTabBar={(DefaultTabBarProps, DefaultTabBar) => {
            return (
              <DefaultTabBar {...DefaultTabBarProps}>
                {
                  (node, i) => (
                    <span
                      onContextMenu={(e) => { this.onContextMenu(e, node); }}
                      key={i}
                    >
                      {node}
                    </span>
                  )
                }
              </DefaultTabBar>
            );
          }}
          onEdit={this.onEdit}
          style={{ backgroundColor: '#fff' }}
          tabBarStyle={{ margin: '0', backgroundColor: '#eee' }}
        >
          {[...panes.values()].map(pane => (
            <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
              <Page inner out={!pane.isFull}>
                <tabContext.Provider
                  value={{ remove: this.remove, find: this.findTab }}
                >
                  {pane.content}
                </tabContext.Provider>
              </Page>
            </TabPane>
          ))}
        </Tabs>
      </>
    );
  }
}
