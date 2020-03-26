import React from 'react';
import { Tabs, Tag } from 'antd';
import regionApi from '@sunflower/core/lib/region/';
import './index.css';


const { TabPane } = Tabs;
const tabStyle = {
  marginTop: '6px',
  cursor: 'pointer'
};

const tabActiveStyle = {
  backgroundColor: '#1890ff',
  color: '#fff',
  borderColor: 'transparent'
};
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // visible: false,
      activeKey: 'province',
      provinceList: regionApi.findChildrenById(0),
      cityList: [],
      areaList: [],
      provinceId: '',
      cityId: '',
      areaId: ''
    };
  }
  handleChoice=(value, type) => {
    const { regionType, handleSelect, triggerSelect } = this.props;
    switch (type) {
      case 'province':
        if (regionType === 'province') {
          handleSelect(value.id);
          triggerSelect();
          return;
        }
        this.setState({
          cityList: regionApi.findChildrenById(value.id),
          areaList: [],
          activeKey: 'city',
          provinceId: value.id,
          cityId: '',
          areaId: ''
        });
        break;
      case 'city':
        if (regionType === 'city') {
          handleSelect(value.id);
          triggerSelect();
          return;
        }
        this.setState({
          areaList: regionApi.findChildrenById(value.id),
          activeKey: 'area',
          cityId: value.id,
          areaId: ''
        });
        break;
      case 'area':
        if (regionType === 'area') {
          handleSelect(value.id);
          triggerSelect();
          return;
        }
        this.setState({
          areaId: value.id
        });
        break;
      default:
        break;
    }
  }
  handleTabClick=(tab) => {
    this.setState({
      activeKey: tab
    });
  }
  render() {
    const {
      provinceList, cityList, areaList, activeKey, provinceId, cityId, areaId
    } = this.state;
    const { regionType } = this.props;
    return (
      <div className="cityPicker">
        <Tabs
          defaultActiveKey="province"
          activeKey={activeKey}
          size="small"
          tabBarStyle={{ marginBottom: '0' }}
          onTabClick={this.handleTabClick}
        >
          <TabPane tab="省" key="province" style={{ padding: '4px 10px 10px 10px' }}>
            {provinceList.map(value => (
              <Tag
                style={value.id === provinceId ? { ...tabStyle, ...tabActiveStyle } : tabStyle}
                key={value.id}
                onClick={() => this.handleChoice(value, 'province')}
              >{value.name}
              </Tag>
            ))}
          </TabPane>
          {(regionType === 'area' || regionType === 'city') &&
          <TabPane tab="市" key="city" style={{ padding: '4px 10px 10px 10px' }}>
            {cityList.map(value => (
              <Tag
                style={value.id === cityId ? { ...tabStyle, ...tabActiveStyle } : tabStyle}
                key={value.id}
                onClick={() => this.handleChoice(value, 'city')}
              >{value.name}
              </Tag>
            ))}
          </TabPane>
          }
          {regionType === 'area' &&
            <TabPane tab="区" key="area" style={{ padding: '4px 10px 10px 10px' }}>
              {areaList.map(value => (
                <Tag
                  style={value.id === areaId ? { ...tabStyle, ...tabActiveStyle } : tabStyle}
                  key={value.id}
                  onClick={() => this.handleChoice(value, 'area')}
                >{value.name}
                </Tag>
              ))}
            </TabPane>
          }
        </Tabs>
      </div>
    );
  }
}
export default Index;
