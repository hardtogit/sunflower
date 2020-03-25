import _ from 'lodash';
import moment from 'moment';

const Format = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM'
};

// 支持格式 moment、date、时间戳(数值或者number)、IOS9601/RFC2822日期格式
function toMoment(value, format) {
  let momentValue;

  const isNumber = _.isNumber(value);
  const isMoment = moment.isMoment(value);
  const isString = _.isString(value);
  const isNotNaN = !_.isNaN(value);
  const isDate = value instanceof Date;
  const isDefaultFormat = Object.values(Format).includes(format);

  // 忽略[]或{}的情况
  if (!value && _.isEmpty(value)) return null;

  if (isMoment) {
    momentValue = value;
  } else if (isDate || isNumber) {
    momentValue = moment(value);
  } else if (isString && isNotNaN && isDefaultFormat) {
    // 判断isDefaultFormat 主要是为了避免格式为数字型format时，也被强转为number，比如: 2012.12
    momentValue = moment(parseInt(value, 10));
  } else {
    momentValue = moment(value, format);
  }

  return momentValue.isValid() ? momentValue : null;
}
/**
 * 配置参数的格式化 z
 * 主要是针对fields
 * @param {*} compiler
 */
export function formate(compiler) {
  compiler.hooks.config.tap('FieldsFormate', (fields = []) => fields.map((field) => {
    // 如果不给type 默认text
    field.type = field.type || 'text';
    if ((field.type === 'date' || field.type === 'month') && field.initialValue) {
      field.initialValue = toMoment(field.initialValue);
    } else if (field.type === 'dateRange' && Array.isArray(field.initialValue)) {
      field.initialValue = field.initialValue.map(it => toMoment(it));
    }
    return field;
  }));
}
