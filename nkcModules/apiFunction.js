const settings = require('../settings');
let db = require('../dataModels');
let fn = {};


fn.sha256HMAC = (password,salt) => {
  const crypto = require('crypto');
  let hmac = crypto.createHmac('sha256',salt);
  hmac.update(password);
  return hmac.digest('hex')
};
fn.testPassword = (input,hashtype,storedPassword) => {
  let pass = '';
  let hash = '';
  let salt = '';
  let hashed = '';
  switch (hashtype) {
    case 'pw9':
      pass = input
      hash = storedPassword.hash
      salt = storedPassword.salt

      hashed = md5(md5(pass)+salt)
      if(hashed!==hash){
        return false;
      }
      break;

    case 'sha256HMAC':
      pass = input
      hash = storedPassword.hash
      salt = storedPassword.salt

      hashed = fn.sha256HMAC(pass,salt)
      if(hashed!==hash){
        return false;
      }
      break;

    default:
      if(input !== storedPassword){ //fallback to plain
        return false;
      }
  }
  return true;
};
fn.newPasswordObject = (plain) => {
  let salt = Math.floor((Math.random()*65536)).toString(16)
  let hash = fn.sha256HMAC(plain,salt)
  return {
    hashtype:'sha256HMAC',
    password:{
      hash:hash,
      salt:salt,
    }
  };
};
fn.contentLength =  (content) => {
  const zhCN = content.match(/[^\x00-\xff]/g);
  const other = content.match(/[\x00-\xff]/g);
  const length1 = zhCN? zhCN.length * 2 : 0;
  const length2 = other? other.length : 0;
  return length1 + length2
};

fn.random = (n) => {
  let Num = "";
  for(let i = 0; i < n; i++) {
    Num += Math.floor(Math.random()*10);
  }
  return Num;
};
// 检查邮箱格式
fn.checkEmailFormat = (email) => {
  let path = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  return email.search(path);
};

module.exports = fn;