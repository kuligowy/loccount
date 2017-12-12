const rpad = (number, length) => {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
};

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

module.exports = {
  rpad: rpad,
  randomDate: randomDate
};