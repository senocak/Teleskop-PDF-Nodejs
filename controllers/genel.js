const   moment  = require(`moment`),
        axios   = require(`axios`);

exports.genel_analiz = async function (req, res, next) {
    const
            token = req.query.token,
            stream_id = req.query.stream_id,
            start_date = req.query.start_date,
            end_date = req.query.end_date

    var     startDate = moment(start_date),
            endDate = moment(end_date),
            betweenDays = endDate.diff(startDate, `days`),
            lastWeekStart = startDate.subtract(betweenDays, `days`).format(`YYYY-MM-DDTHH:mm:ss.sss`),
            lastWeekEnd = start_date

    axios.defaults.headers.common[`Authorization`] = `Bearer ${token}`;
    // Current Week datas
    const currentRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/all/stats/histogram?end_date=${end_date}&start_date=`+start_date)
    var currentResToplam= 0
    for(var i=0; i < currentRes.data.stats.length; i++){
        currentResToplam = currentResToplam + currentRes.data.stats[i].doc_count
    }
    // Last week datas
    const lastWeekRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/all/stats/histogram?end_date=${lastWeekEnd}&start_date=`+lastWeekStart)
    var lastWeekResTotal = 0;
    for(var i=0; i < lastWeekRes.data.stats.length; i++){
        lastWeekResTotal = lastWeekResTotal + lastWeekRes.data.stats[i].doc_count
    }
    // Oran
    var oran = ``;
    if (currentResToplam > lastWeekResTotal) {
        oran = `%${((currentResToplam - lastWeekResTotal)/(currentResToplam)*100).toFixed(2) } oranında artma`;
    } else {
        oran = `%${((lastWeekResTotal - currentResToplam)/(currentResToplam)*100).toFixed(2)} oranında azalma`;
    }
    const kategoriChartRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/stats/totals?end_date=${end_date}&start_date=`+start_date)
    res.render(`general`,{
        start_date          : startDate.format(`D.MM.Y`),
        end_date            : endDate.format(`D.MM.Y`),
        currentRes          : currentRes.data,
        lastWeekRes         : lastWeekRes.data,
        currentResToplam    : currentResToplam,
        lastWeekResTotal    : lastWeekResTotal,
        oran                : oran,
        kategoriChartRes    : kategoriChartRes.data
    });
}