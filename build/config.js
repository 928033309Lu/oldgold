import Env from './env';
import EnvConfig from './config.env.json';

var config = {
    env: Env,
    getApiUrl: function() {
        return EnvConfig[Env].apiUrl;
    },
    getXianluUrl:function() {
        return EnvConfig[Env].xianluUrl;
    },
    getDaoluUrl:function() {
        return EnvConfig[Env].daoluUrl;
    },
    getAmapUrl: function() {
        return EnvConfig[Env].amapUrl;
    },
    getAmapKey: function() {
        return EnvConfig[Env].amapKey;
    },
    getS3Path:function () {
        return EnvConfig[Env].S3Path;
    },
    getPrickPageUrl:function () {
        return EnvConfig[Env].prickPageUrl;
    },
    getAssessUrl:function () {
        return EnvConfig[Env].assessUrl;
    },
    getJdxlUrl:function () {
        return EnvConfig[Env].jdxlUrl;
    }
};
export default config;
