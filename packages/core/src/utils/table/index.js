import { default as fieldTypes, combineTypes } from './fieldTypes';

/*
 * 获取column中显示的filedValue
 */
function getFieldValue(value, field = {}) {
  let type = field.type || (field.enums && 'enum');
  type = fieldTypes.hasOwnProperty(type) ? type : 'normal';
  return fieldTypes[type](value, field);
}

/*
 * 获取表格column数组
 * 示例:
 * const columns = createColumns(fields,['name','author'],{ name: { render: ()=>{} }}).values();
 * const columns = createColumns(fields).excludes(['id','desc']).values();
 * const columns = createColumns(fields).pick(['name','author','openTime']).enhance({name:{ render: ()=>{} }}).values();
 * @param originField 原始fields
 * @param fieldKeys 需要包含的字段keys
 * @param extraFields 扩展的fields
 * @result 链式写法，返回链式对象(包含pick,excludes,enhance,values方法), 需要调用values返回最终的数据
 */
function createColumns(fields, fieldKeys, extraFields) {
  const chain = {};
  let columns = [];

  const transform = _fields =>
    _fields.map(field => {
      let { dataIndex, title, key, name, render, ...others } = field;

      if (!render) {
        render = value => getFieldValue(value, field);
      }

      return {
        dataIndex: key || dataIndex,
        title: name || title,
        render,
        ...others,
      };
    });

  const pick = _fieldKeys => {
    _fieldKeys = [].concat(_fieldKeys);
    columns = _fieldKeys.map(fieldKey => {
      let column = columns.find(item => fieldKey == (item.key || item.dataIndex));
      if (!column) {
        // 如果fieldKey不存在，则创建text类型的column
        column = {
          dataIndex: fieldKey,
          title: fieldKey,
          render: value => getFieldValue(value),
        };
      }
      return column;
    });
    return chain;
  };

  const excludes = _fieldKeys => {
    _fieldKeys = [].concat(_fieldKeys);
    columns = columns.filter(column => !_fieldKeys.includes(column.dataIndex));
    return chain;
  };

  const enhance = _extraColumns => {
    if (!Array.isArray(_extraColumns)) {
      _extraColumns = Object.keys(_extraColumns).map(key =>
        Object.assign(_extraColumns[key], {
          key,
        }),
      );
    }
    _extraColumns.forEach(extraColumn => {
      const { dataIndex, title, key, name, ...others } = extraColumn;
      extraColumn = {
        dataIndex: key || dataIndex,
        title: name || title,
        ...others,
      };

      // 如果extraColumn.title为undefined，则删除title属性，防止assign时覆盖掉原来的title
      if (extraColumn.hasOwnProperty('title') && extraColumn.title == undefined) {
        delete extraColumn.title;
      }

      const column = columns.find(item => item.dataIndex == extraColumn.dataIndex);
      if (column) {
        Object.assign(column, extraColumn);
      } else {
        columns.push(extraColumn);
      }
    });

    return chain;
  };

  const values = () => columns;

  columns = transform(fields);

  if (fieldKeys) {
    pick(fieldKeys);
  }

  if (extraFields) {
    enhance(extraFields);
  }

  return Object.assign(chain, {
    pick,
    excludes,
    enhance,
    values,
  });
}

export default {
  combineTypes,
  getFieldValue,
  createColumns,
};
