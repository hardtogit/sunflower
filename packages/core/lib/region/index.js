"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRegionById = getRegionById;
exports.formatRegion = formatRegion;
exports["default"] = void 0;

var _data = _interopRequireDefault(require("./data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var region = _data["default"]; // 只会缓存regionURL返回的数据，用户自定义的server地址返回的数据不会缓存

var regionsCache = null; // const regionURL = 'https://region.56qq.com/region/web/query?lt=0';

function getMapData() {
  /* eslint-disable no-console */
  console.warn('getMapData方法是为了向后兼容，返回的region数据不是最新版本的，已不再推荐，请使用getAsyncMapData方法');
  return region.reduce(function (data, reg) {
    data[reg.id] = reg.name;
    return data;
  }, {});
}

function getRegionById(id) {
  for (var i = 0; i < _data["default"].length; i++) {
    if (_data["default"][i].id === id) {
      return _data["default"][i];
    }
  }

  throw new Error("CityPickerPro: \u533A\u57DFid: ".concat(id, "\u4E0D\u5B58\u5728"));
}

function getParents(current, regionType) {
  var regionData = {};
  var area = {};
  var city = {};
  var province = {};

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
        regionData.name = "".concat(province.name, "-").concat(city.name, "-").concat(area.name);
        regionData.location = {
          lng: area.lng,
          lat: area.lat
        };
      } else if (regionType === 'city') {
        city = getRegionById(current);
        province = getRegionById(city.parentId);
        regionData.cityName = city.name;
        regionData.cityId = city.id;
        regionData.provinceName = province.name;
        regionData.provinceId = province.id;
        regionData.id = city.id;
        regionData.name = "".concat(province.name, "-").concat(city.name);
        regionData.location = {
          lng: city.lng,
          lat: city.lat
        };
      } else {
        province = getRegionById(current);
        regionData.id = current;
        regionData.name = province.name;
        regionData.location = {
          lng: province.lng,
          lat: province.lat
        };
      }

      return regionData;
    } // TODO

  } catch (e) {
    return {};
  }
}

function formatRegion(region, regionType) {
  if (Array.isArray(region)) {
    return region.reduce(function (total, current) {
      return [].concat(_toConsumableArray(total), [getParents(current, regionType)]);
    }, []);
  }

  return getParents(region, regionType);
} // 根据父级id查询所有子集


function findChildrenById(id) {
  var children = _data["default"].filter(function (item) {
    return item.parentId === id;
  });

  if (children.length === 0) {
    return [getRegionById(id)];
  }

  return children;
}

var _default = {
  getMapData: getMapData,
  formatRegion: formatRegion,
  findChildrenById: findChildrenById
};
exports["default"] = _default;