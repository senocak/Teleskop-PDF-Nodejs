const moment = require('moment');
const axios = require('axios');

exports.genel_analiz = async function (req, res, next) {
    
    const token = req.query.token
    const stream_id = req.query.stream_id
    const start_date = req.query.start_date //2020-01-12T20:21:00.000
    const end_date = req.query.end_date

    var startDate = moment(start_date)
    var startDateFormat = startDate.format("D.MM.Y") // formatted day. example: 12.01.2020

    var endDate = moment(end_date)
    var endDateFormat = endDate.format("D.MM.Y") // formatted day. example: 12.01.2020
    const betweenDays = startDate.diff(endDate, 'days') // Day number example: 5

    var lastWeekStart = startDate.day(betweenDays).format('YYYY-MM-DDTHH:mm:ss.sss') // formatted day of the last week. example: 12.01.2020
    var lastWeekEnd = start_date

    axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
    axios.all([
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/all/stats/histogram?end_date='+end_date+'&start_date='+start_date),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/all/stats/histogram?end_date='+lastWeekEnd+'&start_date='+lastWeekStart),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/stats/totals?end_date='+end_date+'&start_date='+start_date)
    ]).then(axios.spread((currentRes, lastWeekRes,kategoriChartRes) => {
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

        res.render('general',{
            start_date:startDateFormat,
            end_date:endDateFormat,
            currentRes:currentRes.data,
            lastWeekRes:lastWeekRes.data,
            currentResToplam:currentResToplam,
            lastWeekResTotal:lastWeekResTotal,
            oran:oran,
            kategoriChartRes:kategoriChartRes.data
        });
    }))
}