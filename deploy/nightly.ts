import { parse } from './deps.ts';
import getDailVotes from './get_dail_votes.ts';

const { startDate, endDate } = parse(Deno.args); // todo check format of date yyyy-mm-dd

const dailVotes = await getDailVotes(startDate, endDate);
 
console.log(dailVotes);
