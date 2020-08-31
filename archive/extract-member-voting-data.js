const fs = require('fs');

const { getVoteId, getMemberId } = require('./utils');

const input = process.argv[2];
const output = process.argv[3];
const json = fs.readFileSync(input, 'utf-8');
const data = JSON.parse(json);

const memberVotes = {};

for (const voteResult of data) {
  for (const detail of voteResult.voteDetails) {
    const voteId = getVoteId(voteResult.detailLink);
    for (const member of detail.members) {
      const memberId = getMemberId(member.link);
      memberVotes[memberId] = memberVotes[memberId] || {};
      memberVotes[memberId][voteId] = detail.choice;
    }
  }
};

const result = JSON.stringify(memberVotes, null, 2);

fs.writeFileSync(`normalised-data/${output}`, result);
