(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var data = NKC.methods.getDataById("data");
var app = new Vue({
  el: "#app",
  data: {
    verifyEmail: data.verifyEmail,
    verifyMobile: data.verifyMobile,
    verifyPassword: data.verifyPassword,
    mobileCode: "",
    emailCode: "",
    password: "",
    passed: !data.verifyEmail && !data.verifyMobile && !data.verifyPassword,
    mobileTime: 0,
    emailTime: 0
  },
  computed: {
    disableVerifyButton: function disableVerifyButton() {
      var verifyEmail = this.verifyEmail,
          verifyMobile = this.verifyMobile,
          verifyPassword = this.verifyPassword,
          mobileCode = this.mobileCode,
          emailCode = this.emailCode,
          password = this.password;
      return verifyPassword && !password || verifyEmail && !emailCode || verifyMobile && !mobileCode;
    }
  },
  methods: {
    reduceTime: function reduceTime(type) {
      var self = this;
      setTimeout(function () {
        self[type]--;

        if (self[type] > 0) {
          self.reduceTime(type);
        }
      }, 1000);
    },
    sendEmailCode: function sendEmailCode() {
      if (this.emailTime > 0) return;
      var self = this;
      NKC.methods.sendEmailCode("destroy").then(function () {
        sweetSuccess("验证码已发送");
        self.emailTime = 120;
        self.reduceTime("emailTime");
      })["catch"](sweetError);
    },
    sendMobileCode: function sendMobileCode() {
      if (this.mobileTime > 0) return;
      var self = this;
      NKC.methods.sendMobileCode("destroy").then(function () {
        sweetSuccess("验证码已发送");
        self.mobileTime = 120;
        self.reduceTime("mobileTime");
      })["catch"](sweetError);
    },
    verify: function verify() {
      var self = this;
      var emailCode = this.emailCode,
          mobileCode = this.mobileCode,
          password = this.password;
      nkcAPI("/u/".concat(NKC.configs.uid, "/destroy"), "POST", {
        type: "verify",
        form: {
          emailCode: emailCode,
          mobileCode: mobileCode,
          password: password
        }
      }).then(function () {
        self.passed = true;
      })["catch"](sweetError);
    },
    submit: function submit() {
      var emailCode = this.emailCode,
          mobileCode = this.mobileCode,
          password = this.password;
      sweetQuestion("确定即会注销，注销后短期内不能使用原有用户名重新注册，你将不能再对该账号、积分、发表的内容进行处置，你想好了吗？").then(function () {
        return nkcAPI("/u/".concat(NKC.configs.uid, "/destroy"), "POST", {
          type: "destroy",
          form: {
            emailCode: emailCode,
            mobileCode: mobileCode,
            password: password
          }
        });
      }).then(function () {
        // 注销完成
        if (NKC.configs.isApp) {
          emitEvent("logout");
        } else {
          window.location.href = "/";
        }
      })["catch"](sweetError);
    }
  }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9fYnJvd3Nlci1wYWNrQDYuMS4wQGJyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInBhZ2VzL3VzZXIvZGVzdHJveS9kZXN0cm95Lm1qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQUosQ0FBWSxXQUFaLENBQXdCLE1BQXhCLENBQWI7QUFDQSxJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUosQ0FBUTtBQUNsQixFQUFBLEVBQUUsRUFBRSxNQURjO0FBRWxCLEVBQUEsSUFBSSxFQUFFO0FBQ0osSUFBQSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBRGQ7QUFFSixJQUFBLFlBQVksRUFBRSxJQUFJLENBQUMsWUFGZjtBQUdKLElBQUEsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUhqQjtBQUtKLElBQUEsVUFBVSxFQUFFLEVBTFI7QUFNSixJQUFBLFNBQVMsRUFBRSxFQU5QO0FBT0osSUFBQSxRQUFRLEVBQUUsRUFQTjtBQVNKLElBQUEsTUFBTSxFQUFHLENBQUMsSUFBSSxDQUFDLFdBQU4sSUFBcUIsQ0FBQyxJQUFJLENBQUMsWUFBM0IsSUFBMkMsQ0FBQyxJQUFJLENBQUMsY0FUdEQ7QUFXSixJQUFBLFVBQVUsRUFBRSxDQVhSO0FBWUosSUFBQSxTQUFTLEVBQUc7QUFaUixHQUZZO0FBZ0JsQixFQUFBLFFBQVEsRUFBRTtBQUNSLElBQUEsbUJBRFEsaUNBQ2M7QUFBQSxVQUVsQixXQUZrQixHQUloQixJQUpnQixDQUVsQixXQUZrQjtBQUFBLFVBRUwsWUFGSyxHQUloQixJQUpnQixDQUVMLFlBRks7QUFBQSxVQUVTLGNBRlQsR0FJaEIsSUFKZ0IsQ0FFUyxjQUZUO0FBQUEsVUFHbEIsVUFIa0IsR0FJaEIsSUFKZ0IsQ0FHbEIsVUFIa0I7QUFBQSxVQUdOLFNBSE0sR0FJaEIsSUFKZ0IsQ0FHTixTQUhNO0FBQUEsVUFHSyxRQUhMLEdBSWhCLElBSmdCLENBR0ssUUFITDtBQUtw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LFlBQU07QUFDVjtBQUNBLFlBQUcsR0FBRyxDQUFDLE9BQUosQ0FBWSxLQUFmLEVBQXNCO0FBQ3BCLFVBQUEsU0FBUyxDQUFDLFFBQUQsQ0FBVDtBQUNELFNBRkQsTUFFTztBQUNMLFVBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBdUIsR0FBdkI7QUFDRDtBQUNGLE9BbEJILFdBbUJTLFVBbkJUO0FBb0JEO0FBeEVNO0FBekJTLENBQVIsQ0FBWiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGRhdGEgPSBOS0MubWV0aG9kcy5nZXREYXRhQnlJZChcImRhdGFcIik7XG5jb25zdCBhcHAgPSBuZXcgVnVlKHtcbiAgZWw6IFwiI2FwcFwiLFxuICBkYXRhOiB7XG4gICAgdmVyaWZ5RW1haWw6IGRhdGEudmVyaWZ5RW1haWwsXG4gICAgdmVyaWZ5TW9iaWxlOiBkYXRhLnZlcmlmeU1vYmlsZSxcbiAgICB2ZXJpZnlQYXNzd29yZDogZGF0YS52ZXJpZnlQYXNzd29yZCxcblxuICAgIG1vYmlsZUNvZGU6IFwiXCIsXG4gICAgZW1haWxDb2RlOiBcIlwiLFxuICAgIHBhc3N3b3JkOiBcIlwiLFxuXG4gICAgcGFzc2VkOiAoIWRhdGEudmVyaWZ5RW1haWwgJiYgIWRhdGEudmVyaWZ5TW9iaWxlICYmICFkYXRhLnZlcmlmeVBhc3N3b3JkKSxcblxuICAgIG1vYmlsZVRpbWU6IDAsXG4gICAgZW1haWxUaW1lOiAgMFxuICB9LFxuICBjb21wdXRlZDoge1xuICAgIGRpc2FibGVWZXJpZnlCdXR0b24oKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHZlcmlmeUVtYWlsLCB2ZXJpZnlNb2JpbGUsIHZlcmlmeVBhc3N3b3JkLFxuICAgICAgICBtb2JpbGVDb2RlLCBlbWFpbENvZGUsIHBhc3N3b3JkXG4gICAgICB9ID0gdGhpcztcbiAgICAgIHJldHVybiAodmVyaWZ5UGFzc3dvcmQgJiYgIXBhc3N3b3JkKSB8fCAodmVyaWZ5RW1haWwgJiYgIWVtYWlsQ29kZSkgfHwgKHZlcmlmeU1vYmlsZSAmJiAhbW9iaWxlQ29kZSk7XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgcmVkdWNlVGltZSh0eXBlKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzZWxmW3R5cGVdIC0tO1xuICAgICAgICBpZihzZWxmW3R5cGVdID4gMCkge1xuICAgICAgICAgIHNlbGYucmVkdWNlVGltZSh0eXBlKTtcbiAgICAgICAgfVxuICAgICAgfSwgMTAwMClcbiAgICB9LFxuICAgIHNlbmRFbWFpbENvZGUoKSB7XG4gICAgICBpZih0aGlzLmVtYWlsVGltZSA+IDApIHJldHVybjtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgTktDLm1ldGhvZHMuc2VuZEVtYWlsQ29kZShcImRlc3Ryb3lcIilcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHN3ZWV0U3VjY2VzcyhcIumqjOivgeeggeW3suWPkemAgVwiKTtcbiAgICAgICAgICBzZWxmLmVtYWlsVGltZSA9IDEyMDtcbiAgICAgICAgICBzZWxmLnJlZHVjZVRpbWUoXCJlbWFpbFRpbWVcIik7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChzd2VldEVycm9yKTtcbiAgICB9LFxuICAgIHNlbmRNb2JpbGVDb2RlKCkge1xuICAgICAgaWYodGhpcy5tb2JpbGVUaW1lID4gMCkgcmV0dXJuO1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBOS0MubWV0aG9kcy5zZW5kTW9iaWxlQ29kZShcImRlc3Ryb3lcIilcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHN3ZWV0U3VjY2VzcyhcIumqjOivgeeggeW3suWPkemAgVwiKTtcbiAgICAgICAgICBzZWxmLm1vYmlsZVRpbWUgPSAxMjA7XG4gICAgICAgICAgc2VsZi5yZWR1Y2VUaW1lKFwibW9iaWxlVGltZVwiKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xuICAgIH0sXG4gICAgdmVyaWZ5KCkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGVtYWlsQ29kZSwgbW9iaWxlQ29kZSwgcGFzc3dvcmRcbiAgICAgIH0gPSB0aGlzO1xuICAgICAgbmtjQVBJKGAvdS8ke05LQy5jb25maWdzLnVpZH0vZGVzdHJveWAsIFwiUE9TVFwiLCB7XG4gICAgICAgIHR5cGU6IFwidmVyaWZ5XCIsXG4gICAgICAgIGZvcm06IHtcbiAgICAgICAgICBlbWFpbENvZGUsXG4gICAgICAgICAgbW9iaWxlQ29kZSxcbiAgICAgICAgICBwYXNzd29yZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgc2VsZi5wYXNzZWQgPSB0cnVlO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcilcbiAgICB9LFxuICAgIHN1Ym1pdCgpIHtcbiAgICAgIGNvbnN0IHtlbWFpbENvZGUsIG1vYmlsZUNvZGUsIHBhc3N3b3JkfSA9IHRoaXM7XG4gICAgICBzd2VldFF1ZXN0aW9uKFwi56Gu5a6a5Y2z5Lya5rOo6ZSA77yM5rOo6ZSA5ZCO55+t5pyf5YaF5LiN6IO95L2/55So5Y6f5pyJ55So5oi35ZCN6YeN5paw5rOo5YaM77yM5L2g5bCG5LiN6IO95YaN5a+56K+l6LSm5Y+344CB56ev5YiG44CB5Y+R6KGo55qE5YaF5a656L+b6KGM5aSE572u77yM5L2g5oOz5aW95LqG5ZCX77yfXCIpXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gbmtjQVBJKGAvdS8ke05LQy5jb25maWdzLnVpZH0vZGVzdHJveWAsIFwiUE9TVFwiLCB7XG4gICAgICAgICAgICB0eXBlOiBcImRlc3Ryb3lcIixcbiAgICAgICAgICAgIGZvcm06IHtcbiAgICAgICAgICAgICAgZW1haWxDb2RlLFxuICAgICAgICAgICAgICBtb2JpbGVDb2RlLFxuICAgICAgICAgICAgICBwYXNzd29yZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgLy8g5rOo6ZSA5a6M5oiQXG4gICAgICAgICAgaWYoTktDLmNvbmZpZ3MuaXNBcHApIHtcbiAgICAgICAgICAgIGVtaXRFdmVudChcImxvZ291dFwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9cIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChzd2VldEVycm9yKTtcbiAgICB9XG4gIH1cbn0pOyJdfQ==
