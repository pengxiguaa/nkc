(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var CommonModal = new NKC.modules.CommonModal();
var Ship = new NKC.modules.ShopShip();
var ModifyPrice = new NKC.modules.ShopModifyPrice();
var Transfer = new NKC.modules.Transfer();

window.transfer = function (tUid) {
  Transfer.open(function () {}, tUid);
}; // 修改卖家备注


window.modifySellMessage = function (uid, orderId) {
  var dom = $("tr[data-order-id='".concat(orderId, "'] .data-sell-message"));
  CommonModal.open(function (data) {
    var value = data[0].value;
    nkcAPI('/shop/manage/' + uid + '/order/editSellMessage', "PATCH", {
      sellMessage: value,
      orderId: orderId
    }).then(function () {
      dom.text(value);
      CommonModal.close();
      sweetSuccess("保存成功");
    })["catch"](sweetWarning);
  }, {
    title: "修改备注",
    data: [{
      value: dom.text(),
      dom: "textarea"
    }]
  });
}; // 获取金额 转换成数字且去掉￥


window.getNumber = function (str) {
  var fractionDigits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  str = str + "";
  str = str.replace("￥", "");
  str = parseFloat(str);
  str = str.toFixed(fractionDigits);
  return parseFloat(str);
}; // 重新计算订单总价


window.computeOrderPrice = function (orderId) {
  var orderDom = $("tr[data-order-id='".concat(orderId, "']"));
  var paramPriceDom = orderDom.find(".data-param-price");
  var countDom = orderDom.find(".data-param-count");
  var freightDom = orderDom.find(".data-params-freight");
  var prices = [];
  var counts = [];

  for (var i = 0; i < paramPriceDom.length; i++) {
    var dom = paramPriceDom.eq(i);
    prices.push(getNumber(dom.text(), 2));
  }

  for (var _i = 0; _i < countDom.length; _i++) {
    var _dom = countDom.eq(_i);

    counts.push(getNumber(_dom.text(), 0));
  }

  if (prices.length !== counts.length) return sweetError("订单页面错误，请刷新页面");
  var totalPrice = 0;

  for (var _i2 = 0; _i2 < prices.length; _i2++) {
    totalPrice += prices[_i2] * counts[_i2];
  }

  var freight = getNumber(freightDom.text(), 2);
  orderDom.find(".data-params-price").text("\uFFE5".concat(totalPrice.toFixed(2)));
  orderDom.find(".data-order-price").text("\uFFE5".concat((totalPrice + freight).toFixed(2)));
  return {
    paramsPrice: totalPrice,
    freightPrice: freight,
    orderPrice: totalPrice + freight
  };
}; // 修改商品单价


window.modifyParamPrice = function (sellUid, orderId, costId) {
  var priceDom = $("tr[data-order-id='".concat(orderId, "'][data-order-param-id='").concat(costId, "'] .data-param-price"));
  var countDom = $("tr[data-order-id='".concat(orderId, "'][data-order-param-id='").concat(costId, "'] .data-param-count"));
  var freightDom = $("tr[data-order-id='".concat(orderId, "'] .data-params-freight"));
  var freightPrice = getNumber(freightDom.text(), 2);
  var price = getNumber(priceDom.text(), 2);
  var count = getNumber(countDom.text(), 0);
  return ModifyPrice.open(function (data) {
    var newPrice = data;
    var checkNumber = NKC.methods.checkData.checkNumber;
    Promise.resolve().then(function () {
      checkNumber(newPrice, {
        name: "商品单价",
        min: 0.01,
        fractionDigits: 2
      });
      return nkcAPI("/shop/manage/".concat(sellUid, "/order/editCostRecord"), "PATCH", {
        type: "modifyParam",
        costId: costId,
        orderId: orderId,
        freightPrice: freightPrice * 100,
        costObj: {
          singlePrice: newPrice * 100,
          count: count
        }
      });
    }).then(function () {
      priceDom.text("\uFFE5".concat(newPrice.toFixed(2)));
      computeOrderPrice(orderId);
      CommonModal.close();
    })["catch"](sweetError);
  }, price);
}; // 修改商品数量


window.modifyParamCount = function (sellUid, orderId, costId) {
  var countDom = $("tr[data-order-id='".concat(orderId, "'][data-order-param-id='").concat(costId, "'] .data-param-count"));
  var priceDom = $("tr[data-order-id='".concat(orderId, "'][data-order-param-id='").concat(costId, "'] .data-param-price"));
  var freightDom = $("tr[data-order-id='".concat(orderId, "'] .data-params-freight"));
  var freightPrice = getNumber(freightDom.text(), 2);
  var price = getNumber(priceDom.text(), 2);
  var count = getNumber(countDom.text(), 0);
  CommonModal.open(function (data) {
    var newCount = getNumber(data[0].value, 2);
    Promise.resolve().then(function () {
      NKC.methods.checkData.checkNumber(newCount, {
        name: "商品数量",
        min: 1
      });
      return nkcAPI("/shop/manage/".concat(sellUid, "/order/editCostRecord"), "PATCH", {
        type: "modifyParam",
        costId: costId,
        orderId: orderId,
        freightPrice: freightPrice * 100,
        costObj: {
          singlePrice: price * 100,
          count: newCount
        }
      });
    }).then(function () {
      countDom.text("".concat(newCount));
      computeOrderPrice(orderId);
      CommonModal.close();
    })["catch"](sweetError);
  }, {
    title: "修改数量",
    data: [{
      dom: "input",
      value: count
    }]
  });
}; // 修改运费


window.modifyFreight = function (sellUid, orderId) {
  var freightDom = $("tr[data-order-id='".concat(orderId, "'] .data-params-freight"));
  var freightPrice = getNumber(freightDom.text(), 2);
  return ModifyPrice.open(function (data) {
    var newFreightPrice = data;
    Promise.resolve().then(function () {
      NKC.methods.checkData.checkNumber(newFreightPrice, {
        name: "运费",
        min: 0,
        fractionDigits: 2
      });
      return nkcAPI("/shop/manage/".concat(sellUid, "/order/editCostRecord"), "PATCH", {
        type: "modifyFreight",
        orderId: orderId,
        freightPrice: newFreightPrice * 100
      });
    }).then(function () {
      freightDom.text("\uFFE5".concat(newFreightPrice.toFixed(2)));
      computeOrderPrice(orderId);
      CommonModal.close();
    })["catch"](sweetError);
  }, freightPrice);
}; // 发货/修改物流信息


window.ship = function (orderId) {
  Ship.open(function () {}, {
    orderId: orderId
  });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9fYnJvd3Nlci1wYWNrQDYuMS4wQGJyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInBhZ2VzL3Nob3AvbWFuYWdlL29yZGVyL29yZGVyLm1qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBSixDQUFZLFdBQWhCLEVBQXBCO0FBQ0EsSUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBSixDQUFZLFFBQWhCLEVBQWI7QUFDQSxJQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFKLENBQVksZUFBaEIsRUFBcEI7QUFDQSxJQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFKLENBQVksUUFBaEIsRUFBakI7O0FBQ0EsTUFBTSxDQUFDLFFBQVAsR0FBa0IsVUFBUyxJQUFULEVBQWU7QUFDL0IsRUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLFlBQVcsQ0FFeEIsQ0FGRCxFQUVHLElBRkg7QUFHRCxDQUpELEMsQ0FLQTs7O0FBQ0EsTUFBTSxDQUFDLGlCQUFQLEdBQTJCLFVBQVMsR0FBVCxFQUFjLE9BQWQsRUFBdUI7QUFDaEQsTUFBTSxHQUFHLEdBQUcsQ0FBQyw2QkFBc0IsT0FBdEIsMkJBQWI7QUFDQSxFQUFBLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFVBQUMsSUFBRCxFQUFVO0FBQ3pCLFFBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUSxLQUF0QjtBQUNBLElBQUEsTUFBTSxDQUFDLGtCQUFnQixHQUFoQixHQUFvQix3QkFBckIsRUFBK0MsT0FBL0MsRUFBd0Q7QUFBQyxNQUFBLFdBQVcsRUFBRSxLQUFkO0FBQXFCLE1BQUEsT0FBTyxFQUFFO0FBQTlCLEtBQXhELENBQU4sQ0FDRyxJQURILENBQ1EsWUFBVztBQUNmLE1BQUEsR0FBRyxDQUFDLElBQUosQ0FBUyxLQUFUO0FBQ0EsTUFBQSxXQUFXLENBQUMsS0FBWjtB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bnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IENvbW1vbk1vZGFsID0gbmV3IE5LQy5tb2R1bGVzLkNvbW1vbk1vZGFsKCk7XHJcbmNvbnN0IFNoaXAgPSBuZXcgTktDLm1vZHVsZXMuU2hvcFNoaXAoKTtcclxuY29uc3QgTW9kaWZ5UHJpY2UgPSBuZXcgTktDLm1vZHVsZXMuU2hvcE1vZGlmeVByaWNlKCk7XHJcbmNvbnN0IFRyYW5zZmVyID0gbmV3IE5LQy5tb2R1bGVzLlRyYW5zZmVyKCk7XHJcbndpbmRvdy50cmFuc2ZlciA9IGZ1bmN0aW9uKHRVaWQpIHtcclxuICBUcmFuc2Zlci5vcGVuKGZ1bmN0aW9uKCkge1xyXG5cclxuICB9LCB0VWlkKTtcclxufVxyXG4vLyDkv67mlLnljZblrrblpIfms6hcclxud2luZG93Lm1vZGlmeVNlbGxNZXNzYWdlID0gZnVuY3Rpb24odWlkLCBvcmRlcklkKSB7XHJcbiAgY29uc3QgZG9tID0gJChgdHJbZGF0YS1vcmRlci1pZD0nJHtvcmRlcklkfSddIC5kYXRhLXNlbGwtbWVzc2FnZWApO1xyXG4gIENvbW1vbk1vZGFsLm9wZW4oKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IHZhbHVlID0gZGF0YVswXS52YWx1ZTtcclxuICAgIG5rY0FQSSgnL3Nob3AvbWFuYWdlLycrdWlkKycvb3JkZXIvZWRpdFNlbGxNZXNzYWdlJywgXCJQQVRDSFwiLCB7c2VsbE1lc3NhZ2U6IHZhbHVlLCBvcmRlcklkOiBvcmRlcklkfSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZG9tLnRleHQodmFsdWUpO1xyXG4gICAgICAgIENvbW1vbk1vZGFsLmNsb3NlKCk7XHJcbiAgICAgICAgc3dlZXRTdWNjZXNzKFwi5L+d5a2Y5oiQ5YqfXCIpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goc3dlZXRXYXJuaW5nKVxyXG4gIH0sIHtcclxuICAgIHRpdGxlOiBcIuS/ruaUueWkh+azqFwiLFxyXG4gICAgZGF0YTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgdmFsdWU6IGRvbS50ZXh0KCksXHJcbiAgICAgICAgZG9tOiBcInRleHRhcmVhXCJcclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH0pXHJcbn1cclxuLy8g6I635Y+W6YeR6aKdIOi9rOaNouaIkOaVsOWtl+S4lOWOu+aOie+/pVxyXG53aW5kb3cuZ2V0TnVtYmVyID0gZnVuY3Rpb24oc3RyLCBmcmFjdGlvbkRpZ2l0cyA9IDApIHtcclxuICBzdHIgPSBzdHIgKyBcIlwiO1xyXG4gIHN0ciA9IHN0ci5yZXBsYWNlKFwi77+lXCIsIFwiXCIpO1xyXG4gIHN0ciA9IHBhcnNlRmxvYXQoc3RyKTtcclxuICBzdHIgPSBzdHIudG9GaXhlZChmcmFjdGlvbkRpZ2l0cyk7XHJcbiAgcmV0dXJuIHBhcnNlRmxvYXQoc3RyKTtcclxufVxyXG4vLyDph43mlrDorqHnrpforqLljZXmgLvku7dcclxud2luZG93LmNvbXB1dGVPcmRlclByaWNlID0gZnVuY3Rpb24ob3JkZXJJZCkge1xyXG4gIGNvbnN0IG9yZGVyRG9tID0gJChgdHJbZGF0YS1vcmRlci1pZD0nJHtvcmRlcklkfSddYCk7XHJcbiAgY29uc3QgcGFyYW1QcmljZURvbSA9IG9yZGVyRG9tLmZpbmQoXCIuZGF0YS1wYXJhbS1wcmljZVwiKTtcclxuICBjb25zdCBjb3VudERvbSA9IG9yZGVyRG9tLmZpbmQoXCIuZGF0YS1wYXJhbS1jb3VudFwiKTtcclxuICBjb25zdCBmcmVpZ2h0RG9tID0gb3JkZXJEb20uZmluZChcIi5kYXRhLXBhcmFtcy1mcmVpZ2h0XCIpO1xyXG4gIGNvbnN0IHByaWNlcyA9IFtdO1xyXG4gIGNvbnN0IGNvdW50cyA9IFtdO1xyXG4gIGZvcihsZXQgaSA9IDA7IGkgPCBwYXJhbVByaWNlRG9tLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBkb20gPSBwYXJhbVByaWNlRG9tLmVxKGkpO1xyXG4gICAgcHJpY2VzLnB1c2goZ2V0TnVtYmVyKGRvbS50ZXh0KCksIDIpKTtcclxuICB9XHJcbiAgZm9yKGxldCBpID0gMDsgaSA8IGNvdW50RG9tLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjb25zdCBkb20gPSBjb3VudERvbS5lcShpKTtcclxuICAgIGNvdW50cy5wdXNoKGdldE51bWJlcihkb20udGV4dCgpLCAwKSk7XHJcbiAgfVxyXG4gIGlmKHByaWNlcy5sZW5ndGggIT09IGNvdW50cy5sZW5ndGgpIHJldHVybiBzd2VldEVycm9yKFwi6K6i5Y2V6aG16Z2i6ZSZ6K+v77yM6K+35Yi35paw6aG16Z2iXCIpO1xyXG4gIGxldCB0b3RhbFByaWNlID0gMDtcclxuICBmb3IobGV0IGkgPSAwOyBpIDwgcHJpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB0b3RhbFByaWNlICs9IHByaWNlc1tpXSAqIGNvdW50c1tpXTtcclxuICB9XHJcbiAgY29uc3QgZnJlaWdodCA9IGdldE51bWJlcihmcmVpZ2h0RG9tLnRleHQoKSwgMik7XHJcbiAgb3JkZXJEb20uZmluZChgLmRhdGEtcGFyYW1zLXByaWNlYCkudGV4dChg77+lJHt0b3RhbFByaWNlLnRvRml4ZWQoMil9YCk7XHJcbiAgb3JkZXJEb20uZmluZChgLmRhdGEtb3JkZXItcHJpY2VgKS50ZXh0KGDvv6Ukeyh0b3RhbFByaWNlICsgZnJlaWdodCkudG9GaXhlZCgyKX1gKTtcclxuICByZXR1cm4ge1xyXG4gICAgcGFyYW1zUHJpY2U6IHRvdGFsUHJpY2UsXHJcbiAgICBmcmVpZ2h0UHJpY2U6IGZyZWlnaHQsXHJcbiAgICBvcmRlclByaWNlOiB0b3RhbFByaWNlICsgZnJlaWdodFxyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIOS/ruaUueWVhuWTgeWNleS7t1xyXG53aW5kb3cubW9kaWZ5UGFyYW1QcmljZSA9IGZ1bmN0aW9uKHNlbGxVaWQsIG9yZGVySWQsIGNvc3RJZCkge1xyXG4gIGNvbnN0IHByaWNlRG9tID0gJChgdHJbZGF0YS1vcmRlci1pZD0nJHtvcmRlcklkfSddW2RhdGEtb3JkZXItcGFyYW0taWQ9JyR7Y29zdElkfSddIC5kYXRhLXBhcmFtLXByaWNlYCk7XHJcbiAgY29uc3QgY291bnREb20gPSAkKGB0cltkYXRhLW9yZGVyLWlkPScke29yZGVySWR9J11bZGF0YS1vcmRlci1wYXJhbS1pZD0nJHtjb3N0SWR9J10gLmRhdGEtcGFyYW0tY291bnRgKTtcclxuICBjb25zdCBmcmVpZ2h0RG9tID0gJChgdHJbZGF0YS1vcmRlci1pZD0nJHtvcmRlcklkfSddIC5kYXRhLXBhcmFtcy1mcmVpZ2h0YCk7XHJcbiAgY29uc3QgZnJlaWdodFByaWNlID0gZ2V0TnVtYmVyKGZyZWlnaHREb20udGV4dCgpLCAyKTtcclxuICBjb25zdCBwcmljZSA9IGdldE51bWJlcihwcmljZURvbS50ZXh0KCksIDIpO1xyXG4gIGNvbnN0IGNvdW50ID0gZ2V0TnVtYmVyKGNvdW50RG9tLnRleHQoKSwgMCk7XHJcbiAgcmV0dXJuIE1vZGlmeVByaWNlLm9wZW4oZGF0YSA9PiB7XHJcbiAgICBjb25zdCBuZXdQcmljZSA9IGRhdGE7XHJcbiAgICBjb25zdCBjaGVja051bWJlciA9IE5LQy5tZXRob2RzLmNoZWNrRGF0YS5jaGVja051bWJlcjtcclxuICAgIFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBjaGVja051bWJlcihuZXdQcmljZSwge1xyXG4gICAgICAgICAgbmFtZTogXCLllYblk4HljZXku7dcIixcclxuICAgICAgICAgIG1pbjogMC4wMSxcclxuICAgICAgICAgIGZyYWN0aW9uRGlnaXRzOiAyXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIG5rY0FQSShgL3Nob3AvbWFuYWdlLyR7c2VsbFVpZH0vb3JkZXIvZWRpdENvc3RSZWNvcmRgLCBcIlBBVENIXCIsIHtcclxuICAgICAgICAgIHR5cGU6IFwibW9kaWZ5UGFyYW1cIixcclxuICAgICAgICAgIGNvc3RJZCxcclxuICAgICAgICAgIG9yZGVySWQsXHJcbiAgICAgICAgICBmcmVpZ2h0UHJpY2U6IGZyZWlnaHRQcmljZSAqIDEwMCxcclxuICAgICAgICAgIGNvc3RPYmo6IHtcclxuICAgICAgICAgICAgc2luZ2xlUHJpY2U6IG5ld1ByaWNlICogMTAwLFxyXG4gICAgICAgICAgICBjb3VudFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBwcmljZURvbS50ZXh0KGDvv6Uke25ld1ByaWNlLnRvRml4ZWQoMil9YCk7XHJcbiAgICAgICAgY29tcHV0ZU9yZGVyUHJpY2Uob3JkZXJJZCk7XHJcbiAgICAgICAgQ29tbW9uTW9kYWwuY2xvc2UoKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xyXG4gIH0sIHByaWNlKVxyXG59XHJcblxyXG4vLyDkv67mlLnllYblk4HmlbDph49cclxud2luZG93Lm1vZGlmeVBhcmFtQ291bnQgPSBmdW5jdGlvbihzZWxsVWlkLCBvcmRlcklkLCBjb3N0SWQpIHtcclxuICBjb25zdCBjb3VudERvbSA9ICQoYHRyW2RhdGEtb3JkZXItaWQ9JyR7b3JkZXJJZH0nXVtkYXRhLW9yZGVyLXBhcmFtLWlkPScke2Nvc3RJZH0nXSAuZGF0YS1wYXJhbS1jb3VudGApO1xyXG4gIGNvbnN0IHByaWNlRG9tID0gJChgdHJbZGF0YS1vcmRlci1pZD0nJHtvcmRlcklkfSddW2RhdGEtb3JkZXItcGFyYW0taWQ9JyR7Y29zdElkfSddIC5kYXRhLXBhcmFtLXByaWNlYCk7XHJcbiAgY29uc3QgZnJlaWdodERvbSA9ICQoYHRyW2RhdGEtb3JkZXItaWQ9JyR7b3JkZXJJZH0nXSAuZGF0YS1wYXJhbXMtZnJlaWdodGApO1xyXG4gIGNvbnN0IGZyZWlnaHRQcmljZSA9IGdldE51bWJlcihmcmVpZ2h0RG9tLnRleHQoKSwgMik7XHJcbiAgY29uc3QgcHJpY2UgPSBnZXROdW1iZXIocHJpY2VEb20udGV4dCgpLCAyKTtcclxuICBjb25zdCBjb3VudCA9IGdldE51bWJlcihjb3VudERvbS50ZXh0KCksIDApO1xyXG4gIENvbW1vbk1vZGFsLm9wZW4oKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IG5ld0NvdW50ID0gZ2V0TnVtYmVyKGRhdGFbMF0udmFsdWUsIDIpO1xyXG4gICAgUHJvbWlzZS5yZXNvbHZlKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIE5LQy5tZXRob2RzLmNoZWNrRGF0YS5jaGVja051bWJlcihuZXdDb3VudCwge1xyXG4gICAgICAgICAgbmFtZTogXCLllYblk4HmlbDph49cIixcclxuICAgICAgICAgIG1pbjogMVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBua2NBUEkoYC9zaG9wL21hbmFnZS8ke3NlbGxVaWR9L29yZGVyL2VkaXRDb3N0UmVjb3JkYCwgXCJQQVRDSFwiLCB7XHJcbiAgICAgICAgICB0eXBlOiBcIm1vZGlmeVBhcmFtXCIsXHJcbiAgICAgICAgICBjb3N0SWQsXHJcbiAgICAgICAgICBvcmRlcklkLFxyXG4gICAgICAgICAgZnJlaWdodFByaWNlOiBmcmVpZ2h0UHJpY2UgKiAxMDAsXHJcbiAgICAgICAgICBjb3N0T2JqOiB7XHJcbiAgICAgICAgICAgIHNpbmdsZVByaWNlOiBwcmljZSAqIDEwMCxcclxuICAgICAgICAgICAgY291bnQ6IG5ld0NvdW50XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgIFxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgY291bnREb20udGV4dChgJHtuZXdDb3VudH1gKTtcclxuICAgICAgICBjb21wdXRlT3JkZXJQcmljZShvcmRlcklkKTtcclxuICAgICAgICBDb21tb25Nb2RhbC5jbG9zZSgpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgfSwge1xyXG4gICAgdGl0bGU6IFwi5L+u5pS55pWw6YePXCIsXHJcbiAgICBkYXRhOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBkb206IFwiaW5wdXRcIixcclxuICAgICAgICB2YWx1ZTogY291bnRcclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH0pO1xyXG59XHJcblxyXG4vLyDkv67mlLnov5DotLlcclxud2luZG93Lm1vZGlmeUZyZWlnaHQgPSBmdW5jdGlvbihzZWxsVWlkLCBvcmRlcklkKSB7XHJcbiAgY29uc3QgZnJlaWdodERvbSA9ICQoYHRyW2RhdGEtb3JkZXItaWQ9JyR7b3JkZXJJZH0nXSAuZGF0YS1wYXJhbXMtZnJlaWdodGApO1xyXG4gIGNvbnN0IGZyZWlnaHRQcmljZSA9IGdldE51bWJlcihmcmVpZ2h0RG9tLnRleHQoKSwgMik7XHJcbiAgcmV0dXJuIE1vZGlmeVByaWNlLm9wZW4oZGF0YSA9PiB7XHJcbiAgICBjb25zdCBuZXdGcmVpZ2h0UHJpY2UgPSBkYXRhO1xyXG4gICAgUHJvbWlzZS5yZXNvbHZlKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIE5LQy5tZXRob2RzLmNoZWNrRGF0YS5jaGVja051bWJlcihuZXdGcmVpZ2h0UHJpY2UsIHtcclxuICAgICAgICAgIG5hbWU6IFwi6L+Q6LS5XCIsXHJcbiAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICBmcmFjdGlvbkRpZ2l0czogMlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBua2NBUEkoYC9zaG9wL21hbmFnZS8ke3NlbGxVaWR9L29yZGVyL2VkaXRDb3N0UmVjb3JkYCwgXCJQQVRDSFwiLCB7XHJcbiAgICAgICAgICB0eXBlOiBcIm1vZGlmeUZyZWlnaHRcIixcclxuICAgICAgICAgIG9yZGVySWQsXHJcbiAgICAgICAgICBmcmVpZ2h0UHJpY2U6IG5ld0ZyZWlnaHRQcmljZSAqIDEwMCxcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGZyZWlnaHREb20udGV4dChg77+lJHtuZXdGcmVpZ2h0UHJpY2UudG9GaXhlZCgyKX1gKTtcclxuICAgICAgICBjb21wdXRlT3JkZXJQcmljZShvcmRlcklkKTtcclxuICAgICAgICBDb21tb25Nb2RhbC5jbG9zZSgpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goc3dlZXRFcnJvcik7XHJcbiAgfSwgZnJlaWdodFByaWNlKTtcclxufVxyXG4vLyDlj5HotKcv5L+u5pS554mp5rWB5L+h5oGvXHJcbndpbmRvdy5zaGlwID0gZnVuY3Rpb24ob3JkZXJJZCkge1xyXG4gIFNoaXAub3BlbigoKSA9PiB7XHJcbiAgXHJcbiAgfSwge1xyXG4gICAgb3JkZXJJZFxyXG4gIH0pXHJcbn0iXX0=
