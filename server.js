require('./global');
const fs = require('fs');

process.on('uncaughtException', function (err) {
  console.log(`uncaughtException:`);
  console.log(err.stack || err.message || err);
});

if(!fs.existsSync('./install/install.lock')) {
  return require('./install/server.js')
}

// 启动测试环境相关工具
if(global.NKC.NODE_ENV !== "production") {
  require('./watch.js');
}

require('colors');
const http = require('http'),
  app = require('./app'),
  elasticSearch = require("./nkcModules/elasticSearch"),
  settings = require('./settings'),
  serverConfig = require('./config/server'),
  socket = require('./socket'),
  {updateDate, upload} = settings,
  {
    RoleModel,
    ForumModel,
  } = require('./dataModels'),
  permission = require('./nkcModules/permission');
let server;

const dataInit = async () => {
  const defaultData = require('./defaultData');
  await defaultData.init();
  // 运维包含所有的操作权限
  const operationsId = permission.getOperationsId();
  await RoleModel.updateOne({_id: 'dev'}, {$set: {operationsId: operationsId}});
  await ForumModel.updateMany({}, {$addToSet: {rolesId: 'dev'}});
};

// 定时任务 每天固定时间执行
const jobsInit = async () => {
  const jobs = require('./scheduleJob');
  jobs.updateActiveUsers(updateDate.updateActiveUsersCronStr);
  jobs.clearForumAndThreadPostCount();
  jobs.shop();
  jobs.backupDatabase();
  jobs.moveRecycleMarkThreads();
  jobs.clearFileCache();
  jobs.preparationForumCheck();    // 检查筹备专业
};

// 定时任务 隔一段时间执行
const timedTasksInit = async () => {
 const timedTasks = require("./timedTasks");
 await timedTasks.cacheActiveUsers();
 await timedTasks.clearTimeoutPageCache();
 await timedTasks.updateRecommendThreads();
 await timedTasks.clearResourceState();
 await timedTasks.updateAllForumLatestThread();
 await timedTasks.updateForumsMessage();
};

const start = async () => {
  try {
    if(global.NKC.processId === 0) {
      const cacheBaseInfo = require('./redis/cache');
      await dataInit();
      await jobsInit();
      await upload.initFolders();
      await cacheBaseInfo();
      await timedTasksInit();
    }
    await elasticSearch.init();
    console.log('ElasticSearch is ready...'.green);

    const port = Number(serverConfig.port) + global.NKC.processId;
    const address = serverConfig.address;
    server = http.createServer(app);
    server.keepAliveTimeout = 10 * 1000;
    server.listen(port, address, async () => {
      await socket(server);
      console.log(`nkc ${global.NKC.NODE_ENV} server listening on ${port}`.green);
    });

  } catch(err) {
    console.error(`error occured when initialize the server.\n${err.stack}`.red);
    process.exit(-1)
  }
};

start();
