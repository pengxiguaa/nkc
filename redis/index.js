require('colors');

const Redis = require('redis');
const db = require('../dataModels');
const pub = Redis.createClient();


pub.on('error', (err) => {

  console.log(`连接redis出错: `);
  console.log(err);

});


const obj = {};

obj.pubConnect = async (uid) => {
  pub.publish(`connect`, JSON.stringify({
    uid
  }));
};

obj.pubDisconnect = async (uid) => {
  pub.publish(`disconnect`, JSON.stringify({
    uid
  }));
};

obj.pubMessage = async (message) => {
  if(message.ty === 'STU') {
    await db.UsersGeneralModel.update({uid: message.r, 'messageSettings.chat.reminder': false}, {$set: {'messageSettings.chat.reminder': true}});
    const messageArr = await db.MessageModel.extendReminder([message]);
    message = messageArr[0] || '';
  }
  pub.publish('message', JSON.stringify(message));
};

obj.pubWithdrawn = async (message) => {

  pub.publish('withdrawn', JSON.stringify(message));
};


module.exports = obj;
