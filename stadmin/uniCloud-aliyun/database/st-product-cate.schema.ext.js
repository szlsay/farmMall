// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
module.exports = {   
    trigger: {
        beforeRead: async function() {
					console.log("cate-beforeRead")
				},
				afterRead: async function() {
					console.log("cate-afterRead")
				},
				beforeDelete: async function(obj = {}) {
					let {
						collection,
						operation,
						where,
						field
					} = obj;
					console.log('cate-beforeDelete', collection, operation, where, field)
				},
				beforeCount: async function() {
					console.log("cate-beforeCount")
				},
				afterCount: async function() {
					console.log("cate-afterCount")
				},
    }
}


// beforeCount、afterCount、beforeCreate、afterCreate、beforeUpdate、afterUpdate、beforeDelete、afterDelete