const fs = require("fs");

const file = process.argv[2];

const json = fs.readFileSync(file, "utf-8");

const data = JSON.parse(json);

const members = data.results.map(({ member }) => {
  const {
    memberCode,
    lastName,
    firstName,
    fullName,
    uri,
    memberships,
  } = member;

  const dailMembership = memberships.find(
    ({ membership }) => membership.house.houseCode === "dail"
  );
  // console.log(dailMembership);
  const represents = dailMembership.membership.represents.find(
    ({ represent }) => represent.representType === "constituency"
  );

  const party = dailMembership.membership.parties[0].party;

  const { partyCode, showAs: partyName } = party;

  const {
    representCode: constituencyCode,
    showAs: constituencyName,
  } = represents.represent;

  return {
    memberCode,
    lastName,
    firstName,
    fullName,
    uri,
    constituencyCode,
    constituencyName,
    partyCode,
    partyName,
  };
});

const result = JSON.stringify(members, null, 2);

fs.writeFileSync("normalised-data/33-dail-members.js", result);
