const getMemberId = url => {
  return url.substring(19).slice(0, -1);
};

const getVoteId = url => {
  return url.substring(17).slice(0, -1).replace(/\//g, '-');
};

module.exports = {
  getMemberId, getVoteId
};
