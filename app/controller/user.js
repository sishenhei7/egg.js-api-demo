const Controller = require('egg').Controller;

const rules = {
    mobile: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[0-9]{11}$/
    },
    password: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    nickname: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    token: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    code: {
        type: 'string',
        required: false,
        allowEmpty: false
    }
};

const signUpRule = {
    mobile: rules.mobile,
    password: rules.password,
    nickname: rules.nickname,
    code: rules.code
};

const loginRule = {
    mobile: rules.mobile,
    password: rules.password
};

const verifyLoginRule = {
    mobile: rules.mobile,
    token: rules.token
};

const indexRule = {
    mobile: rules.mobile,
    superAdminToken: rules.token
}

const deleteUserRule = {
    mobile: rules.mobile,
    userMobile: rules.mobile,
    superAdminToken: rules.token
}

const hoistRule = {
    mobile: rules.mobile,
    userMobile: rules.mobile,
    superAdminToken: rules.token

};

const changePswRule = {
    mobile: rules.mobile,
    password: rules.password,
    token: rules.token
};

const changeNicknameRule = {
    mobile: rules.mobile,
    token: rules.token,
    nickname: rules.nickname
};

const mobileRule = {
    mobile: rules.mobile
};

class UserController extends Controller {
    // api===============================================
    async test() {
        const { ctx } = this;
        const msg = '测试成功！';
        ctx.helper.success({ ctx, msg });
    }

    //超级管理员权限
    async index() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(indexRule);
        //组装参数
        const params = ctx.request.body;
        //校验token
        ctx.helper.verifyJWT(params.superAdminToken, params.mobile, 'superAdmin');
        //设置响应
        const res = await service.user.findAllUsers();
        const msg = '查找所有用户成功！';
        ctx.helper.success({ ctx, res, msg });
    }

    async verifyLogin() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(verifyLoginRule);
        //组装参数
        const params = ctx.request.body;
        //校验token
        ctx.helper.verifyJWT(params.token, params.mobile);
        //返回用户信息
        const res = await service.user.findOneUser(params.mobile);
        const nickname = res.nickname;
        //设置响应
        const msg = '登陆成功！';
        ctx.helper.success({ ctx, nickname, msg });
    }

    async signUp() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(signUpRule);
        //组装参数
        const params = ctx.request.body;
        //验证邀请码
        if(!ctx.app.config._local.disableInviteCode) {
            if(!params.code) {
                ctx.throw(404, '请输入邀请码！');
            } else {
                await service.inviteCode.verifyCode(params.code);
            }
        }
        //创建一个用户(这里需要加上token)
        const res = await service.user.createOneUser(params.mobile, params.password, params.nickname);
        //写入邀请码
        if(!ctx.app.config._local.disableInviteCode) {
            await service.inviteCode.writeCode(params.code);
        }
        const token = ctx.helper.generateJWT(params.mobile);
        //生成管理员token
        let adminToken = null;
        let superAdminToken = null;
        const verifyAuthority = await service.user.getAuthority(params.mobile);
        if(verifyAuthority == 'admin') {
            adminToken = ctx.helper.generateAdminJWT(params.mobile);
        } else if(verifyAuthority == 'superAdmin') {
            superAdminToken = ctx.helper.generateSuperAdminJWT(params.mobile);
        }
        //设置响应
        const msg = '注册成功！';
        ctx.helper.success({ ctx, token, adminToken, superAdminToken, msg });
    }

    async login() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(loginRule);
        //组装参数
        const params = ctx.request.body;
        //查找password并比较
        const res = await service.user.findOneUser(params.mobile);
        const verifyPsw = await ctx.compare(params.password, res.password);
        //密码错误
        if(!verifyPsw) {
            ctx.throw(404, '密码错误！');
        }
        //设置响应
        const token = ctx.helper.generateJWT(params.mobile);
        const nickname = res.nickname;
        //生成管理员token
        let adminToken = null;
        let superAdminToken = null;
        const verifyAuthority = await service.user.getAuthority(params.mobile);
        if(verifyAuthority == 'admin') {
            adminToken = ctx.helper.generateAdminJWT(params.mobile);
        } else if(verifyAuthority == 'superAdmin') {
            superAdminToken = ctx.helper.generateSuperAdminJWT(params.mobile);
        }
        const msg = '登录成功！';
        ctx.helper.success({ ctx, token, nickname, adminToken, superAdminToken, msg });
    }

    async changePassword() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(changePswRule);
        //组装参数
        const params = ctx.request.body;
        //校验token
        ctx.helper.verifyJWT(params.token, params.mobile);
        //设置响应
        const res = await service.user.updatePassword(params.mobile, params.password);
        const msg = '密码修改成功！';
        ctx.helper.success({ ctx, msg });
    }

    async changeNickname() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(changeNicknameRule);
        //组装参数
        const params = ctx.request.body;
        //校验token
        ctx.helper.verifyJWT(params.token, params.mobile);
        //设置响应
        const res = await service.user.updateNickname(params.mobile, params.nickname);
        const msg = '昵称修改成功！';
        ctx.helper.success({ ctx, msg });
    }

    //超级管理员权限
    async deleteUser() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(deleteUserRule);
        //组装参数
        const params = ctx.request.body;
        //校验token
        ctx.helper.verifyJWT(params.superAdminToken, params.mobile, 'superAdmin');
        //设置响应
        const res = await service.user.deleteOneUser(params.userMobile);
        const msg = '用户删除成功！';
        ctx.helper.success({ ctx, msg });
    }

    //超级管理员权限
    async hoistToAdmin() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(hoistRule);
        //组装参数
        const params = ctx.request.body;
        //校验token
        ctx.helper.verifyJWT(params.superAdminToken, params.mobile, 'superAdmin');
        //设置响应
        const res = await service.user.hoistToAdmin(params.userMobile);
        const msg = '提升至管理员成功！';
        ctx.helper.success({ ctx, msg });
    }

}

module.exports = UserController;
