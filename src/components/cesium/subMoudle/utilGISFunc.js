String.prototype.isNullOrEmpty = String.isNullOrEmpty = function(){
    if (this === String && arguments.length === 0)
        return true;
    let str = this === String ? arguments[0] : this.toString();
    if (typeof str === "string")
        return /^ *$/.test(str);
    for (let key in str)
        return false;
    return typeof str !== "number" && typeof str !== "boolean";
};

/**
 * 验证经纬度坐标格式是否正确
 * @param {Number}longitude         经度，验证规则[-180,180]
 * @param {Number}latitude           纬度，验证规则[-90,90]
 * @return {boolean}                格式是否正确[true--正确，false--错误]
 */
export const vertifyLonLat=function (longitude,latitude) {
    //经度，整数部分为0-180小数部分为0到6位
    let longreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,20})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,20}|180)$/;
    //纬度,整数部分为0-90小数部分为0到6位
    let latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,20}|90\.0{0,20}|[0-8]?\d{1}|90)$/;

    let isLegal=true;
    if(!latreg.test(latitude)){
        console.log('纬度整数部分为0-90,小数部分为0到6位!');
        isLegal= false;
    }
    if(!longreg.test(longitude)){
        console.log('经度整数部分为0-180,小数部分为0到6位!');
        isLegal= false;
    }
    return isLegal
};

/**
 * 验证投影坐标格式是否正确（带有代号的投影坐标值）
 * @param {Number}x          x坐标值，验证规则，8位整数或者小数点前8位，小数点后1到3位
 * @param {Number}y          y坐标值，验证规则，7位整数或者小数点前7位，后面1到3位
 * @return {boolean}         格式是否正确[true--正确，false--错误]
 */
export const vertifyXY=function (x,y) {
    let isLegal=true;
    if(x === 0 && y === 0){
        return isLegal
    }
    //投影坐标x///(d{6}|d{8})+()$/;
    let xreg =/^[1-9]{1}([0-9]{5,7})(.[0-9]{1,9})?$/;
    //投影坐标y
    let yreg = /^[1-9]{1}[0-9]{6}(.[0-9]{1,9})?$/;

    if(!yreg.test(y)){
        console.log('y整数部分7位,小数部分为1-3位!');
        isLegal= false;
    }
    if(!xreg.test(x)){
        console.log('x整数部分8位，小数部分为1-3位!');
        isLegal= false;
    }
    return isLegal
};

/**
 * 校验是否为url
 * @param {String}str_url       要验证的url字符串
 * @return {boolean}            格式是否正确[true--正确，false--错误]
 */
export const IsURL=function (str_url) {
    if(String.isNullOrEmpty(str_url)){
        return false;
    }
    let strRegex = '^((https|http|ftp|rtsp|mms)?://)'
        +'?(([0-9a-z_!~*().&=+$%-]+: )?[0-9a-z_!~*().&=+$%-]+@)?' //ftp的user@
        + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
        + '|' // 允许IP和DOMAIN（域名）
        + '([0-9a-z_!~*()-]+.)*' // 域名- www.
        + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
        + '[a-z]{2,6})' // first level domain- .com or .museum
        + '(:[0-9]{1,4})?' // 端口- :80
        + '((/?)|' // a slash isn't required if there is no file name
        + '(/[0-9a-z_!~*().;?:@&=+$,%#-]+)+/?)$';
    let re=new RegExp(strRegex);
    if (re.test(str_url)){
        return true;
    }else{
        return false;
    }
};
