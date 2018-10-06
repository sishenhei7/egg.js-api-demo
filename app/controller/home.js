'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }

  async test() {
    this.ctx.body = 'hi, this is a test!';
  }
}

module.exports = HomeController;
