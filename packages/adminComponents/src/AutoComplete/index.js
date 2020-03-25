import React, { Component } from 'react';
import { TreeSelect } from 'antd';
import { utils } from '@cot/core';

// looseEqual
/**
 * 搜索组件
 */

const { TreeNode } = TreeSelect;

export class AutoCompleteComponent extends Component {
  static getDerivedStateFromProps(props, state) {
    if ('value' in props) {
      if (props.value !== state.value) {
        let target = props.value;
        if (utils.isObjStr(target)) {
          target = JSON.parse(target);
          if (!(state.dataSource && state.dataSource.length > 0)) {
            return { value: target.label };
          }
          return {
            value: target[props.showName || 'name']
          };
        }
        return { value: props.value };
      }
      return null;
    }
    return null;
  }
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      dataSource: []
    };
    this.timer = null;
    this.handleChange = this.handleChange.bind(this);
    // this.handleSearch = this.handleChange.bind(this);
  }
  componentDidMount() {
    const { preload, load, resFilter } = this.props;
    if (preload && load) {
      load().then((result) => {
        this.setState({
          dataSource: resFilter ? resFilter(result) : result
        });
      });
    }
  }
  handleChange(v) {
    const { onChange } = this.props;
    onChange(v);
  }
  handleSearch(key) {
    const { load, resFilter } = this.props;
    if (key && load) {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        load(key).then((result) => {
          window.clearTimeout(this.timer);
          this.timer = null;
          this.setState({
            dataSource: resFilter ? resFilter(result) : result
          });
        });
      }, 100);
    }
  }
  renderNode() {
    const { dataSource } = this.state;
    return dataSource.map((item) => {
      const title = <span className="search-item" key={item.value}>{item.label}</span>;
      return (<TreeNode
        value={item.value}
        title={title}
        key={item.value}
      />);
    });
  }
  render() {
    const treeNode = this.renderNode();
    return (
      <TreeSelect
        {...this.props}
        showSearch
        onChange={this.handleChange}
        onSearch={key => this.handleSearch(key)}
        filterTreeNode={() => true}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        dropdownClassName="selectAccount"
        value={this.state.value}
        allowClear
        treeDefaultExpandAll
      >
        {treeNode}
      </TreeSelect>
    );
  }
}
