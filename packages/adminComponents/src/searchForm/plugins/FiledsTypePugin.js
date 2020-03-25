import React from 'react';
import { Input, InputNumber, DatePicker, Select } from 'antd';
import CityPicker from '../../picker/city';
// import { nextTick } from '@/utils/nextTick';

const { Option } = Select;

function getPlaceholder({ type, name }) {
  let dot = '';
  switch (type) {
    case 'select':
    case 'date':
    case 'enum':
    case 'dateRange':
    case 'cityPicker':
      dot = '选择';
      break;
    default:
      dot = '输入';
      break;
  }
  return `请${dot}${name}`;
}

export class ElementTypePugin {
  constructor() {
    this.options = {
      text: field => <Input placeholder={getPlaceholder(field)} {...field} />,
      textarea: field => <Input.TextArea placeholder={getPlaceholder(field)} {...field} />,
      number: field => <InputNumber placeholder={getPlaceholder(field)} style={{ width: '100%' }} {...field} />,
      dateRange: field => <DatePicker.RangePicker {...field} />,
      date: field => <DatePicker placeholder={getPlaceholder(field)} {...field} />,
      month: field => <DatePicker.MonthPicker placeholder={getPlaceholder(field)} {...field} />,
      enum: (field) => {
        const options = [];
        field.enums && Object.keys(field.enums).forEach((key) => {
          if (field.enums[key] === '全部') {
            options.unshift(<Option value={key} key={key}> {field.enums[key]}</Option>);
          } else {
            options.push(<Option value={key} key={key} > {field.enums[key]}</Option>);
          }
        });
        return <Select style={{ width: '100%' }} placeholder={getPlaceholder(field)} {...field}>{options}</Select>;
      },
      cityPicker: field => <CityPicker placeholder={getPlaceholder(field)} {...field} />,
    };
  }
  apply(compiler) {
    compiler.hooks.install.tap('ElementTypePugin', (fieldsTypes) => {
      Object.keys(this.options).forEach((type) => {
        fieldsTypes[type] = (field) => {
          // 自动添加onChange监听 触发change hook 帮助联动性处理
          const fieldCopy = { ...field };
          delete fieldCopy.ColLayout;
          return this.options[type](fieldCopy);
        };
      });
    });
  }
}
