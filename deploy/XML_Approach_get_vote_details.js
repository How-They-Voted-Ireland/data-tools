import parser from "https://dev.jspm.io/fast-xml-parser";

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFileSync("./sample.xml");
const text = decoder.decode(data);

const VoteOptions = {
    ta: 'yes',
    nil:  'no',
    staon:  'abstain',
};

const { meta, references, debateBody } = parser.parse(text, { 
    parseAttributeValue: true,
    ignoreAttributes: false,
    ignoreNameSpace: false,
    attributeNamePrefix: '',
}).akomaNtoso.debate;

// console.log(JSON.stringify(debateBody, null, 2));

// const votes = meta.analysis.parliamentary.voting.map(vote => {
//     let total = 0;
//     const count = vote.count.reduce((acc, curr ) => {
//         total += curr.value;
//         acc[VoteOptions[curr.refersTo.substring(1)]] = curr.value; // substring to remove the # from the start of the refersTo value

//         return acc;
//     }, {});

//     count.total = total;

//     return {
//         eId: vote.eId,
//         refersTo: vote.refersTo,
//         count,
//     }
// });

// console.log(votes);

const divisions = debateBody.debateSection.filter(section => (
    section.debateSection && 
    (section.debateSection.name === 'division' || section.debateSection.some(subSection => subSection.name === 'division'))
));

for (const division of divisions) {
    console.log(division.debateSection?.summary?.[0]);
}
