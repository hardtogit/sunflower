/**
 * model 池
 */
import { queryArray } from './share';
const getModel=(name)=>{
  const models=window.g_app._models;
  const model = queryArray(models, name, 'namespace');
  return model;
};
export default {
  getModel
};
