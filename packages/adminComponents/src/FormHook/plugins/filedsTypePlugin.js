import React from 'react';
import { Input, InputNumber, DatePicker, Select } from 'antd';
// import { nextTick } from '@/utils/nextTick';

const { Option } = Select;

function getPlaceholder({ type, name }) {
  let dot = '';
  switch (type) {
    case 'select':
    case 'date':
    case 'enum':
    case 'dateRange':
    default:
      dot = '输入';
      break;
  }
  return `请${dot}${name}`;
}

export class elementTypePlugin {
  constructor() {
    this.options = {
      text: field => <Input placeholder={getPlaceholder(field)} {...field.fieldProps} />,
      textarea: field => <Input.TextArea placeholder={getPlaceholder(field)} {...field.fieldProps} />,
      number: field => <InputNumber placeholder={getPlaceholder(field)} style={{ width: '100%' }} {...field.fieldProps} />,
      dateRange: field => <DatePicker.RangePicker {...field.fieldProps} />,
      date: field => <DatePicker placeholder={getPlaceholder(field)} {...field.fieldProps} />,
      month: field => <DatePicker.MonthPicker placeholder={getPlaceholder(field)} {...field.fieldProps} />,
      enum: (field) => {
        const options = [];
        field.enums && Object.keys(field.enums).forEach((key) => {
          if (field.enums[key] === '全部') {
            options.unshift(<Option value={key} key={key}> {field.enums[key]}</Option>);
          } else {
            options.push(<Option value={key} key={key} > {field.enums[key]}</Option>);
          }
        });
        return <Select style={{ width: '100%' }} placeholder={getPlaceholder(field)} {...field.fieldProps}>{options}</Select>;
      }
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
