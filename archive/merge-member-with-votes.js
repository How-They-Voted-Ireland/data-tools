const fs = require('fs');

const members = process.argv[2];
const votes = process.argv[3];
const output = process.argv[4];

const membersJson = fs.readFileSync(members, 'utf-8');
const votesJson = fs.readFileSync(votes, 'utf-8');
const membersData = JSON.parse(membersJson);
const votesData = JSON.parse(votesJson);

const membersObject = {};

for (const member of membersData) {
  membersObject[member.memberCode] = votesData[member.memberCode];
}

const result = JSON.stringify(membersObject, null, 2);

fs.writeFileSync(`normalised-data/${output}`, result);
