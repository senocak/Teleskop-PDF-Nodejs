const   moment  = require('moment'),
        axios   = require('axios');

exports.haber_analiz = async function (req, res, next) {
    const   token = req.query.token,
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
    const currentRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/stats/histogram?end_date=${end_date}&start_date=`+start_date)
    var currentResToplam= 0
    for(var i=0; i < currentRes.data.stats.length; i++){
        currentResToplam = currentResToplam + currentRes.data.stats[i].doc_count
    }
    // Before Week datas
    const lastWeekRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/stats/histogram?end_date=${lastWeekEnd}&start_date=`+lastWeekStart)
    var lastWeekResTotal= 0
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
    //Popüler Kaynaklarda Çıkan Haber Sayıları
    const popularNewsCountRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/stats/sources?end_date=${end_date}&start_date=${start_date}`)
    //Popüler Haberler
    const popularNewsRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/popular/news?end_date=${end_date}&start_date=${start_date}`)
    const turkiyeHaritasi = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/analysis/city/count?end_date=${end_date}&start_date=${start_date}`).then(function (response) { return response.data })
    const ulusalBolgeselYerelGrafik = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/analysis/natloc/count?end_date=${end_date}&start_date=${start_date}`).then(function (response) { return response.data })
    res.render('haber',{
        start_date                  : startDate.format("D.MM.Y"),
        end_date                    : endDate.format("D.MM.Y"),
        currentRes                  : currentRes.data,
        currentResToplam            : currentResToplam,
        lastWeekRes                 : lastWeekRes.data,
        lastWeekResTotal            : lastWeekResTotal,
        oran                        : oran,
        popularNewsCountRes         : popularNewsCountRes.data,
        popularNewsRes              : popularNewsRes.data,
        turkiyeHaritasi             : turkiyeHaritasi.count,
        ulusalBolgeselYerelGrafik   : ulusalBolgeselYerelGrafik.data
    });
}


