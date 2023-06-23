export function arryGroupMatch(arry, key) {
	const map = {}
	for (let i = 0; i < arry.length; i++) {
		const item = arry[i]
		const value = item[key]
		if (!map[value]) {
			map[value] = []
		}
		map[value].push(item)
	}
	return map
}

export function arryGroupMatchWithAll(arry, key) {
	const map = {
		'all': arry
	}
	for (let i = 0; i < arry.length; i++) {
		const item = arry[i]
		const value = item[key]
		if (!map[value]) {
			map[value] = []
		}
		map[value].push(item)
	}
	return map
}
/**
 * 是否登录
 */
export function isLogin() {
	const userInfo = uniCloud.getCurrentUserInfo()
	const time = Date.parse(new Date())
	if (userInfo.uid && userInfo.tokenExpired > time) {
		return true
	} else {
		return false
	}
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