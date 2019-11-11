let parseTime = (time, cFormat) => {
    if (!time) {
        return ''
    }
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(parseInt(time))
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

function isValidOrgCode(value) {
    if (value) {
        let part1 = value.substring(0, 8);
        let part2 = value.substring(value.length - 1, 1);
        let ws = [3, 7, 9, 10, 5, 8, 4, 2];
        let str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let reg = /^([0-9A-Z]){8}$/;
        if (!reg.test(part1)) {
            return true
        }
        let sum = 0;
        for (let i = 0; i < 8; i++) {
            sum += str.indexOf(part1.charAt(i)) * ws[i];
        }
        let C9 = 11 - (sum % 11);
        let YC9 = part2 + '';
        if (C9 === 11) {
            C9 = '0';
        } else if (C9 === 10) {
            C9 = 'X';
        } else {
            C9 = C9 + '';
        }
        return YC9 === C9;
    }
}

function checkAddressCode(addressCode) {
    let provinceAndCitys = {
        11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江",
        31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东",
        45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏",
        65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
    };
    let check = /^[1-9]\d{5}$/.test(addressCode);
    if (!check) return false;
    if (provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
        return true;
    } else {
        return false;
    }

}

let checkTaxpayerId = (taxpayerId) => {
    if (taxpayerId && taxpayerId.length === 15) {
        let addressCode = taxpayerId.substring(0, 6);
        // 校验地址码
        let check = checkAddressCode(addressCode);
        if (!check) {
            return false;
        }
        // 校验组织机构代码
        let orgCode = taxpayerId.substring(6, 9);
        check = isValidOrgCode(orgCode);
        if (!check) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}

/**
 * @description 判断是否为银行卡号
 * @param {String} str_cardNo 待校验的数据
 * @returns {Boolean}, true:是银行卡号
 **/
let isBankCard = (str_cardNo) => {
    str_cardNo = str_cardNo || String(this);
    if ("" === str_cardNo.trim() || undefined === str_cardNo) {
        return false;
    }
    let lastNum = str_cardNo.substr(str_cardNo.length - 1, 1);//取出最后一位（与luhm进行比较）
    let first15Num = str_cardNo.substr(0, str_cardNo.length - 1);//前15或18位
    let newArr = [];
    for (let i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    let arrJiShu = [];  //奇数位*2的积 <9
    let arrJiShu2 = []; //奇数位*2的积 >9

    let arrOuShu = [];  //偶数位数组
    for (let j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 === 1) {//奇数位
            if (parseInt(newArr[j]) * 2 < 9)
                arrJiShu.push(parseInt(newArr[j]) * 2);
            else
                arrJiShu2.push(parseInt(newArr[j]) * 2);
        } else //偶数位
            arrOuShu.push(newArr[j]);
    }

    let jishu_child1 = [];//奇数位*2 >9 的分割之后的数组个位数
    let jishu_child2 = [];//奇数位*2 >9 的分割之后的数组十位数
    for (let h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    let sumJiShu = 0; //奇数位*2 < 9 的数组之和
    let sumOuShu = 0; //偶数位数组之和
    let sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    let sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    let sumTotal = 0;
    for (let m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (let n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (let p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
    console.log('sumTotal', sumJiShu, sumOuShu, sumJiShuChild1, sumJiShuChild2);

    //计算Luhm值
    let k = parseInt(sumTotal) % 10 === 0 ? 10 : parseInt(sumTotal) % 10;
    let luhm = 10 - k;
    console.log('iiiiiiiiisbank', lastNum, luhm);
    return lastNum === luhm;
}

/*let isBankCard = (bankno) => {
    const lastNum = +bankno.substr(bankno.length - 1, 1);
    const first15Num = bankno.substr(0, bankno.length - 1);
    const newArr = [];
    for (let i = first15Num.length - 1; i > -1; i -= 1) {
        newArr.push(first15Num.substr(i, 1));
    }
    const arrJiShu = [];
    const arrJiShu2 = [];
    const arrOuShu = [];
    for (let j = 0; j < newArr.length; j += 1) {
        if ((j + 1) % 2 === 1) {
            if (parseInt(newArr[j], 10) * 2 < 9) {
                arrJiShu.push(parseInt(newArr[j], 10) * 2);
            } else {
                arrJiShu2.push(parseInt(newArr[j], 10) * 2);
            }
        } else {
            arrOuShu.push(newArr[j]);
        }
    }

    const jishuChild1 = [];
    const jishuChild2 = [];
    for (let h = 0; h < arrJiShu2.length; h += 1) {
        jishuChild1.push(parseInt(arrJiShu2[h], 10) % 10);
        jishuChild2.push(parseInt(arrJiShu2[h], 10) / 10);
    }

    let sumJiShu = 0;
    let sumOuShu = 0;
    let sumJiShuChild1 = 0;
    let sumJiShuChild2 = 0;
    let sumTotal = 0;
    for (let m = 0; m < arrJiShu.length; m += 1) {
        sumJiShu += parseInt(arrJiShu[m], 10);
    }

    for (let n = 0; n < arrOuShu.length; n += 1) {
        sumOuShu += parseInt(arrOuShu[n], 10);
    }

    for (let p = 0; p < jishuChild1.length; p += 1) {
        sumJiShuChild1 += parseInt(jishuChild1[p], 10);
        sumJiShuChild2 += parseInt(jishuChild2[p], 10);
    }
    sumTotal = parseInt(sumJiShu, 10) + parseInt(sumOuShu, 10)
        + parseInt(sumJiShuChild1, 10) + parseInt(sumJiShuChild2, 10);
    const k = parseInt(sumTotal, 10) % 10 === 0 ? 10 : parseInt(sumTotal, 10) % 10;
    const luhn = 10 - k;
    return lastNum === luhn;
};*/

let fmoney = (str, flag = true) => { //金额按千位逗号分割
    if (/[^0-9.]/.test(str))
        return "0.00";
    if (str == null || str === "null" || str === "")
        return "0.00";
    str = str.toString().replace(/^(\d*)$/, "$1.");
    str = (str + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    str = str.replace(".", ",");
    let re = /(\d)(\d{3},)/;
    while (re.test(str))
        str = str.replace(re, "$1,$2");
    str = str.replace(/,(\d\d)$/, ".$1");
    if (!flag) {
        let a = str.split(".");
        if (a[1] === "00") {
            str = a[0];
        }
    }
    return str;
};
let rmoney = (s) => {   //还原
    return parseFloat(s.replace(/[^\d.-]/g, ""));
};

let DataLength = (fData) => {
    let intLength = 0;
    for (let i = 0; i < fData.length; i++) {
        if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255))
            intLength = intLength + 2;
        else
            intLength = intLength + 1;
    }
    return intLength;
}

let keepTwoDecimalFull = (num) => {
    let result = parseFloat(num);
    if (isNaN(result)) {
        return false;
    }
    result = Math.round(num * 100) / 100;
    let s_x = result.toString();
    let pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
};

/**
 * 文件转 Base64
 * @param file
 * @returns {Promise<any>}
 */
let fileToDataUrl = file => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onloadend = function (e) {
            resolve(e.target.result)
        };
        reader.readAsDataURL(file);
    })
}


/**
 * 两个集合的交集
 * @param base
 * @param target
 * @returns {Array}
 */
let intersectionSet = (base, target) => {
    if (!base ||
        !target ||
        !base.length ||
        !target.length) {
        return []
    }
    let baseSet = new Set(base)
    let targetSet = new Set(target)
    let result = new Set([...baseSet].filter(x => targetSet.has(x)))
    return Array.from(result)
}

/**
 * 获取对象类型
 * @param object
 * @returns {string}
 */
let getType = (object) => {
    let _t;
    return ((_t = typeof (object)) == "object" ? object == null && "null" ||
        Object.prototype.toString.call(object).slice(8, -1) : _t).toLowerCase();
}

/**
 * 深拷贝
 * @param p 目标对象
 * @param c 结果对象
 * @returns Object
 */
let deepCopy = (p, c) => {
    let t = getType(p)
    if (t !== 'array' && t !== 'object') {
        return p
    }
    let x = c || (t === 'array' ? [] : {})
    for (let i in p) {
        if (!p.hasOwnProperty(i)) {
            continue
        }
        if (getType(p[i]) === 'object') {
            x[i] = {}
            deepCopy(p[i], x[i])
        } else if (getType(p[i]) === 'array') {
            x[i] = []
            deepCopy(p[i], x[i])
        } else {
            x[i] = p[i]
        }
    }
    return x
}

/**
 * 防抖
 * @param func 事件
 * @param wait 抖动时间
 * @returns {debounced}
 */
let debounce = (func, wait, immediate) => {
    let timeout, result

    let debounced = function () {
        let _that = this
        let args = arguments

        if (timeout) clearTimeout(timeout)

        if (immediate) {
            // 如果执行过，则不再执行
            let callnow = !timeout

            timeout = setTimeout(() => {
                timeout = null
            }, wait)
            if (callnow) result = func.apply(_that, args)
        } else {
            timeout = setTimeout(function () {
                func.apply(_that, args)
            }, wait)
        }
        return result
    }

    debounced.cancel = function () {
        clearTimeout(timeout)
        timeout = null
    }
    return debounced
}

let throttle = (func, wait, options) => {
    let timeout, context, args
    let previous = 0
    if (!options) options = {}

    let later = function () {
        previous = options.leading === false ? 0 : new Date().getTime()
        timeout = null
        func.apply(context, args)
        if (!timeout) context = args = null
    };

    return function () {
        let now = new Date().getTime()
        if (!previous && options.leading === false) previous = now
        let remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            previous = now
            func.apply(context, args)
            if (!timeout) context = args = null
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining)
        }
    }
}

let createIndexFinder = dir => {
    return function (array, predicate, context) {
        let length = array.length
        let index = dir > 0 ? 0 : length - 1
        for (; index >= 0 && index < length; index += dir) {
            if (predicate.call(context, array[index], index, array)) return index
        }
        return -1
    }
}

let convertImgToBase64 = (url, callback, outputFormat) => {
    let canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    // img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        let dataURL = canvas.toDataURL(outputFormat || 'image/png');
        // callback.call(this, dataURL);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
};

/**
 * 身份证号码验证
 * @param num
 */
let isIdCardNo = (num) => {
    num = num.toUpperCase();           //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        return false;
    } //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    let len, re;
    len = num.length;
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        let arrSplit = num.match(re);  //检查生日日期是否正确
        let dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        let bGoodDay;
        bGoodDay = (dtmBirth.getYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]));
        if (!bGoodDay) {
            //alert('输入的身份证号里出生日期不对！');
            return false;
        } else { //将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            let arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            let arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            let nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len === 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        let arrSplit = num.match(re);  //检查生日日期是否正确
        let dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        let bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]));
        if (!bGoodDay) {
            /*alert(dtmBirth.getYear());
            alert(arrSplit[2]);
            alert('输入的身份证号里出生日期不对！');*/
            return false;
        } else { //检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            let valnum;
            let arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            let arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            let nTemp = 0, i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                //alert('18位身份证的校验码不正确！应该为：' + valnum);
                return false;
            }
            return true;
        }
    }
    return false;

}

/**
 * 验证特殊字符
 * @param str
 */
let checkSpecialCharacter = (str) => {
    let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if (regEn.test(str) || regCn.test(str)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 获取uuid
 */
let uuid = () => {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";
    return s.join("");
}

let findIndex = createIndexFinder(1)
let findLastIndex = createIndexFinder(-1)

/**
 * 深层合并json
 * @param targetObj
 * @param mergeObj
 */
let deepMergeObj = (targetObj, mergeObj) => {
    let fieldArr = [], target, targetType = getType(targetObj)
    if (targetType === 'array') {
        target = deepCopy(targetObj)
    } else if (targetType === 'object') {
        target = deepCopy(targetObj)
    }
    getFieldArr(mergeObj, '', fieldArr)
    fieldArr.forEach(item => {
        let evalString
        let evalPrefix = `target${item.key} = `
        let evalSuffix
        let valueType = getType(item.value)
        if (valueType === 'string') {
            item.value.replace('\'', '\\\'')
            evalSuffix = `'${item.value}'`
        } else if (valueType === 'array') {
            evalSuffix = `['${item.value.join('\',\'')}']`
        } else {
            evalSuffix = item.value
        }
        evalString = evalPrefix + evalSuffix
        try {
            if (!eval(`target${item.key}`) || evalSuffix !== null) {
                eval(evalString)
            }
        } catch (e) {
            console.warn('合并异常，键不存在!---', evalString)
        }
    })
    return target
};

let isIE = function () {
    return !!window.ActiveXObject || "ActiveXObject" in window;
};

/**
 * 将对象所有键值以数组方式可视化
 * @param obj
 * @param prefixKey
 * @param fieldArr
 */

let getFieldArr = (obj, prefixKey, fieldArr) => {
    let fieldKey = '', objType = getType(obj)
    for (let key in obj) {
        if (objType === 'array') {
            fieldKey = `${prefixKey ? prefixKey : ''}[${key}]`
        } else if (objType === 'object') {
            fieldKey = prefixKey + '.' + key
        }
        let valueType = getType(obj[key])
        if (valueType === 'array' && !isColorArr(obj[key])) {
            getFieldArr(obj[key], fieldKey, fieldArr)
        } else if (valueType === 'object') {
            getFieldArr(obj[key], fieldKey, fieldArr)
        } else {
            fieldArr.push({
                key: fieldKey,
                value: obj[key]
            })
        }
        /*switch (getType(obj[key])) {
            case 'array' : {
                getFieldArr(obj[key], fieldKey, fieldArr)
                break
            }
            case 'object' : {
                getFieldArr(obj[key], fieldKey, fieldArr)
                break
            }
            default: {
                fieldArr.push({
                    key: fieldKey,
                    value: obj[key]
                })
            }
        }*/
    }
}

const isColorArr = arr => {
    if (!arr || !(arr instanceof Array)) {
        return false
    }
    return arr.filter(item => typeof item !== 'string' || (item.indexOf('#') === -1 && item.indexOf('rgb') === -1)).length === 0
}

const equalsObj = (obj1, obj2) => {
    let type1 = getType(obj1), type2 = getType(obj2)
    if (type1 !== type2) {
        let int1 = parseFloat(obj1), int2 = parseFloat(obj2)
        if (isNaN(int1) || isNaN(int2)) {
            return false
        } else {
            return int1 === int2
        }
    } else {
        switch (type1) {
            case 'array': {
                let len1 = obj1.length, len2 = obj2.length
                if (len1 !== len2) {
                    return false
                }
                for (let i = 0; i < len1; i++) {
                    if (!obj1.hasOwnProperty(i)) {
                        continue
                    }
                    if (!equalsObj(obj1[i], obj2[i])) {
                        return false
                    }
                }
                return true
            }
            case 'object': {
                let keys1 = Object.keys(obj1), keys2 = Object.keys(obj2)
                let len1 = keys1.length, len2 = keys2.length
                if (len1 !== len2) {
                    return false
                }
                if (!equalsObj(keys1, keys2)) {
                    return false
                }
                for (let i = 0; i < len1; i++) {
                    if (!obj1.hasOwnProperty(keys1[i]) || !obj2.hasOwnProperty(keys2[i])) {
                        continue
                    }
                    if (!equalsObj(obj1[keys1[i]], obj2[keys2[i]])) {
                        return false
                    }
                }
                return true
            }
            case 'number': {
                if (isNaN(obj1) && isNaN(obj2)) {
                    return true
                }
                return obj1 === obj2
            }
            case 'string': {
                return obj1 === obj2
            }
            default: {
                return obj1 === obj2
            }
        }
    }
}

//获取url参数
const getURLParameters = url => url.match(/([^?=&]+)(=([^&]*))/g).reduce((a, v) => (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a), {});

//const _import_pages = path => r => require.ensure([], () => r(require("@/pages/" + path + ".vue")));

let chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

let chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];

let chnUnitChar = ["", "十", "百", "千"];

const SectionToChinese = function (section) {
    let strIns = '', chnStr = '';
    let unitPos = 0;
    let zero = true;
    while (section > 0) {
        let v = section % 10;
        if (v === 0) {
            if (!zero) {
                zero = true;
                chnStr = chnNumChar[v] + chnStr;
            }
        } else {
            zero = false;
            strIns = chnNumChar[v];
            strIns += chnUnitChar[unitPos];
            chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
    }
    return chnStr;
}

const NumberToChinese = function (num) {
    let unitPos = 0;
    let strIns = '', chnStr = '';
    let needZero = false;

    if (num === 0) {
        return chnNumChar[0];
    }

    while (num > 0) {
        let section = num % 10000;
        if (needZero) {
            chnStr = chnNumChar[0] + chnStr;
        }
        strIns = SectionToChinese(section);
        strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = (section < 1000) && (section > 0);
        num = Math.floor(num / 10000);
        unitPos++;
    }
    return chnStr;
}

//将表格  导出为 excel

/**
 *
 * @param tableDom 需要导出的表格dom对象
 * @param downDom 隐藏的a标签
 * @param fileName 下载的文件名
 */
const tableToExcel = function (tableDom, downDom, fileName) {
    let tableClone = tableDom.cloneNode(true);
    let uri = 'data:application/vnd.ms-excel;base64,'
        ,
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table style="vnd.ms-excel.numberformat:@">{table}</table></body></html>'
        , base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        }
        , format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            });
        };
    let ctx = {worksheet: name || 'Worksheet', table: tableClone.innerHTML};
    downDom.download = fileName + '.xls';
    downDom.href = uri + base64(format(template, ctx));
    downDom.click();
};

const getList = function (arr) {
    if (arr.length !== 0) {
        arr.forEach(item => {
            item.children || getList(item.children);
            if (item.children.length === 0) {
                delete item.children
            }
        })
    }
};

const setDepData = function (obj) {
    obj.$store.dispatch('GetCompany').then(res => {
        let dep = {
            label: '部门',
            key: 'department',
            data: res,
            props: {
                value: 'id',
                label: 'label',
                children: 'children'
            },
            type: 'cascader',
            value: []
        };
        obj.testData.push(dep);
    });
};

const getFileTree = function (path){//将文件目录转化为树结构 path：'@/views'
    let maxLevel;
    let Files = require.context(path, true, /\.vue$/).keys();
    Files.forEach((item,index)=>{
        let temp = item.split('/');
        Files[index] = temp;
        if(!maxLevel||maxLevel<temp.length) maxLevel = temp.length;
    });

    function getfile(parentName,level){
        let old = [];
        let res = [];
        Files.map(item=>{
            let parent = item.slice(0,level).join('/');
            if(item.length>=level&&parent===parentName&&old.indexOf(item[level])===-1){
                res.push(
                    !item[level].includes('.vue') ?
                        {
                            name: item[level],
                            children: getfile(item.slice(0,[level+1]).join('/'),level+1)
                        }: {
                            name: item[level]
                        }
                );
                old.push(item[level]);
            }
        });
        return res;
    }
    return getfile('.', 1);
};

// 将金额类型转为数字类型
const toNum = function (str) {
    return str.replace(/\,|\￥/g, "");
};

// 保留两位小数（四舍五入）
const toPrice = function (num) {
    num = parseFloat(toNum(num)).toFixed(2).toString().split(".");
    num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
    return "￥" + num.join(".");
};

// 保留两位小数（不四舍五入）
const toPrice1 = function (num) {
    num = parseFloat(toNum(num).replace(/(\.\d{2})\d+$/,"$1")).toFixed(2).toString().split(".");
    num[0] = num[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
    return "￥" + num.join(".");;
};

// 不处理小数部分
const toPrice2 = function (num) {
    let source = toNum(num).split(".");
    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");
    return "￥" + source.join(".");
};

//表单序列化
export const serialize = data => {
    let list = [];
    Object.keys(data).forEach(ele => {
        list.push(`${ele}=${data[ele]}`)
    })
    return list.join('&');
};
export const getObjType = obj => {
    var toString = Object.prototype.toString;
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    if (obj instanceof Element) {
        return 'element';
    }
    return map[toString.call(obj)];
};
export const getViewDom = () => {
    return window.document.getElementById('avue-view').getElementsByClassName('el-scrollbar__wrap')[0]
}
/**
 * 对象深拷贝
 */
export const deepClone = data => {
    var type = getObjType(data);
    var obj;
    if (type === 'array') {
        obj = [];
    } else if (type === 'object') {
        obj = {};
    } else {
        //不再具有下一层次
        return data;
    }
    if (type === 'array') {
        for (var i = 0, len = data.length; i < len; i++) {
            obj.push(deepClone(data[i]));
        }
    } else if (type === 'object') {
        for (var key in data) {
            obj[key] = deepClone(data[key]);
        }
    }
    return obj;
};
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status) => {
    if (status) {
        document.body.className = document.body.className + ' grayMode';
    } else {
        document.body.className = document.body.className.replace(' grayMode', '');
    }
};
/**
 * 设置主题
 */
export const setTheme = (name) => {
    document.body.className = name;
}

/**
 * 加密处理
 */
export const encryption = (params) => {
    let {
        data,
        type,
        param,
        key
    } = params;
    let result = JSON.parse(JSON.stringify(data));
    if (type == 'Base64') {
        param.forEach(ele => {
            result[ele] = btoa(result[ele]);
        })
    } else if (type == 'Aes') {
        param.forEach(ele => {
            result[ele] = window.CryptoJS.AES.encrypt(result[ele], key).toString();
        })

    }
    return result;
};


/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
    if (fullscreenEnable()) {
        exitFullScreen();
    } else {
        reqFullScreen();
    }
};
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
    function listen() {
        callback()
    }
    document.addEventListener("fullscreenchange", function () {
        listen();
    });
    document.addEventListener("mozfullscreenchange", function () {
        listen();
    });
    document.addEventListener("webkitfullscreenchange", function () {
        listen();
    });
    document.addEventListener("msfullscreenchange", function () {
        listen();
    });
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
    var isFullscreen = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
    return isFullscreen;
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.exitFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.mozCancelFullScreen();
    }
};
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].children.length != 0) {
            for (let j = 0; j < menu[i].children.length; j++) {
                if (menu[i].children[j].id == id) {
                    return menu[i];
                } else {
                    if (menu[i].children[j].children.length != 0) {
                        return findParent(menu[i].children[j].children, id);
                    }
                }
            }
        }
    }
};
/**
 * 判断2个对象属性和值是否相等
 */

/**
 * 动态插入css
 */

export const loadStyle = url => {
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
};
/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
    delete obj1.close;
    var o1 = obj1 instanceof Object;
    var o2 = obj2 instanceof Object;
    if (!o1 || !o2) { /*  判断不是对象  */
        return obj1 === obj2;
    }

    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
        //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    }

    for (var attr in obj1) {
        var t1 = obj1[attr] instanceof Object;
        var t2 = obj2[attr] instanceof Object;
        if (t1 && t2) {
            return diff(obj1[attr], obj2[attr]);
        } else if (obj1[attr] !== obj2[attr]) {
            return false;
        }
    }
    return true;
}
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
    let result = '';
    if (validatenull(dic)) return value;
    if (typeof (value) == 'string' || typeof (value) == 'number' || typeof (value) == 'boolean') {
        let index = 0;
        index = findArray(dic, value);
        if (index != -1) {
            result = dic[index].label;
        } else {
            result = value;
        }
    } else if (value instanceof Array) {
        result = [];
        let index = 0;
        value.forEach(ele => {
            index = findArray(dic, ele);
            if (index != -1) {
                result.push(dic[index].label);
            } else {
                result.push(value);
            }
        });
        result = result.toString();
    }
    return result;
};
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
    for (let i = 0; i < dic.length; i++) {
        if (dic[i].value == value) {
            return i;
        }
    }
    return -1;
};
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
    let random = '';
    random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len ? len : 4);
    if (date) random = random + Date.now();
    return random;
};
/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
    // Fixes dual-screen position                            Most browsers       Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

    const left = ((width / 2) - (w / 2)) + dualScreenLeft
    const top = ((height / 2) - (h / 2)) + dualScreenTop
    const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus()
    }
}

export {
    DataLength,
    isBankCard,
    keepTwoDecimalFull,
    checkTaxpayerId,
    fmoney,
    rmoney,
    parseTime,
    fileToDataUrl,
    getType,
    deepCopy,
    debounce,
    throttle,
    isIdCardNo,
    convertImgToBase64,
    findIndex,
    findLastIndex,
    uuid,
    deepMergeObj,
    equalsObj,
    getURLParameters,
    NumberToChinese,
    tableToExcel,
    checkSpecialCharacter,
    getList,
    setDepData,
    isIE,
    getFileTree
}
