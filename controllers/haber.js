const   moment      = require('moment'),
        axios       = require('axios'),
        sortValues  = require('sort-values');;

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
    const currentRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/stats/histogram?end_date=${end_date}&start_date=${start_date}&populer=1`)
    const lastWeekRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/stats/histogram?end_date=${lastWeekEnd}&start_date=${lastWeekStart}&populer=1`)
    var currentResToplam    = 0,
        lastWeekResTotal    = 0,
        oran                = ``;
    for(var i=0; i < currentRes.data.stats.length; i++){
        currentResToplam = currentResToplam + currentRes.data.stats[i].doc_count
    }
    for(var i=0; i < lastWeekRes.data.stats.length; i++){
        lastWeekResTotal = lastWeekResTotal + lastWeekRes.data.stats[i].doc_count
    }
    if (currentResToplam > lastWeekResTotal) {
        oran = `%${((currentResToplam - lastWeekResTotal)/(currentResToplam)*100).toFixed(2) } oranında artma`;
    } else {
        oran = `%${((lastWeekResTotal - currentResToplam)/(currentResToplam)*100).toFixed(2)} oranında azalma`;
    }
    const kaynaklardaCikanHaberSayilari = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/stats/sources?end_date=${end_date}&start_date=${start_date}&populer=1`)
    const populerKaynaklardaCikanHaberSayilari = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/stats/sources?end_date=${end_date}&start_date=${start_date}`)
    const popularNewsRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/popular/news?end_date=${end_date}&start_date=${start_date}`)
    const turkiyeIlHaritasi = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/analysis/city/count?end_date=${end_date}&start_date=${start_date}`).then(function (response) { return response.data })
    const turkiyeIlHaritasiSorted = sortValues(turkiyeIlHaritasi.count, 'desc');
    const turkiyeBolgeHaritasi = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/analysis/state/count?end_date=${end_date}&start_date=${start_date}`).then(function (response) { return response.data })
    const turkiyeBolgeHaritasiSorted = sortValues(turkiyeBolgeHaritasi.count, 'desc');
    const ulusalBolgeselYerelGrafik = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/analysis/natloc/count?end_date=${end_date}&start_date=${start_date}`).then(function (response) { return response.data })
    const currentResToplamRequest = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/stats/populer/histogram?end_date=${end_date}&start_date=${start_date}`)    
    var currentResToplamBarChart = 0;
    for(var i=0; i < currentResToplamRequest.data.stats.length; i++){
        currentResToplamBarChart += currentResToplamRequest.data.stats[i].doc_count
    }
    const beforeResToplamRequest = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/stats/populer/histogram?end_date=${lastWeekEnd}&start_date=${lastWeekStart}`)
    var beforeResToplamBarChart = 0;
    for(var i=0; i < beforeResToplamRequest.data.stats.length; i++){
        beforeResToplamBarChart += beforeResToplamRequest.data.stats[i].doc_count
    }
    res.render('haber',{
        start_date                              : startDate.format("D.MM.Y"),
        end_date                                : endDate.format("D.MM.Y"),
        currentRes                              : currentRes.data,
        currentResToplam                        : currentResToplam,
        lastWeekRes                             : lastWeekRes.data,
        lastWeekResTotal                        : lastWeekResTotal,
        oran                                    : oran,
        kaynaklardaCikanHaberSayilari           : kaynaklardaCikanHaberSayilari.data,
        populerKaynaklardaCikanHaberSayilari    : populerKaynaklardaCikanHaberSayilari.data,
        popularNewsRes                          : popularNewsRes.data,
        turkiyeIlHaritasi                       : turkiyeIlHaritasiSorted,
        turkiyeBolgeHaritasi                    : turkiyeBolgeHaritasiSorted,
        ulusalBolgeselYerelGrafik               : ulusalBolgeselYerelGrafik.count,
        currentResToplamBarChart                : currentResToplamBarChart,
        beforeResToplamBarChart                 : beforeResToplamBarChart
    });
}


