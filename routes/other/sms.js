const Router = require('koa-router');
const smsRouter = new Router();
const nkcModules = require('../../nkcModules');
const settings = require('../../settings');
let {perpage} = settings.paging;
let dbFn = nkcModules.dbFunction;
let apiFn = nkcModules.apiFunction;

smsRouter
  .get(['/','/replies'], async (ctx, next) => {
    let {db} = ctx;
    let {user} = ctx.data;
    let page = ctx.query.page || 0;
    let replies = await db.RepliesModel.find({toUid: user.uid}).sort({toc: -1});
    let repliesLength = replies.length;
    let paging = apiFn.paging(page, repliesLength);
    let start = paging.start;
    replies = replies.slice(start, start + perpage);
    let replieArr = [];
    for (let replie of replies) {
      let fromUser = {};
      let fromPost = await db.PostModel.findOne({pid: replie.fromPid, disabled: false});
      if(!fromPost) continue;
      fromUser = await db.UserModel.findOne({uid: fromPost.uid});
      let toUser = await db.UserModel.findOne({uid: user.uid});
      let toPost = await db.PostModel.findOne({pid: replie.toPid});
      replieArr.push({
        replie,
        fromPost,
        fromUser,
        toUser,
        toPost
      });
    }
    ctx.data.docs = replieArr;
    let pageCount = Math.ceil(repliesLength/perpage);
    ctx.data.paging = paging;
    ctx.data.tab = 'replies';
    ctx.template = 'interface_messages.pug';
    await dbFn.decrementPsnl(user.uid, 'replies');
    await next();
  })
  .get('/at', async (ctx, next) => {
    let {user} = ctx.data;
    let {db} = ctx;
    let page = ctx.query.page || 0;
    let ats = await db.InviteModel.find({invitee: user.uid}).sort({toc: -1});
    let atsLength = ats.length;
    let paging = apiFn.paging(page, atsLength);
    let start = paging.start;
    ats = ats.slice(start, start + perpage);
    let atsArr = [];
    for (let at of ats) {
      let post = await db.PostModel.findOne({pid: at.pid});
      if(!post) continue;
      let user = await db.UserModel.findOne({uid: at.inviter});
      let thread = await db.ThreadModel.findOne({tid: post.tid});
      let oc = await db.PostModel.findOne({pid: thread.oc});
      atsArr.push({
        at,
        post,
        user,
        thread,
        oc
      });
    }
    ctx.data.docs = atsArr;
    ctx.data.paging = paging;
    ctx.data.tab = 'at';
    ctx.template = 'interface_messages.pug';
    await dbFn.decrementPsnl(user.uid, 'at');
    await next();
  })
  .get('/message', async (ctx, next) => {
    //conversation
    let {user} = ctx.data;
    let {db} = ctx;
    let page = ctx.query.page || 0;
    let rUser = await SmsModel.aggregate([
      {$match: {$or: [{r: user.uid},{s: user.uid}]}},
      {$group: {_id: '$r', r: {$push: {}}}}
    ]);
    console.log(rUser);
    let messages = await db.SmsModel.find().or([{r: user.uid}, {s: user.uid}]).sort({toc: -1});
    let docs = [];
    for (let i of messages) {
      let uid = (i.r === user.uid)? i.s: i.r;
      let targetUser = await db.UserModel.findOne({uid: uid});

    }
    let messagesLength = messages.length;
    let paging = apiFn.paging(page, messagesLength);
    let start = paging.start;
    messages = messages.slice(start, start + perpage);
    let messagesArr = {};
    for (let i of messages) {

    }
  })
  .get('/message/:uid', async (ctx, next) => {
    let {user} = ctx.data;
    let {uid} = ctx.params;
    let {db} = ctx;
    let page = ctx.query.page || 0;
    let targetUser = await db.UserModel.findOne({uid: uid});
    let messageOfUser = await db.SmsModel.find().and([{fromSystem: false, }, {$or: [{s: user.uid, r: targetUser.uid}, {s: targetUser.uid, r: user.uid}]}]).sort({toc: -1});
    let paging = apiFn.paging(page, messageOfUser.length);
    let start = paging.start;
    let messageArr = messageOfUser.slice(start, start + perpage);
    let findUserByUid = (uid) => {
      if(uid === user.uid) return user;
      if(uid === targetUser.uid) return targetUser;
      ctx.throw(500, '服务器查询聊天记录出错。');
    };
    for (let i = 0; i < messageArr.length; i++) {
      messageArr[i] = messageArr[i].toObject();
      messageArr[i].s = findUserByUid(messageArr[i].s);
      messageArr[i].r = findUserByUid(messageArr[i].r);
    }
    ctx.data.paging = paging;
    ctx.data.docs = messageArr;
    ctx.data.targetUser = targetUser;
    ctx.template = 'interface_messages.pug';
    ctx.data.tab = 'message';
    for (let m of messageOfUser) {
      //console.log(m);
    }
    await next();
  })
  .post('/message', async (ctx, next) => {
    let {user} = ctx.data;
    let {db} = ctx;
    let {username, content} = ctx.body;
    if(!username || !content) ctx.throw(400, '参数不完整。');
    let targetUser = await db.UserModel.findOne({username: username});
    if(!targetUser) ctx.throw(400, '该用户不存在，请检查用户名是否输入正确');
    let newSms = new SmsModel({
      s: user.uid,
      r: targetUser.uid,
      c: content,
      // port:
    });
  })
  .get('/system', async (ctx, next) => {
    let {user} = ctx.data;
    let {db} = ctx;
    let page = ctx.query.page || 0;
    let systemMessages = await db.SmsModel.find({fromSystem: true}).sort({toc: -1});
    let paging = apiFn.paging(page, systemMessages.length);
    let start = paging.start;
    systemMessageArr = systemMessages.slice(start, start + perpage);
    ctx.data.docs = systemMessageArr;
    ctx.data.paging = paging;
    ctx.data.tab = 'system';
    ctx.template = 'interface_messages.pug';
    await next();
  })
  .get('/system/:sid', async (ctx, next) => {
    let {user} = ctx.data;
    let {db} = ctx;
    let {sid} = ctx.params;
    ctx.data.docs = await db.SmsModel.findOneAndUpdate({sid: sid}, {$addToSet: {viewedUsers: user.uid}});
    ctx.data.tab = 'system';
    ctx.template = 'interface_messages.pug';
    await next();
  });

module.exports = smsRouter;