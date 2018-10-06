// had enabled by egg
// exports.static = true;

//使用mongoose数据库
exports.mongoose = {
    enable: true,
    package: 'egg-mongoose',
};

//使用bcrypt加密
exports.bcrypt = {
    enable: true,
    package: 'egg-bcrypt',
};

//使用validate校验工具
exports.validate = {
    enable: true,
    package: 'egg-validate',
};

//使用jwt的token认证
exports.jwt = {
    enable: true,
    package: 'egg-jwt',
};

//使用cors
exports.cors = {
    enable: true,
    package: 'egg-cors',
};
