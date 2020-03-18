(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var data = NKC.methods.getDataById("data");
data.note.notes.map(function (note) {
  note.edit = false;
  note.options = false;
});
var app = new Vue({
  el: "#note",
  data: {
    uid: NKC.configs.uid,
    note: data.note,
    content: ""
  },
  mounted: function mounted() {
    document.body.addEventListener("click", function (e) {
      if (e.target.classList.contains("note-options-icon")) return;
      app.note.notes.map(function (note) {
        return note.options = false;
      });
    });
  },
  methods: {
    visitUrl: NKC.methods.visitUrl,
    getUrl: NKC.methods.tools.getUrl,
    fromNow: NKC.methods.fromNow,
    openOptions: function openOptions(nc) {
      app.note.notes.map(function (note) {
        return note.options = false;
      });
      nc.options = !nc.options;
    },
    resetTextarea: function resetTextarea(nc) {
      var textArea;

      if (!nc) {
        textArea = this.$refs.newNote;
      } else {
        textArea = this.$refs[nc._id][0];
      }

      if (!textArea) return;
      var rem = 3;
      var num = rem * 12;
      textArea.style.height = rem + 'rem';

      if (num < textArea.scrollHeight) {
        textArea.style.height = textArea.scrollHeight + 'px';
      }
    },
    saveNewNote: function saveNewNote() {
      // 创建新的
      var content = this.content,
          note = this.note;
      Promise.resolve().then(function () {
        if (!content) throw "请输入笔记内容";
        var type = note.type,
            targetId = note.targetId,
            _id = note._id;
        return nkcAPI("/note", "POST", {
          _id: _id,
          type: type,
          targetId: targetId,
          content: content
        });
      }).then(function (data) {
        app.content = "";
        data.note.notes.map(function (note) {
          note.options = false;
          note.edit = false;
        });
        app.note = data.note;
        setTimeout(function () {
          app.resetTextarea();
        }, 50);
      })["catch"](sweetError);
    },
    saveNote: function saveNote(n) {
      // 保存编辑
      var note = this.note,
          uid = this.uid;
      var url,
          method,
          data = {};

      if (n.uid === uid) {
        url = "/note/".concat(note._id, "/c/").concat(n._id);
        method = "PATCH";
        data.content = n.content;
      } else {
        url = "/nkc/note";
        method = "POST";
        data.type = "modify";
        data.noteId = note._id;
        data.noteContentId = n._id;
        data.content = n.content;
      }

      nkcAPI(url, method, data).then(function (data) {
        n.html = data.noteContentHTML;
        app.modifyNoteContent(n);
        Vue.set(note.notes, note.notes.indexOf(n), n);
      })["catch"](sweetError);
    },
    modifyNoteContent: function modifyNoteContent(nc) {
      nc.edit = !nc.edit;

      if (nc.edit) {
        setTimeout(function () {
          app.resetTextarea(nc);
        }, 50);
      }
    },
    deleteNoteContent: function deleteNoteContent(n, type) {
      var note = this.note;
      var url,
          method,
          data = {};

      if (type === "delete") {
        url = "/note/".concat(note._id, "/c/").concat(n._id);
        method = "DELETE";
      } else {
        method = "POST";
        url = "/nkc/note";

        if (n.disabled) {
          data.type = "cancelDisable";
        } else {
          data.type = "disable";
        }

        data.noteId = note._id;
        data.noteContentId = n._id;
      }

      sweetQuestion("确定要执行此操作？").then(function () {
        return nkcAPI(url, method, data);
      }).then(function () {
        if (type === "delete") {
          n.deleted = true;
        } else {
          n.disabled = !n.disabled;
        }

        sweetSuccess("操作成功");
      })["catch"](sweetError);
    }
  }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9fYnJvd3Nlci1wYWNrQDYuMS4wQGJyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInBhZ2VzL25vdGUvbm90ZS5tanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFKLENBQVksV0FBWixDQUF3QixNQUF4QixDQUFiO0FBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFWLENBQWdCLEdBQWhCLENBQW9CLFVBQUEsSUFBSSxFQUFJO0FBQzFCLEVBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxLQUFaO0FBQ0EsRUFBQSxJQUFJLENBQUMsT0FBTCxHQUFlLEtBQWY7QUFDRCxDQUhEO0FBSUEsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFKLENBQVE7QUFDbEIsRUFBQSxFQUFFLEVBQUUsT0FEYztBQUVsQixFQUFBLElBQUksRUFBRTtBQUNKLElBQUEsR0FBRyxFQUFFLEdBQUcsQ0FBQyxPQUFKLENBQVksR0FEYjtBQUVKLElBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUZQO0FBR0osSUFBQSxPQUFPLEVBQUU7QUFITCxHQUZZO0FBT2xCLEVBQUEsT0FQa0IscUJBT1I7QUFDUixJQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsZ0JBQWQsQ0FBK0IsT0FBL0IsRUFBd0MsVUFBQyxDQUFELEVBQU87QUFDN0MsVUFBRyxDQUFDLENBQUMsTUFBRixDQUFTLFNBQVQsQ0FBbUIsUUFBbkIsQ0FBNEIsbUJBQTVCLENBQUgsRUFBcUQ7QUFDckQsTUFBQSxHQUFHLENBQUMsSUFBSixDQUFTLEtBQVQsQ0FBZSxHQUFmLENBQW1CLFVBQUEsSUFBSTtBQUFBLGVBQUksSUFBSSxDQUFDLE9BQUwsR0FBZSxLQUFuQjtBQUFBLE9BQXZCO0FBQ0QsS0FIRDtBQUlELEdBWmlCO0FBYWxCLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxRQUFRLEVBQUUsR0FBRyxDQUFDLE9BQUosQ0FBWSxRQURmO0FBRVAsSUFBQSxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQUosQ0FBWSxLQUFaLENBQWtCLE1BRm5CO0FBR1AsSUFBQSxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQUosQ0FBWSxPQUhkO0FBSVAsSUFBQSxXQUpPLHVCQUlLLEVBSkwsRUFJUztBQUNkLE1BQUEsR0FBRyxDQUFDLElBQUosQ0FBUyxLQUFULENBQWUsR0FBZixDQUFtQixVQUFBLElBQUk7QUFBQSxlQUFJLElBQUksQ0FBQyxPQUFMLEdBQWUsS0FBbkI7QUFBQSxPQUF2QjtBQUNBLE1BQUEsRUFBRSxDQUFDLE9BQUgsR0FBYSxDQUFDLEVBQUUsQ0FBQyxPQUFqQjtBQUNELEtBUE07QUFRUCxJQUFBLGFBUk8seUJBUU8sRUFSUCxFQVFXO0FBQ2hCLFVBQUksUUFBSjs7QUFDQSxVQUFHLENBQUMsRUFBSixFQUFRO0FBQ04sUUFBQSxRQUFRLEdBQUcsS0FBSyxLQUFMLENBQVcsT0FBdEI7QUFDRCxPQUZELE1BRU87QUFDTCxRQUFBLFFBQVEsR0FBRyxLQUFLLEtBQUwsQ0FBVyxFQUFFLENBQUMsR0FBZCxFQUFtQixDQUFuQixDQUFYO0FBQ0Q7O0FBQ0QsVUFBRyxDQUFDLFFBQUosRUFBYztBQUNkLFVBQU0sR0FBRyxHQUFHLENBQVo7QUFDQSxVQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBbEI7QUFDQSxNQUFBLFFBQVEsQ0FBQyxLQUFULENBQWUsTUFBZixHQUF3QixHQUFHLEdBQUcsS0FBOUI7O0FBQ0EsVUFBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLFlBQWxCLEVBQWdDO0FBQzlCLFFBQUEsUUFBUSxDQUFDLEtBQVQsQ0FBZSxNQUFmLEdBQXdCLFFBQVEsQ0FBQyxZQUFULEdBQXdCLElBQWhEO0FBQ0Q7QUFDRixLQXRCTTtBQXVCUCxJQUFBLFdBdkJPLHlCQXVCTztBQUNaO0FBRFksVUFFTCxPQUZLLEdBRVksSUFGWixDQUVMLE9BRks7QUFBQSxVQUVJLElBRkosR0FFWSxJQUZaLENBRUksSUFGSjtBQUdaLE1BQUEsT0FBTyxDQUFDLE9BQVIsR0FDRyxJQURILENBQ1EsWUFBTTtBQUNWLFlBQUcsQ0FBQyxPQUFKLEVBQWEsTUFBTSxTQUFOO0FBREgsWUFFSCxJQUZHLEdBRW9CLElBRnBCLENBRUgsSUFGRztBQUFBLFlBRUcsUUFGSCxHQUVvQixJQUZwQixDQUVHLFFBRkg7QUFBQSxZQUVhLEdBRmIsR0FFb0IsSUFGcEIsQ0FFYSxHQUZiO0FBR1YsZUFBTyxNQUFNLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0I7QUFDN0IsVUFBQSxHQUFHLEVBQUgsR0FENkI7QUFFN0IsVUFBQSxJQUFJLEVBQUosSUFGNkI7QUFHN0IsVUFBQSxRQUFRLEVBQVIsUUFINkI7QUFJN0IsVUFBQSxPQUFPLEVBQVA7QUFKNkIsU0FBbEIsQ0FBYjtBQU1ELE9BVkgsRUFXRyxJQVhILENBV1EsVUFBQSxJQUFJLEVBQUk7QUFDWixRQUFBLEdBQUcsQ0FBQyxPQUFKLEdBQWMsRUFBZDtBQUNBLFFBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFWLENBQWdCLEdBQWhCLENBQW9CLFVBQUEsSUFBSSxFQUFJO0FBQzFCLFVBQUEsSUFBSSxDQUFDLE9BQUwsR0FBZSxLQUFmO0FBQ0EsVUFBQSxJQUFJLENBQUMsSUFBTCxHQUFZLEtBQVo7QUFDRCxTQUhEO0FBSUEsUUFBQSxHQUFHLENBQUMsSUFBSixHQUFXLElBQUksQ0FBQyxJQUFoQjtBQUNBLFFBQUEsVUFBVSxDQUFDLFlBQU07QUFDZixVQUFBLEdBQUcsQ0FBQyxhQUFKO0FBQ0QsU0FGUyxFQUVQLEVBRk8sQ0FBVjtBQUdELE9BckJILFdBc0JTLFVBdEJUO0FBdUJELEtBakRNO0FBa0RQLElBQUEsUUFsRE8sb0JBa0RFLENBbERGLEVBa0RLO0FBQ1Y7QUFEVSxVQUVILElBRkcsR0FFVSxJQUZWLENBRUgsSUFGRztBQUFBLFVBRUcsR0FGSCxHQUVVLElBRlYsQ0FFRyxHQUZIO0FBR1YsVUFBSSxHQUFKO0FBQUEsVUFBUyxNQUFUO0FBQUEsVUFBaUIsSUFBSSxHQUFHLEVBQXhCOztBQUNBLFVBQUcsQ0FBQyxDQUFDLEdBQUYsS0FBVSxHQUFiLEVBQWtCO0FBQ2hCLFFBQUEsR0FBRyxtQkFBWSxJQUFJLENBQUMsR0FBakIsZ0JBQTBCLENBQUMsQ0FBQyxHQUE1QixDQUFIO0FBQ0EsUUFBQSxNQUFNLEdBQUcsT0FBVDtBQUNBLFFBQUEsSUFBSSxDQUFDLE9BQUwsR0FBZSxDQUFDLENBQUMsT0FBakI7QUFDRCxPQUpELE1BSU87QUFDTCxRQUFBLEdBQUcsY0FBSDtBQUNBLFFBQUEsTUFBTSxHQUFHLE1BQVQ7QUFDQSxRQUFBLElBQUksQ0FBQyxJQUFMLEdBQVksUUFBWjtBQUNBLFFBQUEsSUFBSSxDQUFDLE1BQUwsR0FBYyxJQUFJLENBQUMsR0FBbkI7QUFDQSxRQUFBLElBQUksQ0FBQyxhQUFMLEdBQXFCLENBQUMsQ0FBQyxHQUF2QjtBQUNBLFFBQUEsSUFBSSxDQUFDLE9BQUwsR0FBZSxDQUFDLENBQUMsT0FBakI7QUFDRDs7QUFDRCxNQUFBLE1BQU0sQ0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLElBQWQsQ0FBTixDQUNHLElBREgsQ0FDUSxVQUFDLElBQUQsRUFBVTtBQUNkLFFBQUEsQ0FBQyxDQUFDLElBQUYsR0FBUyxJQUFJLENBQUMsZUFBZDtBQUNBLFFBQUEsR0FBRyxDQUFDLGlCQUFKLENBQXNCLENBQXRCO0FBQ0EsUUFBQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQUksQ0FBQyxLQUFiLEVBQW9CLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWCxDQUFtQixDQUFuQixDQUFwQixFQUEyQyxDQUEzQztBQUNELE9BTEgsV0FNUyxVQU5UO0FBT0QsS0F6RU07QUEwRVAsSUFBQSxpQkExRU8sNkJBMEVXLEVBMUVYLEVBMEVlO0FBQ3BCLE1BQUEsRUFBRSxDQUFDLElBQUgsR0FBVSxDQUFDLEVBQUUsQ0FBQyxJQUFkOztBQUNBLFVBQUcsRUFBRSxDQUFDLElBQU4sRUFBWTtBQUNWLFFBQUEsVUFBVSxDQUFDLFlBQU07QUFDZixVQUFBLEdBQUcsQ0FBQyxhQUFKLENBQWtCLEVBQWxCO0FBQ0QsU0FGUyxFQUVQLEVBRk8sQ0FBVjtBQUdEO0FBQ0YsS0FqRk07QUFrRlAsSUFBQSxpQkFsRk8sNkJBa0ZXLENBbEZYLEVBa0ZjLElBbEZkLEVBa0ZvQjtBQUFBLFVBQ2xCLElBRGtCLEdBQ1YsSUFEVSxDQUNsQixJQURrQjtBQUV6QixVQUFJLEdBQUo7QUFBQSxVQUFTLE1BQVQ7QUFBQSxVQUFpQixJQUFJLEdBQUcsRUFBeEI7O0FBQ0EsVUFBRyxJQUFJLEtBQUssUUFBWixFQUFzQjtBQUNwQixRQUFBLEdBQUcsbUJBQVksSUFBSSxDQUFDLEdBQWpCLGdCQUEwQixDQUFDLENBQUMsR0FBNUIsQ0FBSDtBQUNBLFFBQUEsTUFBTSxHQUFHLFFBQVQ7QUFDRCxPQUhELE1BR087QUFDTCxRQUFBLE1BQU0sR0FBRyxNQUFUO0FBQ0EsUUFBQSxHQUFHLGNBQUg7O0FBQ0EsWUFBRyxDQUFDLENBQUMsUUFBTCxFQUFlO0FBQ2IsVUFBQSxJQUFJLENBQUMsSUFBTCxHQUFZLGVBQVo7QUFDRCxTQUZELE1BRU87QUFDTCxVQUFBLElBQUksQ0FBQyxJQUFMLEdBQVksU0FBWjtBQUNEOztBQUNELFFBQUEsSUFBSSxDQUFDLE1BQUwsR0FBYyxJQUFJLENBQUMsR0FBbkI7QUFDQSxRQUFBLElBQUksQ0FBQyxhQUFMLEdBQXFCLENBQUMsQ0FBQyxHQUF2QjtBQUNEOztBQUNELE1BQUEsYUFBYSxDQUFDLFdBQUQsQ0FBYixDQUNHLElBREgsQ0FDUSxZQUFNO0FBQ1YsZUFBTyxNQUFNLENBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxJQUFkLENBQWI7QUFDRCxPQUhILEVBSUcsSUFKSCxDQUlRLFlBQVc7QUFDZixZQUFHLElBQUksS0FBSyxRQUFaLEVBQXNCO0FBQ3BCLFVBQUEsQ0FBQyxDQUFDLE9BQUYsR0FBWSxJQUFaO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsVUFBQSxDQUFDLENBQUMsUUFBRixHQUFhLENBQUMsQ0FBQyxDQUFDLFFBQWhCO0FBQ0Q7O0FBQ0QsUUFBQSxZQUFZLENBQUMsTUFBRCxDQUFaO0FBQ0QsT0FYSCxXQVlTLFVBWlQ7QUFhRDtBQWhITTtBQWJTLENBQVIsQ0FBWiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGRhdGEgPSBOS0MubWV0aG9kcy5nZXREYXRhQnlJZChcImRhdGFcIik7XHJcbmRhdGEubm90ZS5ub3Rlcy5tYXAobm90ZSA9PiB7XHJcbiAgbm90ZS5lZGl0ID0gZmFsc2U7XHJcbiAgbm90ZS5vcHRpb25zID0gZmFsc2U7XHJcbn0pO1xyXG5jb25zdCBhcHAgPSBuZXcgVnVlKHtcclxuICBlbDogXCIjbm90ZVwiLFxyXG4gIGRhdGE6IHtcclxuICAgIHVpZDogTktDLmNvbmZpZ3MudWlkLFxyXG4gICAgbm90ZTogZGF0YS5ub3RlLFxyXG4gICAgY29udGVudDogXCJcIlxyXG4gIH0sXHJcbiAgbW91bnRlZCgpIHtcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIm5vdGUtb3B0aW9ucy1pY29uXCIpKSByZXR1cm47XHJcbiAgICAgIGFwcC5ub3RlLm5vdGVzLm1hcChub3RlID0+IG5vdGUub3B0aW9ucyA9IGZhbHNlKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgdmlzaXRVcmw6IE5LQy5tZXRob2RzLnZpc2l0VXJsLFxyXG4gICAgZ2V0VXJsOiBOS0MubWV0aG9kcy50b29scy5nZXRVcmwsXHJcbiAgICBmcm9tTm93OiBOS0MubWV0aG9kcy5mcm9tTm93LFxyXG4gICAgb3Blbk9wdGlvbnMobmMpIHtcclxuICAgICAgYXBwLm5vdGUubm90ZXMubWFwKG5vdGUgPT4gbm90ZS5vcHRpb25zID0gZmFsc2UpO1xyXG4gICAgICBuYy5vcHRpb25zID0gIW5jLm9wdGlvbnM7XHJcbiAgICB9LFxyXG4gICAgcmVzZXRUZXh0YXJlYShuYykge1xyXG4gICAgICBsZXQgdGV4dEFyZWE7XHJcbiAgICAgIGlmKCFuYykge1xyXG4gICAgICAgIHRleHRBcmVhID0gdGhpcy4kcmVmcy5uZXdOb3RlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRleHRBcmVhID0gdGhpcy4kcmVmc1tuYy5faWRdWzBdO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKCF0ZXh0QXJlYSkgcmV0dXJuO1xyXG4gICAgICBjb25zdCByZW0gPSAzO1xyXG4gICAgICBjb25zdCBudW0gPSByZW0gKiAxMjtcclxuICAgICAgdGV4dEFyZWEuc3R5bGUuaGVpZ2h0ID0gcmVtICsgJ3JlbSc7XHJcbiAgICAgIGlmKG51bSA8IHRleHRBcmVhLnNjcm9sbEhlaWdodCkge1xyXG4gICAgICAgIHRleHRBcmVhLnN0eWxlLmhlaWdodCA9IHRleHRBcmVhLnNjcm9sbEhlaWdodCArICdweCc7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzYXZlTmV3Tm90ZSgpIHtcclxuICAgICAgLy8g5Yib5bu65paw55qEXHJcbiAgICAgIGNvbnN0IHtjb250ZW50LCBub3RlfSA9IHRoaXM7XHJcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgaWYoIWNvbnRlbnQpIHRocm93IFwi6K+36L6T5YWl56yU6K6w5YaF5a65XCI7XHJcbiAgICAgICAgICBjb25zdCB7dHlwZSwgdGFyZ2V0SWQsIF9pZH0gPSBub3RlO1xyXG4gICAgICAgICAgcmV0dXJuIG5rY0FQSShcIi9ub3RlXCIsIFwiUE9TVFwiLCB7XHJcbiAgICAgICAgICAgIF9pZCxcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgdGFyZ2V0SWQsXHJcbiAgICAgICAgICAgIGNvbnRlbnRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICBhcHAuY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICBkYXRhLm5vdGUubm90ZXMubWFwKG5vdGUgPT4ge1xyXG4gICAgICAgICAgICBub3RlLm9wdGlvbnMgPSBmYWxzZTtcclxuICAgICAgICAgICAgbm90ZS5lZGl0ID0gZmFsc2U7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGFwcC5ub3RlID0gZGF0YS5ub3RlO1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGFwcC5yZXNldFRleHRhcmVhKCk7XHJcbiAgICAgICAgICB9LCA1MClcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChzd2VldEVycm9yKTtcclxuICAgIH0sXHJcbiAgICBzYXZlTm90ZShuKSB7XHJcbiAgICAgIC8vIOS/neWtmOe8lui+kVxyXG4gICAgICBjb25zdCB7bm90ZSwgdWlkfSA9IHRoaXM7XHJcbiAgICAgIGxldCB1cmwsIG1ldGhvZCwgZGF0YSA9IHt9O1xyXG4gICAgICBpZihuLnVpZCA9PT0gdWlkKSB7XHJcbiAgICAgICAgdXJsID0gYC9ub3RlLyR7bm90ZS5faWR9L2MvJHtuLl9pZH1gO1xyXG4gICAgICAgIG1ldGhvZCA9IFwiUEFUQ0hcIjtcclxuICAgICAgICBkYXRhLmNvbnRlbnQgPSBuLmNvbnRlbnQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdXJsID0gYC9ua2Mvbm90ZWA7XHJcbiAgICAgICAgbWV0aG9kID0gXCJQT1NUXCI7XHJcbiAgICAgICAgZGF0YS50eXBlID0gXCJtb2RpZnlcIjtcclxuICAgICAgICBkYXRhLm5vdGVJZCA9IG5vdGUuX2lkO1xyXG4gICAgICAgIGRhdGEubm90ZUNvbnRlbnRJZCA9IG4uX2lkO1xyXG4gICAgICAgIGRhdGEuY29udGVudCA9IG4uY29udGVudDtcclxuICAgICAgfVxyXG4gICAgICBua2NBUEkodXJsLCBtZXRob2QsIGRhdGEpXHJcbiAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgIG4uaHRtbCA9IGRhdGEubm90ZUNvbnRlbnRIVE1MO1xyXG4gICAgICAgICAgYXBwLm1vZGlmeU5vdGVDb250ZW50KG4pO1xyXG4gICAgICAgICAgVnVlLnNldChub3RlLm5vdGVzLCBub3RlLm5vdGVzLmluZGV4T2YobiksIG4pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xyXG4gICAgfSxcclxuICAgIG1vZGlmeU5vdGVDb250ZW50KG5jKSB7XHJcbiAgICAgIG5jLmVkaXQgPSAhbmMuZWRpdDtcclxuICAgICAgaWYobmMuZWRpdCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgYXBwLnJlc2V0VGV4dGFyZWEobmMpO1xyXG4gICAgICAgIH0sIDUwKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRlbGV0ZU5vdGVDb250ZW50KG4sIHR5cGUpIHtcclxuICAgICAgY29uc3Qge25vdGV9ID0gdGhpcztcclxuICAgICAgbGV0IHVybCwgbWV0aG9kLCBkYXRhID0ge307XHJcbiAgICAgIGlmKHR5cGUgPT09IFwiZGVsZXRlXCIpIHtcclxuICAgICAgICB1cmwgPSBgL25vdGUvJHtub3RlLl9pZH0vYy8ke24uX2lkfWA7XHJcbiAgICAgICAgbWV0aG9kID0gXCJERUxFVEVcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtZXRob2QgPSBcIlBPU1RcIjtcclxuICAgICAgICB1cmwgPSBgL25rYy9ub3RlYDtcclxuICAgICAgICBpZihuLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICBkYXRhLnR5cGUgPSBcImNhbmNlbERpc2FibGVcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGF0YS50eXBlID0gXCJkaXNhYmxlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRhdGEubm90ZUlkID0gbm90ZS5faWQ7XHJcbiAgICAgICAgZGF0YS5ub3RlQ29udGVudElkID0gbi5faWQ7XHJcbiAgICAgIH1cclxuICAgICAgc3dlZXRRdWVzdGlvbihcIuehruWumuimgeaJp+ihjOatpOaTjeS9nO+8n1wiKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHJldHVybiBua2NBUEkodXJsLCBtZXRob2QsIGRhdGEpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpZih0eXBlID09PSBcImRlbGV0ZVwiKSB7XHJcbiAgICAgICAgICAgIG4uZGVsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuLmRpc2FibGVkID0gIW4uZGlzYWJsZWQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzd2VldFN1Y2Nlc3MoXCLmk43kvZzmiJDlip9cIik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcilcclxuICAgIH1cclxuICB9XHJcbn0pOyJdfQ==
