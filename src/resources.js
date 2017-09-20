const debug = process.env.NODE_ENV === 'development' ? true : false;
// 测试环境地址
if (true) {
    // var host = 'https://api.guangyangyundong.com/api';
    var host = 'http://120.77.72.16:8080/api';
} else {
    //正式环境地址
    var host = 'https://api.guangyangyundong.com/api';
}
console.warn('当前resource: ', host);

let resources = {
    universityId: 1,
    host: host,
    // graphQL查询Api
    graphQlApi: `${host}\/graphql`,
    users(id) {
        return `${host}\/users\/${id}`
    }
};

export default resources;
