import Config from '../../build/config';
import axios from 'axios';
import qs from 'qs';

let util = {

};

// http://101.132.174.18:8088       mock
// http://127.0.0.1:8088            mock local
// http://101.132.174.18:8085/api   proxy api
// http://54.223.172.19/api         api
const ajaxUrl = Config.getApiUrl();

const amapUrl = Config.getAmapUrl();
const amapKey = Config.getAmapKey();

const xianluUrl = Config.getXianluUrl();
const assessUrl = Config.getAssessUrl();
const jdxlUrl = Config.getJdxlUrl();


util.daoluUrl = Config.getDaoluUrl();

util.prickPageUrl = Config.getPrickPageUrl();
util.S3Path = Config.getS3Path();
util.assessUrl = Config.getAssessUrl();
util.jdxlUrl = Config.getJdxlUrl();


util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 40000
});
util.Xianluajax = axios.create({
    baseURL: xianluUrl,
    timeout: 40000
});
util.assessajax = axios.create({
    baseURL: assessUrl,
    timeout: 40000
});
util.DaoluUrl = axios.create({
    baseURL: util.daoluUrl,
    timeout: 40000
});
util.JdxlUrl = axios.create({
    baseURL: util.jdxlUrl,
    timeout: 40000
});

util.ajax.defaults.withCredentials = true;

util.ajax.interceptors.request.use(function (config) {
    // config.headers['Auth-Token'] = Cookies.get('token');
    const contentType = config.headers['Content-Type'];
    if ((config.method === 'post' || config.method === 'put') && (contentType && contentType != null && contentType.indexOf('application/json') > -1)) {
        config.headers['Content-Type'] = 'application/json';
    } else if ((config.method === 'post' || config.method === 'put') &&
        (!config.headers['Content-Type'] || config.headers['Content-Type'].indexOf('multipart') < 0)) {
        config.data = qs.stringify(config.data);
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config;
});
util.baseUrl = ajaxUrl;

util.amap = axios.create({
    baseURL: amapUrl,
    timeout: 30000
});
util.amapKey = amapKey;

util.validateDate = function (date) {
    const result = date.match(/^(\d{1,4})(-)(\d{2})(-)(\d{2})$/);
    if (!result) {
        return false;
    }
    const d = new Date(result[1], result[3] - 1, result[5]);
    return (d.getFullYear() === parseInt(result[1]) &&
        (d.getMonth() + 1) === parseInt(result[3]) &&
        d.getDate() === parseInt(result[5]));
};

export default util;
