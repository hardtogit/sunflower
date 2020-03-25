// import region from './reg';
import dataSource from './data';

const region = dataSource;

// 只会缓存regionURL返回的数据，用户自定义的server地址返回的数据不会缓存
const regionsCache = null;

// const regionURL = 'https://region.56qq.com/region/web/query?lt=0';

function getMapData() {
  /* eslint-disable no-console */
  console.warn('getMapData方法是为了向后兼容，返回的region数据不是最新版本的，已不再推荐，请使用getAsyncMapData方法');

  return region.reduce((data, reg) => {
    data[reg.id] = reg.name;
    return data;
  }, {});
}
export function getRegionById(id) {
  for (let i = 0; i < dataSource.length; i++) {
    if (dataSource[i].id === id) {
      return dataSource[i];
    }
  }
  throw new Error(`CityPickerPro: 区域id: ${id}不存在`);
}
function getParents(current, regionType) {
  const regionData = {};
  let area = {};
  let city = {};
  let province = {};
  try {
    if (typeof current === 'number') {
      if (regionType === 'area') {
        area = getRegionById(current);
        if (current < 9999) {
          city = getRegionById(current);
        } else {
          city = getRegionById(area.parentId);
        }
        province = getRegionById(city.parentId);
        regionData.areaName = area.name;
        regionData.areaId = area.id;
        regionData.cityName = city.name;
        regionData.cityId = city.id;
        regionData.provinceName = province.name;
        regionData.provinceId = province.id;
        regionData.id = area.id;
        regionData.name = `${province.name}-${city.name}-${area.name}`;
        regionData.location = { lng: area.lng, lat: area.lat };
      } else if (regionType === 'city') {
        city = getRegionById(current);
        province = getRegionById(city.parentId);
        regionData.cityName = city.name;
        regionData.cityId = city.id;
        regionData.provinceName = province.name;
        regionData.provinceId = province.id;
        regionData.id = city.id;
        regionData.name = `${province.name}-${city.name}`;
        regionData.location = { lng: city.lng, lat: city.lat };
      } else {
        province = getRegionById(current);
        regionData.id = current;
        regionData.name = province.name;
        regionData.location = { lng: province.lng, lat: province.lat };
      }
      return regionData;
    }
    // TODO

  } catch (e) {
    return {};
  }

}
export function formatRegion(region, regionType) {
  if (Array.isArray(region)) {
    return region.reduce((total, current) => ([...total, getParents(current, regionType)]), []);
  }
  return getParents(region, regionType);

}

// 根据父级id查询所有子集
function findChildrenById(id) {
  const children = dataSource.filter(item => item.parentId === id);
  if (children.length === 0) {
    return [getRegionById(id)];
  }
  return children;
}
export default {
  getMapData,
  formatRegion,
  findChildrenById
};
