'use strict';



const Reg = /^(([1-9][0-9]*)|(([0]\.\d{1}|[1-9][0-9]*\.\d{1})))$/;
function validate(rule, value, callback) {
    if (Reg.test(value)) {
        callback();
    } else callback('项目容量为正数，允许输入到小数点后一位');
};

var miaoshu = (rule, value, callback) => {
    if (value.length >= 200) {
      callback(new Error('只能输入200个字符!'));
    } else {
      callback();
    }
  };
function getRules() {
    return {
        projectName: [
            {required: true, message: '请输入项目名称 ！', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        designCapacity: [
            {required: true, message: '请输入项目容量 ！'},
            {validator: validate, trigger: 'blur'}
        ],
        selectOwner: [
            { required: true, message: '请选择业主单位 ！', trigger: 'change' }
        ],
        region: [
            { required: true, message: '请选择风场位置 ！', trigger: 'change' }
        ],
        // longitude: [
        //     {required: true, message: '请输入项目经度'},
        //     {type: 'number', message: '项目经度必须为数字值'}
        // ],
        // latitude: [
        //     {required: true, message: '请输入项目纬度'},
        //     {type: 'number', message: '项目纬度必须为数字值'}
        // ],
        // description: [
        //     { required: true, message: '请输入项目描述 ！', trigger: 'change' }
        // ],
        description:[ 
            {validator: miaoshu, trigger: 'change'}
        ]
    };
}
export {
    getRules
}
