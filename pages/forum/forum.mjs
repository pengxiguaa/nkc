const forumInfo = NKC.methods.getDataById('forumInfo');
const {fid, page, digest, sort} = forumInfo;

$(function() {
  const dom = $("#navbar_custom_dom");
  const leftDom = $("#leftDom");
  dom.html(leftDom.html());
  if(NKC.configs.lid) {
    window.Library = new NKC.modules.Library({
      lid: NKC.configs.lid,
      folderId: NKC.configs.folderId,
      tLid: NKC.configs.tLid,
      closed: NKC.configs.closed,
      uploadResourcesId: NKC.configs.uploadResourcesId?NKC.configs.uploadResourcesId.split("-"):[]
    });
  }
  const threadUrlSwitch = $('#threadUrlSwitch');
  if(threadUrlSwitch.length) {
    const threadUrlSwitchStatus = getThreadUrlSwitchStatus();
    modifyThreadUrl(threadUrlSwitchStatus);
    threadUrlSwitch.on("click", function() {
      const s = $(this).prop('checked');
      modifyThreadUrl(s);
    });
  }
  if(NKC.configs.uid) {
    connectForumRoom();
  }
});

const threadUrlSwitchKey = 'forum_thread_a_target';

function modifyThreadUrl(status) {
  var target = status? '_blank': '_self';
  $('.thread-panel-url').attr('target', target);
  $('#threadUrlSwitch').prop('checked', !!status);
  setThreadUrlSwitchStatus(status);
}
/*
* @return {Boolean}
* */
function getThreadUrlSwitchStatus() {
  return localStorage.getItem(threadUrlSwitchKey) === 'true';
}

function setThreadUrlSwitchStatus(status) {
  localStorage.setItem(threadUrlSwitchKey, status);
}

window.openEditSite = function() {
  const url = window.location.origin + "/editor?type=forum&id=" + fid;

  if(NKC.configs.platform === 'reactNative') {
    NKC.methods.rn.emit("openEditorPage", {
      url: url
    })
  } else if(NKC.configs.platform === 'apiCloud') {
    api.openWin({
      name: url,
      url: 'widget://html/common/editorInfo.html',
      pageParam: {
        realUrl: url,
        shareType: "common"
      }
    })
  } else {
    NKC.methods.visitUrl(url, true);
  }
}

/*
* 连入房间
* */
function joinRoom() {
  socket.emit('joinRoom', {
    type: 'forum',
    data: {
      forumId: fid
    }
  });
}

/*
* 连接上专业房间
* */
function connectForumRoom() {
  socket.on('connect', function() {
    joinRoom();
  });
  socket.on('forumMessage', function(data) {
    const {html, tid, contentType} = data;
    const threadList = $('div.normal-thread-list');
    let targetThread = threadList.find('div[data-tid="'+tid+'"]') || {a: 1};
    if(
      page === 0 && // 处于专业首页
      digest === data.digest &&
      (contentType === 'thread' || sort === 'tlm') // 发表文章或发表回复且按回复排序
    ) {
      // 处于专业首页 更新时先移除旧元素再在列表头部插入新元素
      targetThread.remove();
      targetThread = $(html);
      threadList.prepend(targetThread);
    } else {
      if(!targetThread) return;
    }

    let count = NKC.methods.getThreadListNewPostCount(tid);

    count ++;

    NKC.methods.setThreadListNewPostCount(tid, count);

    setThreadListNewCount(tid, count);

    createMouseEvents();

  });
  if(socket.connected) {
    joinRoom();
  }

  createTimeoutToUpdateThreadListCount();
  createClickEventToUpdateThreadListCount();
  updateThreadListCount();
}

/*
* 设置一个10秒的定时器 定时从本地获取条数更新dom
* @author pengxiguaa 2020-12-11
* */
function createTimeoutToUpdateThreadListCount() {
  setTimeout(() => {
    updateThreadListCount();
    createTimeoutToUpdateThreadListCount();
  }, 10 * 1000);
}
function createClickEventToUpdateThreadListCount() {
  document.body.addEventListener('click', function(e) {
    let target = e.target;
    if(target.tagName.toLowerCase() !== 'a') return;
    target = $(target);
    const href = target.attr('href');
    const reg = /^\/t\/([0-9]+)\??/ig;
    if(!reg.test(href)) return;
    const tid = RegExp.$1;
    NKC.methods.setThreadListNewPostCount(tid, 0);
    setThreadListNewCount(tid, 0);
  });
}
/*
* 从本地获取数据更新dom
* @author pengxiguaa 2020-12-11
* */
function updateThreadListCount() {
  const threadList = $('div.normal-thread-list');
  const threads = threadList.find('.thread-panel');
  for(let i = 0; i < threads.length; i++) {
    const thread = threads.eq(i);
    const tid = thread.attr('data-tid');
    const count = NKC.methods.getThreadListNewPostCount(tid);
    setThreadListNewCount(tid, count);
  }
}

/*
* 添加鼠标事件
* @author pengxiguaa 2020-12-11
* */
function createMouseEvents() {
  floatUserPanel.initPanel();
  floatForumPanel.initPanel();
}

/*
* 设置文章的未读数
* @param {String} tid 文章ID
* @param {Number} count 未读数
* @author pengxiguaa 2020-12-11
* */
function setThreadListNewCount(tid, count) {
  const threadList = $('div.normal-thread-list');
  const targetThread = threadList.find('div[data-tid="'+tid+'"]');
  if(!targetThread.length) return;
  const targetThreadCounter = threadList.find('div[data-tid="'+tid+'"] span.thread-panel-counter');
  targetThreadCounter.remove();
  if(count === 0) return;
  const newCounter = $("<span class='thread-panel-counter' data-count='"+count+"' title='"+count+"条更新'>"+count+"</span>");
  targetThread.prepend(newCounter);
}
