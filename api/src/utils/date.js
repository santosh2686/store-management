const moment = require('moment-timezone');

const toMomentDate = dateStr => moment(dateStr || new Date()).tz('Asia/Kolkata')

const getDay = dateStr => toMomentDate(dateStr).format('dddd').toLowerCase()

const getMonth = dateStr => toMomentDate(dateStr).format('MMMM').toLowerCase()

const getYear = dateStr => toMomentDate(dateStr).format('YYYY')

exports.toMomentDate = toMomentDate;
exports.getDay = getDay;
exports.getMonth = getMonth;
exports.getYear = getYear;
