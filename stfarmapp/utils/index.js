
let timeoutArr = [];
/**
 * 防抖函数
 * 防抖原理：一定时间内，只有最后一次或第一次调用,回调函数才会执行
 * @param {Function}  fn 要执行的回调函数 
 * @param {Number}    time 延时的时间
 * @param {Boolean}   isImmediate 是否立即执行 默认true
 * @param {String} timeoutName 定时器ID
 * @return null
vk.pubfn.debounce(() => {
	
}, 1000);
 */
export function debounce(fn, time = 500, isImmediate = true, timeoutName = "default") {
	// 清除定时器
	if(!timeoutArr[timeoutName]) timeoutArr[timeoutName] = null;
	if (timeoutArr[timeoutName] !== null) clearTimeout(timeoutArr[timeoutName]);
	// 立即执行一次
	if (isImmediate) {
		var callNow = !timeoutArr[timeoutName];
		timeoutArr[timeoutName] = setTimeout(() => {
			timeoutArr[timeoutName] = null;
		}, time);
		if (callNow){
			if(typeof fn === 'function') return fn();
		}
	} else {
		// 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时time毫秒后执行fn回调方法
		timeoutArr[timeoutName] = setTimeout(() => {
			if(typeof fn === 'function') return fn();
		}, time);
	}
}

/**
 * 是否登录
 */
export function hasLogin() {
	return uniCloud.getCurrentUserInfo().tokenExpired > Date.now()
	// const userInfo = uniCloud.getCurrentUserInfo()
	// const time = Date.parse(new Date())
	// if (userInfo.uid && userInfo.tokenExpired > time) {
	// 	return true
	// } else {
	// 	return false
	// }
}

/**
 * 是否admin
 */
export function hasAdmin() {
	return this.uniIDHasRole('admin')
}

/**
 * 深度克隆对象、数组
 * @param obj 被克隆的对象
 * @return 克隆后的对象
 */
export function cloneObject(obj) {
	return JSON.parse(JSON.stringify(obj))
}

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt = 'yyyy/MM/dd hh:mm:ss') {
	let regPos = /^\d+(\.\d+)?$/;
	if (regPos.test(value)) {
		//如果是数字
		let getDate = new Date(value);
		let o = {
			'M+': getDate.getMonth() + 1,
			'd+': getDate.getDate(),
			'h+': getDate.getHours(),
			'm+': getDate.getMinutes(),
			's+': getDate.getSeconds(),
			'q+': Math.floor((getDate.getMonth() + 3) / 3),
			'S': getDate.getMilliseconds()
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
		}
		for (let k in o) {
			if (new RegExp('(' + k + ')').test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k])
					.length)))
			}
		}
		return fmt;
	} else {
		//TODO
		value = value.trim();
		return value.substr(0, fmt.length);
	}
}

/**
 * 价格格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatPrice(value) {
	var result = Math.round(parseFloat(value) * 100) / 100
	const arrayNum = value.toString().split('.')
	if (arrayNum.length < 2) {
		return value.toString() + '.00'
	} else {
		if (arrayNum[1].length < 2) {
			return value.toString() + '0'
		} else {
			return value.toString()
		}
	}
}