const db = uniCloud.database();
const dbCollectionName = 'fm-dict';
module.exports = {
	_before: function() { // 通用预处理器

	},
	getList() {
		return db.collection(dbCollectionName).get()
	},
}