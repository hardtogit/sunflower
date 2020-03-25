import React from 'react';
import Trigger from 'rc-trigger';
import classNames from 'classnames';
import regionApi from '@cot/core/lib/region';
import { Icon } from 'antd';
import Popup from './Popup';
import { ContainerContext } from '../../providerConfig';

class Index extends React.Component {
  static defaultProps={
    disabled: false, // 是否禁用
    multiple: false, // 是否多选
    regionType: 'area', // 支持 省province  市city  区area
    simple: true // 支持 simple true返回id或id组成的数组，false返回区域对象或区域对象组成的数组
  }
  constructor(props) {
    super(props);
    let initValue = props.multiple ? [] : '';
    if (props.value) {
      if (props.simple) {
        initValue = props.value;
      } else if (props.multiple) {
        props.value = props.value ? props.value : [];
        initValue = props.value.reduce((total, current) => { return [...total, current.id]; }, []);
      } else {
        initValue = props.value && props.value.id;
      }
    }
    this.state = {
      visible: false,
      value: initValue
    };
  }
  componentWillReceiveProps(nextProps) {
    const { multiple, simple } = this.props;
    if ('value' in nextProps) {
      if (simple) {
        this.setState({
          value: nextProps.value
        });
      } else if (multiple) {
        nextProps.value = nextProps.value ? nextProps.value : [];
        this.setState({
          value: nextProps.value.reduce((total, current) => { return [...total, current.id]; }, [])
        });
      } else {
        this.setState({
          value: nextProps.value && nextProps.value.id
        });
      }
    }
  }
  handleRemove=(id) => {
    const { value } = this.state;
    const { onChange, simple, regionType } = this.props;
    if (Array.isArray(value)) {
      this.setState({
        value: value.filter((item) => { return item !== id; })
      }, () => {
        if (onChange) {
          if (simple) {
            onChange(this.state.value);
          } else {
            onChange(regionApi.formatRegion(this.state.value, regionType));
          }
        }
      });
    } else {
      this.setState({
        value: ''
      }, () => {
        if (onChange) {
          if (simple) {
            onChange(this.state.value);
          } else {
            onChange(regionApi.formatRegion(this.state.value, regionType));
          }
        }
      });
    }
  }
  handleSelect=(id) => {
    const {
      multiple, onChange, simple, regionType, onSelect
    } = this.props;
    if (multiple) {
      this.setState(({ value }) => ({
        value: [...value, id]
      }
      ), () => {
        if (onChange) {
          if (simple) {
            onChange(this.state.value);
          } else {
            onChange(regionApi.formatRegion(this.state.value, regionType));
          }
        }
        if (onSelect) {
          onSelect(regionApi.formatRegion(this.state.value, regionType));
        }
      });
    } else {
      this.setState({
        value: id
      }, () => {
        if (onChange) {
          if (simple) {
            onChange(this.state.value);
          } else {
            onChange(regionApi.formatRegion(this.state.value, regionType));
          }
        }
      });
    }
  }
  triggerSelect=() => {
    if (this.props.disabled) {
      return;
    }
    const { visible } = this.state;
    this.setState({
      visible: !visible
    });
  }
  handleDropdownVisibleChange = (open) => {
    if (this.props.disabled) {
      return;
    }
    this.setState({ visible: open });
  }
  render() {
    const { visible, value } = this.state;
    const { disabled, regionType } = this.props;
    let regionData = regionApi.formatRegion(value, regionType);
    if (!Array.isArray(regionData)) {
      if (regionData) {
        regionData = [regionData];
      } else {
        regionData = [];
      }
    }
    return (
      <ContainerContext.Consumer >
        {fn => (
          <Trigger
            {...this.props}
            action={['click']}
            popup={<Popup
              {...this.props}
              triggerSelect={this.triggerSelect}
              handleSelect={this.handleSelect}
            />}
            popupVisible={visible}
            destroyPopupOnHide
            // getPopupContainer={fn ||()=>{return document.getElementsByTagName('body')[0];}}
            popupStyle={{ zIndex: 1050, width: '300px' }}
            onPopupVisibleChange={this.handleDropdownVisibleChange}
            popupAlign={{
              points: ['tl', 'bl'],
              offset: [0, 3]
            }}
          >
            <div onClick={this.triggerSelect} className={classNames(['ant-select', disabled ? 'ant-select-disabled' : 'ant-select-enabled'])} style={{ width: '100%' }}>
              <div className="ant-select-selection ant-select-selection--multiple">
                <div className="ant-select-selection__rendered">
                  {(!value || value.length === 0) && <div className="ant-select-selection__placeholder" >
                    请选择地址
                                                     </div>}
                  <ul >
                    {
                      regionData.map((value, index) => {
                        return (
                          <li key={index} className="ant-select-selection__choice" >
                            <div className="ant-select-selection__choice__content">{value.name}</div>
                            <div className="ant-select-selection__choice__remove" onClick={(e) => { e.stopPropagation(); this.handleRemove(value.id); }}>
                              <Icon type="close" />
                            </div>
                          </li>
                        );
                      })
                    }
                  </ul>
                </div>
              </div>

            </div>
          </Trigger>)}
      </ContainerContext.Consumer>
    );
  }
}
Index.formatRegion = regionApi.formatRegion;
export default Index;
