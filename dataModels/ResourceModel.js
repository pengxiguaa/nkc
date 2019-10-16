const settings = require('../settings');
const mongoose = settings.database;
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
	rid: {
    type: String,
    unique: true,
    required: true
  },
  originId: {
    type: String,
    default: ""
  },
  ext: {
    type: String,
    default: ''
  },
  hits: {
    type: Number,
    default: 0
  },
  oname: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 0
  },
  toc: {
    type: Date,
    default: Date.now,
    index: 1
  },
  tpath: {
    type: String,
    default: ''
  },
  uid: {
    type: String,
    required: true,
    index: 1
  },
  mediaType: {
    type: String,
    index: 1,
    default: ''
  },
  // pid, 表示哪些post引入了该资源
  references: {
	  type: [String],
    index: 1,
    default: []
  },
  forumsId: {
    type: [String],
    index: 1,
    default: []
  },
  name: {
	  type: String,
    default: ""
  },
  description: {
	  type: String,
    default: ""
  },
  cover: {
	  type: String,
    default: ''
  },
  category: {
	  type: String, // book, paper, program, media
    index: 1,
    default: ""
  }
});




module.exports = mongoose.model('resources', resourceSchema);