export default async (startDate: string, endDate: string): Promise<any> => { // todo - data type
    // todo try catch
    const url = `https://api.oireachtas.ie/v1/debates?chamber_type=house&chamber=dail&date_start=${startDate}&date_end=${endDate}`;
    const res = await fetch(url);

    const body = await res.json();
    return body;
}
