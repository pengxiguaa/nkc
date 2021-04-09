const mongoose = require("../settings/database");
const moment = require("moment");
const Schema = mongoose.Schema;
const schema = new Schema({
  _id: Number,
  // 专栏主
  uid: {
    type: String,
    required: true,
    index: 1
  },
  // 专栏logo
  avatar: {
    type: String,
    default: ""
  },
  // 专栏banner
  banner: {
    type: String,
    default: ""
  },
  // 专栏主上任记录 {uid: String, time: Date}
  userLogs: {
    type: Schema.Types.Mixed,
    required: true
  },
  color: {
    type: String,
    default: "#eee"
  },
  topped: {
    type: [Number],
    default: [],
    index: 1
  },
  // 专栏公告通知
  notice: {
    type: String,
    default: ""
  },
  noticeDisabled: {
    type: Boolean,
    default: false
  },
  // 专栏创建时间
  toc: {
    type: Date,
    default: Date.now,
    index: 1
  },
  // 专栏更新时间
  tlm: {
    type: Date,
    default: Date.now,
    index: 1
  },
  name: {
    type: String,
    required: true,
    index: 1
  },
  nameLowerCase: {
    type: String,
    required: true,
    index: 1
  },
  abbr: {
    type: String,
    required: true,
  },
  description: {
    type:  String,
    default: "",
  },
  // 是否关闭
  closed: {
    type: Boolean,
    default: false,
    index: 1
  },
  // 是否被屏蔽
  disabled: {
    type: Boolean,
    default: false,
    index: 1
  },
  // 专栏的关注数
  subCount: {
    type: Number,
    index: 1,
    default: 0
  },
  // 专栏文章数
  postCount: {
    type: Number,
    index: 1,
    default: 0,
  },
  // 自定义链接
  links: {
    type: Schema.Types.Mixed,
    default: []
  },
  linksDisabled: {
    type: Boolean,
    default: false
  },
  // 友情链接
  otherLinks: {
    type: Schema.Types.Mixed,
    default: []
  },
  otherLinksDisabled: {
    type: Boolean,
    default: false
  },
  // 自定义右侧豆腐块
  // {name, content, show}
  blocks: {
    type: Schema.Types.Mixed,
    default: []
  },
  blocksDisabled: {
    type: Boolean,
    default: false
  },
  // 展开分类，专栏导航显示一级分类
  navCategory: {
    type: Boolean,
    default: false
  },
  // 隐藏默认分类
  hideDefaultCategory: {
    type: Boolean,
    default: false,
  },
  // 每页内容条数
  perpage: {
    type: Number,
    default: 30
  },
  // 是否已经通知过管理员了
  contacted: {
    type: Boolean,
    default: false
  },
  // 专栏内文章总阅读数
  postHits: {
    type: Number,
    default: 0
  },
  // 专栏内文章的点赞数
  postVoteUp: {
    type: Number,
    default: 0
  },
  // 获赞数、阅读数的更新时间
  refreshTime: {
    type: Date,
    default: null,
  }
}, {
  collection: "columns"
});

/*
* 拓展专栏信息
* */
schema.methods.extendColumn = async function () {
  const ColumnModel = mongoose.model("columns");
  const columns = await ColumnModel.extendColumns([this]);
  return columns[0];
};
schema.statics.extendColumns = async (columns) => {
  const UserModel = mongoose.model("users");
  const uid = new Set();
  for(const c of columns) {
    uid.add(c.uid);
  }
  const users = await UserModel.find({uid: {$in: [...uid]}});
  const usersObj = {};
  users.map(user => {
    usersObj[user.uid] = user;
  });
  const results = [];
  for(let column of columns) {
    column = column.toObject();
    column.user = usersObj[column.uid];
    results.push(column);
  }
  return results;
};
/*
* 获取专栏时间线
* */
schema.statics.getTimeline = async (columnId) => {
  const ColumnPostModel = mongoose.model("columnPosts");
  const firstColumnPost = await ColumnPostModel.findOne({}, {top: 1}).sort({top: 1});
  if(!firstColumnPost) return [];
  const beginTime = firstColumnPost.top;
  const endTime = new Date();
  const begin = {
    year: beginTime.getFullYear(),
    month: beginTime.getMonth() + 1
  };
  const end = {
    year: endTime.getFullYear(),
    month: endTime.getMonth() + 1
  };

  const time = [];
  let n = 0;
  while(1) {
    n++;
    if(n > 1000) break;
    const t = {
      begin: new Date(`${begin.year}-${begin.month}-1 00:00:00`)
    };
    begin.month ++;
    if(begin.month >= 13) {
      begin.year ++;
      begin.month = 1;
    }
    t.end = new Date(`${begin.year}-${begin.month}-1 00:00:00`);
    time.push(t);
    if(begin.year > end.year && begin.month > end.month) break;
  }
  const results = [];
  for(const t of time) {
    const count = await ColumnPostModel.count({
      columnId,
      toc: {
        $gte: t.begin,
        $lt: t.end
      }
    });
    if(!count) continue;
    results.push({
      time: moment(t.begin).format("YYYY年MM月"),
      count
    });
  }
  return results.reverse();
};

/*
* 获取用户关注的专栏
* @param {String} uid 用户ID
* */
schema.statics.getUserSubColumns = async (uid) => {
  const subs = await mongoose.model("subscribes").find({
    type: "column",
    uid: uid
  }, {columnId: 1}).sort({toc: -1});
  const columns = [];
  for(const sub of subs) {
    const column = await mongoose.model("columns").findOne({_id: sub.columnId});
    if(column) columns.push(column);
  }
  return columns;
};
/*
* 更新专栏在搜索数据库中的数据
* */
schema.statics.toSearch = async (columnId) => {
  const ColumnModel = mongoose.model('columns');
  const column = await ColumnModel.findOne({_id: columnId});
  if(!column) {
    const err = new Error(`未找到ID为${columnId}的专栏`);
    err.status = 404;
    throw err;
  }
  await ColumnModel.saveColumnToElasticSearch(column);
};

/*
* 同步专栏数据到ES数据库
* @param {Object} column 专栏对象
* @author pengxiguaa 2020/7/7
* */
schema.statics.saveColumnToElasticSearch = async (column) => {
  if(!column) throwErr('专栏不能为空');
  const data = {
    username: column.name,
    description: column.abbr,
    uid: column.uid,
    toc: column.toc,
    tid: column._id
  };
  const es = require('../nkcModules/elasticSearch');
  await es.save('column', data);
};

/*
* 同步所有专栏数据到ES数据库
* @author pengxiguaa 2020/7/7
* */
schema.statics.saveAllColumnToElasticSearch = async () => {
  const ColumnModel = mongoose.model('columns');
  const count = await ColumnModel.count();
  const limit = 2000;
  for(let i = 0; i <= count; i+=limit) {
    const columns = await ColumnModel.find().sort({toc: 1}).skip(i).limit(limit);
    for(const column of columns) {
      await ColumnModel.saveColumnToElasticSearch(column);
    }
    console.log(`【同步Column到ES】 总：${count}, 当前：${i} - ${i + limit}`);
  }
  console.log(`【同步Column到ES】完成`);
};


/*
* 获取置顶专栏
* */
schema.statics.getToppedColumns = async (columnCount) => {
  const homeSettings = await mongoose.model("settings").getSettings("home");
  if(columnCount === undefined) {
    columnCount = homeSettings.columnCount;
  }
  const ColumnPostModel = mongoose.model('columnPosts');
  const PostModel = mongoose.model('posts');
  if(!homeSettings.columnsId.length) return [];
  let columnsId = [];
  if(homeSettings.columnsId.length <= columnCount) {
    columnsId = homeSettings.columnsId;
  } else {
    const {getRandomNumber$2} = require('../nkcModules/apiFunction');
    const arr = getRandomNumber$2({
      min: 0,
      max: homeSettings.columnsId.length - 1,
      count: columnCount,
      repeat: false
    });
    for(const index of arr) {
      columnsId.push(homeSettings.columnsId[index]);
    }
  }
  const columns = await mongoose.model("columns").find({_id: {$in: columnsId}}).sort({tlm: -1});
  columnsId = columns.map(c => c._id);
  const columnsObj = {};
  const postsId = [], columnIdObj = {};
  const tocObj = {};
  for(let column of columns) {
    let {_id} = column;
    columnsObj[column._id] = column;
    const columnPosts = await ColumnPostModel.find({
      columnId: _id,
      hidden: false,
      type: 'thread'
    }, {
      pid: 1,
      columnId: 1,
      toc: 1,
    }).sort({toc: -1}).limit(3);
    for(const cp of columnPosts) {
      const {pid, columnId, toc} = cp;
      tocObj[pid] = toc;
      if(!columnIdObj[columnId]) columnIdObj[columnId] = [];
      columnIdObj[columnId].push(pid);
      postsId.push(pid);
    }
  }
  const posts = await PostModel.find({pid: {$in: postsId}}, {
    pid: 1,
    tid: 1,
    t: 1,
  });
  const postsObj = {};
  posts.map(post => {
    post.toc = tocObj[post.pid];
    postsObj[post.pid] = post;
  });
  const results = [];
  columnsId.map(cid => {
    let column = columnsObj[cid];
    if(!column) return;
    column = column.toObject();
    const postsId = columnIdObj[column._id] || [];
    const posts = [];
    for(const pid of postsId) {
      const post = postsObj[pid];
      if(!post) continue;
      posts.push(post);
    }
    column.posts = posts;
    results.push(column);
  });
  return results;
};

/*
* 统计并设置专栏文章数
* @return {Number} 文章数
* @author pengxiguaa 2021-3-31
* */
schema.methods.updateBasicInfo = async function() {
  const ColumnPostModel = mongoose.model('columnPosts');
  const ThreadModel = mongoose.model('threads');
  const PostModel = mongoose.model('posts');
  const {_id} = this;
  const columnPosts = await ColumnPostModel.find({columnId: _id}, {pid: 1});
  const postsId = columnPosts.map(cp => cp.pid);
  const columnPostCount = columnPosts.length;
  let hits = await ThreadModel.aggregate([
    {
      $match: {
        oc: {$in: postsId}
      }
    },
    {
      $group: {
        _id: "count",
        count: {
          $sum: "$hits"
        }
      }
    }
  ]);
  hits = hits.length? hits[0].count: 0;
  let voteUp = await PostModel.aggregate([
    {
      $match: {
        pid: {$in: postsId}
      }
    },
    {
      $group: {
        _id: 'count',
        count: {
          $sum: "$voteUp"
        }
      }
    }
  ]);
  voteUp = voteUp.length? voteUp[0].count: 0;
  const lastPost = await ColumnPostModel.findOne({columnId: _id}, {toc: 1}).sort({toc: -1});
  this.postCount = columnPostCount;
  this.tlm = lastPost? lastPost.toc: this.toc;
  this.refreshTime = Date.now();
  this.postHits = hits;
  this.postVoteUp = voteUp;
  await this.save();
};

module.exports = mongoose.model("columns", schema);
