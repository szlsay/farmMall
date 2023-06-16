const db = uniCloud.database();
const dbJql = uniCloud.databaseForJQL();
const dbCollectionName = 'fm-banner';

module.exports = {
	_before: async function() {},

	getList() {
		return dbJql.collection(dbCollectionName).where({
			status: true
		}).field("image,title,type,value").get()
	},
}