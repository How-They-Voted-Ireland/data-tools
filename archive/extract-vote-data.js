const fs = require('fs');
const { getVoteId } = require('./utils');

const input = process.argv[2];
const output = process.argv[3];
const json = fs.readFileSync(input, 'utf-8');
const data = JSON.parse(json);

const voteDetails = {};

for (const { date, title, description, status, detailLink } of data) {
  const voteId = getVoteId(detailLink);
  voteDetails[voteId] = {
    date,
    title,
    description,
    status,
    detailLink,
  };
}

const result = JSON.stringify(voteDetails, null, 2);

fs.writeFileSync(`normalised-data/${output}`, result);
