var app = new Vue({
  el: '#app',
  data: {

  },
  mounted: function() {

  },
  methods: {
    deleteType: function(cid, name) {
      if(!confirm('确定要删除分类“'+name+'”?')) return;
      nkcAPI('/problem/type/' + cid, 'delete', {})
        .then(function() {
          window.location.href = '/problem/list?cid=0';
        })
        .catch(function(data) {
          screenTopWarning(data.error || data);
        })
    },
    modifyType: function(cid, name) {
      name = prompt('请输入分类名：', name);
      if(name === null) return;
      if(name === '') return screenTopWarning('分类名不能为空');
      nkcAPI('/problem/type/' + cid, 'PATCH', {name: name})
        .then(function() {
          window.location.reload();
        })
        .catch(function(data) {
          screenTopWarning(data.error || data);
        })
    },
    addType: function() {
      var name = prompt('请输入分类名：', '');
      if(name === null) return;
      if(name === '') return screenTopWarning('分类名不能为空');
      nkcAPI('/problem/type', 'POST', {name: name})
        .then(function() {
          window.location.reload();
        })
        .catch(function(data) {
          screenTopWarning(data.error || data);
        })
    },
    addProblem: function(typeId) {
      window.location.href = '/problem/add?cid=' + typeId;
    }
  }
});