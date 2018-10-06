const Controller = require('egg').Controller;

const searchAndPageRule = {
    search: {
        type: 'string',
        required: false,
        allowEmpty: true
    },
    page: {
        type: 'number',
        required: false,
        allowEmpty: true
    },
    pageSize: {
        type: 'number',
        required: false,
        allowEmpty: true
    }
};

const articleRule = {
    title: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    author: {
        type: 'string',
        required: false,
        allowEmpty: false
    },
    tag: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    summary: {
        type: 'string',
        required: true,
        allowEmpty: false
    },
    content: {
        type: 'string',
        required: true,
        allowEmpty: false
    }
};

const articleUpdateRule = {
    title: {
        type: 'string',
        required: false,
        allowEmpty: false
    },
    author: {
        type: 'string',
        required: false,
        allowEmpty: false
    },
    tag: {
        type: 'string',
        required: false,
        allowEmpty: false
    },
    summary: {
        type: 'string',
        required: false,
        allowEmpty: false
    },
    content: {
        type: 'string',
        required: false,
        allowEmpty: false
    }
};

class ArticleController extends Controller {
    // api===============================================
    async test() {
        const { ctx } = this;
        const msg = '测试成功！';
        ctx.helper.success({ ctx, msg });
    }

    async index() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(searchAndPageRule);
        //组装参数（模糊、分页查询）
        const params = ctx.request.body;
        const res = await service.article.findAllArticles(params);
        //设置响应
        const msg = '查找文章成功！';
        ctx.helper.success({ ctx, res, msg });
    }

    async create() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(articleRule);
        //组装参数
        const params = ctx.request.body;
        const res = await service.article.createOneArticle(params);
        //设置响应
        const msg = '创建文章成功！';
        ctx.helper.success({ ctx, res, msg });
    }

    async show() {
        const { ctx, service } = this;
        //组装参数
        const { id } = ctx.params;
        const res = await service.article.findOneArticle(id);
        //设置响应
        const msg = '查找文章成功！';
        ctx.helper.success({ ctx, res, msg });
    }

    async update() {
        const { ctx, service } = this;
        //校验参数
        ctx.validate(articleUpdateRule);
        //组装参数
        const { id } = ctx.params;
        const params = ctx.request.body;
        const res = await service.article.updateOneArticle(id, params);
        //设置响应
        const msg = '修改文章成功！';
        ctx.helper.success({ ctx, res, msg });
    }

    async destroy() {
        const { ctx, service } = this;
        //组装参数
        const { id } = ctx.params;
        const res = await service.article.deleteOneArticle(id);
        //设置响应
        const msg = '删除文章成功！';
        ctx.helper.success({ ctx, res, msg });
    }

}

module.exports = ArticleController;

