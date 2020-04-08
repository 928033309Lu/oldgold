/**
 * 将数值保留指定位数小数
 * @param {Number} number 数值
 * @param {Number} fixed 保留小数位数
 */
export function fixedNumber (number, fixed = 2) {
    if (!number || isNaN(Number(number))) return number;
    return Number(number).toFixed(fixed);
}

/**
 * 通过创建a标签下载文件
 * @param {String} url 文件下载地址
 */
export function downloadFile (url) {
    let link = document.createElement('a');
    link.style.display = 'none';
    link.target = '_blank';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
