/**
 * 组件控制器
 */
import React from 'react';
import { Form, Col, Row, Button, Icon } from 'antd';
import { nextTick } from '@sunflower/core/lib/utils/nextTick';

const { SyncHook,SyncBailHook,SyncWaterfallHook,AsyncSeriesHook } =require("tapable");
const FormItem = Form.Item;
const itemLayout = {
  itemCol: {
    xxl:{
      span:6,
    },
    xl:{
      span:8
    },
    md:{
      span:12
    }
  },
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};
/**
 * 表单构建器
 */
export class Compiler {
  constructor(options = {}) {
    this.hooks = {
      // 配置修改可以传递
      config: new SyncWaterfallHook(['fields']),
      install: new SyncHook(['fieldTypes']),
      make: new SyncHook(['elements', 'btnElements']),
      layout: new SyncBailHook(['formEles', 'elements', 'btns']),
      change: new SyncWaterfallHook(['prop', 'val', 'values']),
      validator: new AsyncSeriesHook(['form']),
      submit: new SyncWaterfallHook(['source', 'values']),
      rev: new SyncHook(['values']),
      more: new SyncHook(['type'])
    };
    // 格式化配置参数
    this.fields = options.fields;
    this.btns = options.btns || [];
    this.fieldTypes = {};
    this.plugins = options.plugins || [];
    this.elements = [];
    this.btnElements = [];
    this.formEles = null;
    this.form = options.form;
    this.num = options.num;
    this.more = options.more;
    this.moreType = true;
    this.btnColLayout = options.btnColLayout;
    this.layoutFn = options.layoutFn || (r => r);
  }
  install() {
    if (Array.isArray(this.plugins) && this.plugins.length > 0) {
      this.plugins.forEach((plugins) => {
        if (typeof plugins === 'function') {
          plugins(this);
        } else if (typeof plugins === 'object') {
          plugins.apply && plugins.apply(this);
        }
      });
    }
    this.fields = this.hooks.config.call(this.fields);
    // this.num || ( this.num= this.fields.length);
    this.hooks.install.call(this.fieldTypes);
  }
  handle(source, noValidator) {
    // 所有的按钮提交必须走表单验证
    // 重置 不走表单验证
    if (source === 'Reset' || noValidator) {
      source === 'Reset' && this.form.resetFields();
      this.hooks.submit.call(source, this.form.getFieldsValue());
      return;
    }
    this.hooks.validator.callAsync(this.form, (err) => {
      if (!err) {
        this.hooks.submit.call(source, this.form.getFieldsValue());
      }
    });
  }
  layout() {
    // 最初的元素集合
    const { elements } = this;
    console.log(elements)
    const { btnElements } = this;

    const { getFieldDecorator } = this.form;
    const dfStyle = { marginLeft: '9px' };
    const btnColLayout = this.btnColLayout || { ...itemLayout.itemCol, ...elements[0].field.ColLayout };

    // let visDom;
    if (elements.length) {
      this.formEles = (
        <Form>
        <Row>
          {(!(this.more && this.moreType) ? elements : elements.slice(0, this.num))
            .map(({ ele, field }) => {
              const colLayout = { ...itemLayout.itemCol, ...field.ColLayout };
              const span = parseInt(24 / ele.length, 10);
              const layoutFn = field.layoutFn || this.layoutFn;

              return (
                <Col {...colLayout} key={Array.isArray(field.key) ? field.key.join(',') : field.key}>
                  {!Array.isArray(ele) ?
                    <FormItem label={field.name} {...layoutFn(itemLayout)}>
                      {
                        getFieldDecorator(field.key, {
                          ...field.formItemProps||{}
                        })(ele)
                      }
                    </FormItem>
                    :
                    <FormItem label={field.name} {...layoutFn(itemLayout)}>
                      <Row>
                        {
                          ele.map((it, idx) => {
                            return (
                              <Col span={span} key={field.key[idx]}>
                                {
                                  getFieldDecorator(field.key[idx], {
                                    initialValue: field.initialValue[idx] || undefined,
                                    rules: field.rules[idx] || []
                                  })(it)
                                }
                              </Col>
                            );
                          })
                        }
                      </Row>
                    </FormItem>
                  }
                </Col>);
            })
          }
          {this.more &&
            <Col span={24}>
              <div style={{ textAlign: 'right', paddingRight: 40 }}>
                <Button
                  type="link"
                  onClick={() => this.hooks.more.call(this.moreType)}
                >
                  <Icon type={this.moreType ? 'down' : 'up'} /> {this.moreType ? '更多条件' : '收起'}
                </Button>
              </div>
            </Col>
          }
          <Col {...btnColLayout}>
            <Row {...btnColLayout && btnColLayout.rows}>
              <Col
                offset={(btnColLayout.offSetSpan||btnColLayout.offSetSpan===0)?btnColLayout.offSetSpan:itemLayout.labelCol.span}
                style={{ marginBottom: '24px' }}
                {...btnColLayout && btnColLayout.cols}
              >
                {
                // btns
                  btnElements.map(({
                    type, style, source, title, noValidator
                  }, idx) => {
                    const btnPros = {
                      type,
                      onClick: () => this.handle(source, noValidator),
                      style
                    };
                    return <Button {...btnPros} style={{ ...(idx !== 0 ? dfStyle : {}), ...style }} key={source}>{title}</Button>;
                  })
                }
              </Col>
            </Row>
          </Col>
        </Row>
        </Form>);
    }
    // 布局交给用户自己去整理
    const layout = this.hooks.layout.call(this.formEles, this.elements, this.btnElements);
    return layout || this.formEles;
  }
  make() {
    const { fieldTypes } = this;
    const { fields } = this;
    const { btns } = this;
    if (fields.length) {
      fields.forEach((field) => {
        field.onChange = (args) => {
          nextTick(() => {
            this.hooks.change.call(field.key, args, this.form.getFieldsValue());
          });
        };
        console.log(fieldTypes)
        this.elements.push({
          ele: Array.isArray(field.type) ? field.type.map((type, idx) => {
            return fieldTypes[type]({ ...field, placeholder: field.placeholders[idx] });
          }) : fieldTypes[field.type](field),
          native: fieldTypes[field.type],
          field,
          group: field.group
        });
      });
    }
    if (btns.length) {
      btns.forEach(({
        type, source, style, title, noValidator
      }) => {
        this.btnElements.push({
          type,
          source,
          style,
          title,
          noValidator
        });
      });
    }
    this.hooks.make.call(this.elements, this.btnElements);
  }
  run() {
    return this.layout();
  }
}
