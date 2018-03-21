const debug = process.env.NODE_ENV === 'development' ? true : false;
// 测试环境地址
if (debug) {
    // var host = 'https://api.guangyangyundong.com/api';
    // var host = 'http://127.0.0.1:8080/api';
    var host = 'http://119.23.12.36:8081/wzsport-server';
    //   var host = 'http://192.168.1.107:8080/api';
} else {
    //正式环境地址
    var host = 'https://api.guangyangyundong.com/api';
    // var host = 'http://119.23.12.36:8081/wzsport-server';
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
