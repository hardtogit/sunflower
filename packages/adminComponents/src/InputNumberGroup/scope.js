import React from 'react';
import { Col } from 'antd';
import InputNumberGroup from './index';

class Index extends React.Component {
  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      min: value.min || undefined,
      max: value.max || undefined
    };
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ ...value });
    }
  }
  handleMinChange = (min) => {
    if (!('value' in this.props)) {
      this.setState({ min });
    }
    this.triggerChange({ min });
  };
  handleMaxChange = (max) => {
    if (!('value' in this.props)) {
      this.setState({ max });
    }
    this.triggerChange({ max });
  };
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...{ min: this.state.min, max: this.state.max }, ...changedValue });
    }
  };
  render() {
    const { min, max } = this.state;
    return (
      <div>
        <Col span={10}>
          <InputNumberGroup {...this.props} value={min} onChange={this.handleMinChange} addonAfter={this.props.unit} />
        </Col>
        <Col span={4} style={{ textAlign: 'center' }}>~</Col>
        <Col span={10}>
          <InputNumberGroup {...this.props} value={max} onChange={this.handleMaxChange} addonAfter={this.props.unit} />
        </Col>
      </div>
    );
  }
}
export default Index;
