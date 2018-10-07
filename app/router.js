'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  //首页
  // router.get('/test', controller.home.test);
  router.get('/', controller.home.index);
  router.get('/test', controller.home.test);

  //user
  router.get('/api/test', controller.user.test);
  router.post('/api/user', controller.user.index);
  router.post('/api/user/verifyLogin', controller.user.verifyLogin);
  router.post('/api/user/signUp', controller.user.signUp);
  router.post('/api/user/login', controller.user.login);
  router.post('/api/user/changePassword', controller.user.changePassword);
  router.post('/api/user/deleteUser', controller.user.deleteUser);
  router.post('/api/user/hoistToAdmin', controller.user.hoistToAdmin);
  router.post('/api/user/changeNickname', controller.user.changeNickname);

  //article
  router.get('/api/article/test', controller.article.test);
  // router.get('/api/article', controller.article.index);
  // router.post('/api/article', controller.article.create);
  // router.get('/api/article/:id', controller.article.show);
  // router.put('/api/article/:id', controller.article.update);
  // router.delete('/api/article/:id', controller.article.destroy);
  router.resources('article', '/api/article', controller.article);

  //inviteCode
  router.get('/api/inviteCode', controller.inviteCode.index);
};
