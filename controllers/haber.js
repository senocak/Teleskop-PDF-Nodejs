const moment = require('moment');
const axios = require('axios');

exports.haber_analiz = async function (req, res, next) {
    
    const token = req.query.token
    const stream_id = req.query.stream_id
    const start_date = req.query.start_date
    const end_date = req.query.end_date
    var current = new Date(start_date)
    const betweenDays = Math.round(Math.abs((new Date(start_date) - new Date(end_date)) / (24 * 60 * 60 * 1000)));
    var lastWeekStart = (new Date(current.setDate(current.getDate() - betweenDays)).toISOString()).slice(0, -1)
    var lastWeekEnd = start_date
    axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
    axios.all([
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/news/stats/histogram?end_date='+end_date+'&start_date='+start_date),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/news/stats/histogram?end_date='+lastWeekEnd+'&start_date='+lastWeekStart),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/popular/news?end_date='+end_date+'&start_date='+start_date),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/news/stats/sources?end_date='+end_date+'&start_date='+start_date)
    ]).then(axios.spread((currentRes, lastWeekRes, popularNewsRes, popularNewsCountRes) => {
        var currentResToplam= 0;
        for(var i=0; i < currentRes.data.stats.length; i++){
            currentResToplam = currentResToplam + currentRes.data.stats[i].doc_count
        }
        var lastWeekResTotal = 0;
        for(var i=0; i < lastWeekRes.data.stats.length; i++){
            lastWeekResTotal = lastWeekResTotal + lastWeekRes.data.stats[i].doc_count
        }
        var oran = "";
        if (currentResToplam > lastWeekResTotal) {
            oran = "%"+((currentResToplam - lastWeekResTotal)/(currentResToplam)*100).toFixed(2)+" oranında artma";
        } else {
            oran = "%"+((lastWeekResTotal - currentResToplam)/(currentResToplam)*100).toFixed(2)+" oranında azalma";
        }
        var startDate = start_date.replace(/-/g, '.').split("T")[0]
        var endDate = end_date.replace(/-/g, '.').split("T")[0]
        res.render('haber',{
            start_date:startDate,
            end_date:endDate,
            currentRes:currentRes.data,
            lastWeekRes:lastWeekRes.data,
            currentResToplam:currentResToplam,
            lastWeekResTotal:lastWeekResTotal,
            oran:oran,
            popularNewsRes:popularNewsRes.data,
            popularNewsCountRes:popularNewsCountRes.data
        });
    }))
}