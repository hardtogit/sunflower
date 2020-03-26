import { formate } from './formatPlugin';
import { elementTypePlugin } from './filedsTypePlugin';
import { validatorPlugin, extraRulePlugin } from './validatorPlugin';
import { formteParamPugin } from './formatParamPlugin';
import { trimStringPugin, trimParamPugin } from './trimPlugin';
import {moreQueryPlugins} from './moreQueryPlugins'

/**
 * 插件集合
 */
export default [
  extraRulePlugin,
  formate,
  new elementTypePlugin(),
  validatorPlugin,
  formteParamPugin,
  trimStringPugin,
  trimParamPugin,
  moreQueryPlugins
];
