# Data Tools
Tools to pull and transform the data from the oireachtas API

## Approach

Use divisions API to get voting data.

Mix that with TD info.

Want to also Merge this into the debates but need to look at the approach fro this as the XML isn't easy to work with.

## Old Approach

This approach isn't going to work - parsing the XML is problematic (technically OK to do but format is quite complex to traverse reliably). Will use the Divisions endpoint on the API for votes and marry that with the some of ther other data. Will still need to scrape debate content.

Cron job runs deploy/nightly each week night at 23:30. This script:

1. Pulls all votes for a time period - `startDate`, `endDate` (format yyyy-mm-dd)
2. Loops over the results and uses the `contextDate` field to pull the full xml file for that day's activity. Currently, 31st August 2020, the API is broken for pulling XML for individual debates. The URL to pull the full day's data is `https://data.oireachtas.ie/akn/ie/debateRecord/dail/${contextDate}/debate/mul@/main.xml`
3. This XML file contains all of the data for the day - speeches, votes, results and all related data. It's relatively large, 2020-07-30 is 1MB, and parsing it is not straightforward

### Parsing the XML
Near the top of the XML data there is - 

```
 <analysis source="#source">
    <parliamentary>
        <voting eId="vote_37" href="#sum_34" outcome="#lost" refersTo="#sum_33">
            <count eId="vote_37-count_1" href="#qty_1" refersTo="#ta" value="52"/>
            <count eId="vote_37-count_2" href="#qty_2" refersTo="#nil" value="67"/>
            <count eId="vote_37-count_3" href="#qty_3" refersTo="#staon" value="0"/>
        </voting>
        <voting eId="vote_38" href="#sum_42" outcome="#lost" refersTo="#sum_41">
            <count eId="vote_38-count_1" href="#qty_4" refersTo="#ta" value="57"/>
            <count eId="vote_38-count_2" href="#qty_5" refersTo="#nil" value="72"/>
            <count eId="vote_38-count_3" href="#qty_6" refersTo="#staon" value="0"/>
        </voting>
        <voting eId="vote_39" href="#sum_49" outcome="#lost" refersTo="#sum_48">
            <count eId="vote_39-count_1" href="#qty_7" refersTo="#ta" value="58"/>
            <count eId="vote_39-count_2" href="#qty_8" refersTo="#nil" value="77"/>
            <count eId="vote_39-count_3" href="#qty_9" refersTo="#staon" value="0"/>
        </voting>
```


This looks like a summary of all the votes for that day and I can use the href and refersTo attributes to find all the appopriate info.

For example following the `refersTo` for the first vote above `refersTo="#sum_33"` I can get the vote details - outcome and who voted.

This section starts with:

```
<debateSection name="division" refersTo="#bill.2020.17.dail." eId="dbsect_24">
	<summary eId="sum_33">Amendment put: </summary>
	<summary title="division" eId="sum_34">The Committee divided: Tá, 
	    <quantity refersTo="#ta" normalized="52" eId="qty_1">52</quanti
```

The `refersTo` here, `bill.2020.17.dail.`, can be used to find the debate.

```
<debateSection name="debate" refersTo="#bill.2020.17.dail.3_sub" eId="dbsect_23">
    <heading>Residential Tenancies and Valuation Bill 2020: Committee and Remaining Stages
        <recordedTime time="2020-07-30T15:20:00+01:00"/>
    </heading>
    <summary eId="sum_31"> Sections 1 and 2 agreed to.</summary>
```

This contains the full text of the debate and other details.

## Housekeeping

Archive folder contains initial, offline data transform and site scraping scripts.