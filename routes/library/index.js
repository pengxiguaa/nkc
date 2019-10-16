const router = require("koa-router")();
const uploadRouter = require("./upload");
router
  .get("/", async (ctx, next) => {
    const {data, db, query, nkcModules} = ctx;
    const {fid, t = "all", page = 0} = query;
    data.t = t;
    data.fid = fid;
    const q = {
      forumsId: fid
    };
    if(t !== "all") {
      q.category = t;
    }
    const count = await db.ResourceModel.count(q);
    const paging = nkcModules.apiFunction.paging(page, count);
    const resources = await db.ResourceModel.find(q).sort({toc: -1}).skip(paging.start).limit(paging.perpage);
    const usersId = resources.map(r => r.uid);
    const users = await db.UserModel.find({uid: {$in: usersId}});
    const usersObj = {};
    users.map(u => {
      usersObj[u.uid] = u;
    });
    data.resources = [];
    for(const r of resources) {
      const resource = r.toObject();
      resource.user = usersObj[r.uid];
      data.resources.push(resource);
    }
    data.paging = paging;
    ctx.template = "library/library.pug";
    await next();
  })
  .use("/upload", uploadRouter.routes(), uploadRouter.allowedMethods());
module.exports = router;