import { fixedNumber } from '@/libs/function-util';

/**
 * 返回基础的tooltip.formatter
 */
export function baseTooltipFormatter (params) {
    var result = null;
    params.forEach(function (item) {
        if (!result) {
            result = item.name + '<br/>';
        }
        result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.seriesName + ':' + fixedNumber(item.value) + '<br />';
    });
    return result;
}