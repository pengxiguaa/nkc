(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var data = NKC.methods.getDataById("subUsersId");
var noteApp = new Vue({
  el: "#note",
  data: {
    uid: NKC.configs.uid,
    threads: data.threads,
    timeout: null
  },
  mounted: function mounted() {
    if (window.floatUserPanel) {
      window.floatUserPanel.initPanel();
    }
  },
  methods: {
    getUrl: NKC.methods.tools.getUrl,
    visitUrl: NKC.methods.visitUrl,
    fromNow: NKC.methods.fromNow,
    modifyNote: function modifyNote(nc) {
      nc.edit = !nc.edit;

      if (nc.edit) {
        setTimeout(function () {
          noteApp.textareaAutoResize(nc);
        }, 50);
      }
    },
    saveNewNote: function saveNewNote(note) {
      var _id = note._id,
          newContent = note.newContent,
          targetId = note.targetId,
          type = note.type;
      Promise.resolve().then(function () {
        if (!newContent) throw "请输入笔记内容";
        return nkcAPI("/note", "POST", {
          _id: _id,
          type: type,
          targetId: targetId,
          content: newContent
        });
      }).then(function (data) {
        note.notes.push(data.noteContent);
        note.newContent = "";
        noteApp.addNote(note);
        noteApp.textareaAutoResize(note, "note");
      })["catch"](sweetError);
    },
    addNote: function addNote(note) {
      note.edit = !note.edit;
    },
    deleteNote: function deleteNote(note, nc) {
      sweetQuestion("确定要执行删除操作？").then(function () {
        var notesId = nc.notesId,
            _id = nc._id;
        return nkcAPI("/note/".concat(notesId[notesId.length - 1], "/c/").concat(_id), "DELETE");
      }).then(function () {
        var index = note.notes.indexOf(nc);
        if (index !== -1) note.notes.splice(index, 1);
      })["catch"](sweetError);
    },
    saveContent: function saveContent(nc) {
      var content = nc.content,
          notesId = nc.notesId,
          _id = nc._id;
      nkcAPI("/note/".concat(notesId[notesId.length - 1], "/c/").concat(_id), "PATCH", {
        content: content
      }).then(function (data) {
        nc.html = data.noteContentHTML;
        noteApp.resetTextarea(nc);
      })["catch"](sweetError);
    },
    getTextarea: function getTextarea(nc) {
      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      return this.$refs[t + nc._id][0];
    },
    resetTextarea: function resetTextarea(nc, t) {
      nc.edit = false;
      this.textareaAutoResize(nc, t);
    },
    textareaAutoResize: function textareaAutoResize(nc, t) {
      var textArea = this.getTextarea(nc, t);
      var num = 4 * 12;

      if (num < textArea.scrollHeight) {
        textArea.style.height = textArea.scrollHeight + 'px';
      } else {
        textArea.style.height = '4rem';
      }
      /*clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const textArea = this.getTextarea(nc, t);
        const num = 4 * 12;
        if(num < textArea.scrollHeight) {
          textArea.style.height = textArea.scrollHeight + 'px';
        } else {
          textArea.style.height = '4rem';
        }
      }, 100);*/

    }
  }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9fYnJvd3Nlci1wYWNrQDYuMS4wQGJyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInBhZ2VzL3VzZXIvcHJvZmlsZS9ub3RlLm1qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQUosQ0FBWSxXQUFaLENBQXdCLFlBQXhCLENBQWI7QUFDQSxJQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUosQ0FBUTtBQUN0QixFQUFBLEVBQUUsRUFBRSxPQURrQjtBQUV0QixFQUFBLElBQUksRUFBRTtBQUNKLElBQUEsR0FBRyxFQUFFLEdBQUcsQ0FBQyxPQUFKLENBQVksR0FEYjtBQUVKLElBQUEsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUZWO0FBR0osSUFBQSxPQUFPLEVBQUU7QUFITCxHQUZnQjtBQU90QixFQUFBLE9BUHNCLHFCQU9aO0FBQ1IsUUFBRyxNQUFNLENBQUMsY0FBVixFQUEwQjtBQUN4QixNQUFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLFNBQXRCO0FBQ0Q7QUFDRixHQVhxQjtBQVl0QixFQUFBLE9BQU8sRUFBRTtBQUNQLElBQUEsTUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFKLENBQVksS0FBWixDQUFrQixNQURuQjtBQUVQLElBQUEsUUFBUSxFQUFFLEdBQUcsQ0FBQyxPQUFKLENBQVksUUFGZjtBQUdQLElBQUEsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFKLENBQVksT0FIZDtBQUlQLElBQUEsVUFKTyxzQkFJSSxFQUpKLEVBSVE7QUFDYixNQUFBLEVBQUUsQ0FBQyxJQUFILEdBQVUsQ0FBQyxFQUFFLENBQUMsSUFBZDs7QUFDQSxVQUFHLEVBQUUsQ0FBQyxJQUFOLEVBQVk7QUFDVixRQUFBLFVBQVUsQ0FBQyxZQUFNO0FBQ2YsVUFBQSxPQUFPLENBQUMsa0JBQVIsQ0FBMkIsRUFBM0I7QUFDRCxTQUZTLEVBRVAsRUFGTyxDQUFWO0FBR0Q7QUFDRixLQVhNO0FBWVAsSUFB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Q0QsS0E1RE07QUE2RFAsSUFBQSxhQTdETyx5QkE2RE8sRUE3RFAsRUE2RFcsQ0E3RFgsRUE2RGM7QUFDbkIsTUFBQSxFQUFFLENBQUMsSUFBSCxHQUFVLEtBQVY7QUFDQSxXQUFLLGtCQUFMLENBQXdCLEVBQXhCLEVBQTRCLENBQTVCO0FBQ0QsS0FoRU07QUFpRVAsSUFBQSxrQkFqRU8sOEJBaUVZLEVBakVaLEVBaUVnQixDQWpFaEIsRUFpRW1CO0FBQ3hCLFVBQU0sUUFBUSxHQUFHLEtBQUssV0FBTCxDQUFpQixFQUFqQixFQUFxQixDQUFyQixDQUFqQjtBQUNBLFVBQU0sR0FBRyxHQUFHLElBQUksRUFBaEI7O0FBQ0EsVUFBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLFlBQWxCLEVBQWdDO0FBQzlCLFFBQUEsUUFBUSxDQUFDLEtBQVQsQ0FBZSxNQUFmLEdBQXdCLFFBQVEsQ0FBQyxZQUFULEdBQXdCLElBQWhEO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsUUFBQSxRQUFRLENBQUMsS0FBVCxDQUFlLE1BQWYsR0FBd0IsTUFBeEI7QUFDRDtBQUNEOzs7Ozs7Ozs7OztBQVVEO0FBbkZNO0FBWmEsQ0FBUixDQUFoQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGRhdGEgPSBOS0MubWV0aG9kcy5nZXREYXRhQnlJZChcInN1YlVzZXJzSWRcIik7XHJcbmNvbnN0IG5vdGVBcHAgPSBuZXcgVnVlKHtcclxuICBlbDogXCIjbm90ZVwiLFxyXG4gIGRhdGE6IHtcclxuICAgIHVpZDogTktDLmNvbmZpZ3MudWlkLFxyXG4gICAgdGhyZWFkczogZGF0YS50aHJlYWRzLFxyXG4gICAgdGltZW91dDogbnVsbFxyXG4gIH0sXHJcbiAgbW91bnRlZCgpIHtcclxuICAgIGlmKHdpbmRvdy5mbG9hdFVzZXJQYW5lbCkge1xyXG4gICAgICB3aW5kb3cuZmxvYXRVc2VyUGFuZWwuaW5pdFBhbmVsKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRVcmw6IE5LQy5tZXRob2RzLnRvb2xzLmdldFVybCxcclxuICAgIHZpc2l0VXJsOiBOS0MubWV0aG9kcy52aXNpdFVybCxcclxuICAgIGZyb21Ob3c6IE5LQy5tZXRob2RzLmZyb21Ob3csXHJcbiAgICBtb2RpZnlOb3RlKG5jKSB7XHJcbiAgICAgIG5jLmVkaXQgPSAhbmMuZWRpdDtcclxuICAgICAgaWYobmMuZWRpdCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgbm90ZUFwcC50ZXh0YXJlYUF1dG9SZXNpemUobmMpO1xyXG4gICAgICAgIH0sIDUwKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2F2ZU5ld05vdGUobm90ZSkge1xyXG4gICAgICBjb25zdCB7X2lkLCBuZXdDb250ZW50LCB0YXJnZXRJZCwgdHlwZX0gPSBub3RlO1xyXG4gICAgICBQcm9taXNlLnJlc29sdmUoKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGlmKCFuZXdDb250ZW50KSB0aHJvdyBcIuivt+i+k+WFpeeslOiusOWGheWuuVwiO1xyXG4gICAgICAgICAgcmV0dXJuIG5rY0FQSShcIi9ub3RlXCIsIFwiUE9TVFwiLCB7XHJcbiAgICAgICAgICAgIF9pZCxcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgdGFyZ2V0SWQsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IG5ld0NvbnRlbnRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICBub3RlLm5vdGVzLnB1c2goZGF0YS5ub3RlQ29udGVudCk7XHJcbiAgICAgICAgICBub3RlLm5ld0NvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgbm90ZUFwcC5hZGROb3RlKG5vdGUpO1xyXG4gICAgICAgICAgbm90ZUFwcC50ZXh0YXJlYUF1dG9SZXNpemUobm90ZSwgXCJub3RlXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xyXG4gICAgfSxcclxuICAgIGFkZE5vdGUobm90ZSkge1xyXG4gICAgICBub3RlLmVkaXQgPSAhbm90ZS5lZGl0O1xyXG4gICAgfSxcclxuICAgIGRlbGV0ZU5vdGUobm90ZSwgbmMpIHtcclxuICAgICAgc3dlZXRRdWVzdGlvbihcIuehruWumuimgeaJp+ihjOWIoOmZpOaTjeS9nO+8n1wiKVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHtub3Rlc0lkLCBfaWR9ID0gbmM7XHJcbiAgICAgICAgICByZXR1cm4gbmtjQVBJKGAvbm90ZS8ke25vdGVzSWRbbm90ZXNJZC5sZW5ndGggLSAxXX0vYy8ke19pZH1gLCBcIkRFTEVURVwiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGluZGV4ID0gbm90ZS5ub3Rlcy5pbmRleE9mKG5jKTtcclxuICAgICAgICAgIGlmKGluZGV4ICE9PSAtMSkgbm90ZS5ub3Rlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xyXG4gICAgfSxcclxuICAgIHNhdmVDb250ZW50KG5jKSB7XHJcbiAgICAgIGNvbnN0IHtjb250ZW50LCBub3Rlc0lkLCBfaWR9ID0gbmM7XHJcbiAgICAgIG5rY0FQSShgL25vdGUvJHtub3Rlc0lkW25vdGVzSWQubGVuZ3RoIC0gMV19L2MvJHtfaWR9YCwgXCJQQVRDSFwiLCB7XHJcbiAgICAgICAgY29udGVudFxyXG4gICAgICB9KVxyXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgbmMuaHRtbCA9IGRhdGEubm90ZUNvbnRlbnRIVE1MO1xyXG4gICAgICAgICAgbm90ZUFwcC5yZXNldFRleHRhcmVhKG5jKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChzd2VldEVycm9yKTtcclxuICAgIH0sXHJcbiAgICBnZXRUZXh0YXJlYShuYywgdCA9IFwiXCIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJHJlZnNbdCtuYy5faWRdWzBdO1xyXG4gICAgfSxcclxuICAgIHJlc2V0VGV4dGFyZWEobmMsIHQpIHtcclxuICAgICAgbmMuZWRpdCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnRleHRhcmVhQXV0b1Jlc2l6ZShuYywgdCk7XHJcbiAgICB9LFxyXG4gICAgdGV4dGFyZWFBdXRvUmVzaXplKG5jLCB0KSB7XHJcbiAgICAgIGNvbnN0IHRleHRBcmVhID0gdGhpcy5nZXRUZXh0YXJlYShuYywgdCk7XHJcbiAgICAgIGNvbnN0IG51bSA9IDQgKiAxMjtcclxuICAgICAgaWYobnVtIDwgdGV4dEFyZWEuc2Nyb2xsSGVpZ2h0KSB7XHJcbiAgICAgICAgdGV4dEFyZWEuc3R5bGUuaGVpZ2h0ID0gdGV4dEFyZWEuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0ZXh0QXJlYS5zdHlsZS5oZWlnaHQgPSAnNHJlbSc7XHJcbiAgICAgIH1cclxuICAgICAgLypjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcclxuICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdGV4dEFyZWEgPSB0aGlzLmdldFRleHRhcmVhKG5jLCB0KTtcclxuICAgICAgICBjb25zdCBudW0gPSA0ICogMTI7XHJcbiAgICAgICAgaWYobnVtIDwgdGV4dEFyZWEuc2Nyb2xsSGVpZ2h0KSB7XHJcbiAgICAgICAgICB0ZXh0QXJlYS5zdHlsZS5oZWlnaHQgPSB0ZXh0QXJlYS5zY3JvbGxIZWlnaHQgKyAncHgnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0ZXh0QXJlYS5zdHlsZS5oZWlnaHQgPSAnNHJlbSc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAxMDApOyovXHJcbiAgICB9XHJcbiAgfVxyXG59KTsiXX0=
