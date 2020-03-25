import React, { Component } from 'react';
import { AutoComplete, Input } from 'antd';
// import Input from 'antd-mobile/lib/input-item/Input';

const Option = AutoComplete.Option;
/**
 * 选择可搜索
 */
export default class AutoCompleteExtra extends Component {
  static getDerivedStateFromProps(props, state) {
    if ('value' in props) {
      if (props.value !== state.value) {
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
    const { load, resFilter, linktype} = this.props;
    if (key && load) {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        load(key, linktype).then((result) => {
          window.clearTimeout(this.timer);
          this.timer = null;
          this.setState({
            dataSource: resFilter ? resFilter(result) : result
          });
        });
      }, 100);
    }
  }
  render() {
    const { dataSource } = this.state;
    // console.log('data', dataSource);
    const aProps = {
      ...this.props,
      onSearch: (keyword) => {
        this.handleSearch(keyword);
      },
      dataSource: dataSource.map(({ key, label }) => (
        <Option key={key} value={key}>{label}</Option>
      )),
      style: { width: '100%' },
      onChange: (v) => this.handleChange(v)
    };
    return (<AutoComplete {...aProps} >

      <Input {...aProps.input} />
    </AutoComplete>);
  }
}
