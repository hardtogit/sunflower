/**
 * 基础Http 类
 */

/* eslint-disable */
import qs from 'qs';
// import middlewares from './middlewares';

const baseFetch = Symbol();
const BIND_KEYS = ['fetch', 'get', 'post', 'del', 'patch','adapt', 'put', 'head', baseFetch];

/*
 * http默认配置
 */
const defaults = {
    middlewares: [
      
    ],
    config: {
        domain: '',
        servers: {},
        contentType: 'form'
    }
};

/*
 * 解析参数
 */
function parseArgs(_config = {}, _middlewares = []) {
    if (_config instanceof Array) {
        _middlewares = _config;
        _config = {};
    } else if (typeof _config === 'string') {
        _config = {
            domain: _config
        };
    }

    return {
        _config,
        _middlewares
    };
}

/*
 * 通用Http类,提供中间件来扩展
 * 方法: create, get, post, put, del, patch, head
 */
export default class BaseHttp {

    constructor(_config = {}, _middlewares = []) {
        this.config = _config;
        this.middlewares = _middlewares;
        BIND_KEYS.forEach(key => {
            this[key] = this[key].bind(this);
        });
        // console.log('--------chonmx ');
    }
    /*
     * 创建新的http实例，新的实例会继承当前实例的config & middlewares;
     */
    create(...args) {
        let {
            _config,
            _middlewares
        } = parseArgs(...args);
        _config = {
            ...this.config,
            ..._config
        };
        _middlewares = [...this.middlewares, ..._middlewares];

        // return new BaseHttp(_config, _middlewares);
        this.config = _config;
        this.middlewares = _middlewares;
        return this;
    }


    adapt(url, options) {
        throw new Error('请先适配xhr');
    }
    //   getRequestInit(args) {
    //     const requestInit = {};
    //     const requestInitKeys = ['method', 'headers', 'body', 'referrer', 'mode', 'credentials', 'cache', 'redirect'];
    //     Object.keys(args).forEach(key => {
    //       requestInitKeys.includes(key) && (requestInit[key] = args[key]);
    //     });
    //     return requestInit;
    //   }

    [baseFetch]({
        url,
        options,
        method,
        data
    }) {
        const defaultMethod = !data && (!!options && !options.body) ? 'GET' : 'POST';
        options.method = method || options.method || defaultMethod;

        if (!!data) {
            if ( window &&((window.Blob && data instanceof window.Blob) || (window.FormData && data instanceof window.FormData)) ||
                typeof data === 'string') {
                options.body = data;
            } else {
                options.body = JSON.stringify(data);
            }
        }

        // return fetch(url, this.getRequestInit(options));
        return this.adapt(url, options);
    }

    request(url, options, method, data) {
        options = Object.assign({}, this.config, options);
        const request = {
            url,
            options,
            method,
            data
        };

        let promise = Promise.resolve(request);
        const chain = [this[baseFetch].bind(this), undefined];

        const wrapResponse = (fn, req, reject) => {
            return (res) => {
                return fn ? fn(res, req) : (reject ? Promise.reject(res) : res);
            };
        };
        for (const middleware of this.middlewares) {
            chain.unshift(middleware.request, middleware.requestError);
            chain.push(wrapResponse(middleware.response, request), wrapResponse(middleware.responseError, request, true));
        }
        while (!!chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
    }

    addMiddlewares(_middlewares, overwirte) {
        overwirte && this.clearMiddlewares();
        this.middlewares.push(..._middlewares);
        return this;
    }

    clearMiddlewares() {
        while (this.middlewares.length) {
            this.middlewares.pop();
        }
        return this;
    }

    fetch(url, options) {
        return this.request(url, options);
    }

    get(url, data, options) {
        if (data) {
            url = `${url}${url.includes('?') ? '&' : '?'}${qs.stringify(data)}`;
        }
        return this.request(url, options, 'GET');
    }

    post(url, data, options) {
        return this.request(url, options, 'POST', data);
    }

    patch(url, data, options) {
        return this.request(url, options, 'PATCH', data);
    }

    put(url, data, options) {
        return this.request(url, options, 'PUT', data);
    }

    del(url, options) {
        return this.request(url, options, 'DELETE');
    }

    head(url, options) {
        return this.request(url, options, 'HEAD');
    }
}

/*
 * 创建http对象，继承默认配置
 */
// export function 

// export const
