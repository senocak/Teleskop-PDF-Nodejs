const moment = require('moment');
const axios = require('axios');

exports.twitter_analiz = async function (req, res, next) {
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
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter/stats/histogram?end_date='+end_date+'&start_date='+start_date),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter/stats/histogram?end_date='+lastWeekEnd+'&start_date='+lastWeekStart),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/popular/twitter?end_date='+end_date+'&start_date='+start_date),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter?&start_date='+start_date+'&end_date='+end_date+'&slang=3'),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter?&start_date='+start_date+'&end_date='+end_date+'&slang=2'),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter?&start_date='+start_date+'&end_date='+end_date+'&slang=4'),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter/analysis/gender?gender=2'),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter/analysis/gender?gender=1'),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter/analysis/gender?gender=0')
    ]).then(axios.spread((currentRes, lastWeekRes,populerTweetsRes, hakaretRes, kufurRes, siddetRes, genderKadınRes, genderErkekRes, genderUniRes) => {
        var gsDayNames = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi']
        var currentResToplam = 0
        for(var i=0; i < currentRes.data.stats.length; i++){
            currentRes.data.stats[i].day = gsDayNames[(new Date(currentRes.data.stats[i].key_as_string)).getDay()]
            currentResToplam = currentResToplam + currentRes.data.stats[i].doc_count
        }
        var lastWeekResTotal = 0
        for(var i=0; i < lastWeekRes.data.stats.length; i++){
            lastWeekResTotal = lastWeekResTotal + lastWeekRes.data.stats[i].doc_count
        }
        var oran = "";
        if (currentResToplam > lastWeekResTotal) {
            oran = "%"+((currentResToplam - lastWeekResTotal)/(currentResToplam)*100).toFixed(2)+" oranında artma";
        } else {
            oran = "%"+((lastWeekResTotal - currentResToplam)/(currentResToplam)*100).toFixed(2)+" oranında azalma";
        }
        for(var i=0; i < populerTweetsRes.data.documents.length; i++){
            populerTweetsRes.data.documents[i].created_at = new Date(populerTweetsRes.data.documents[i].created_at).toLocaleDateString("en-US",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        }
        res.render('twitter',{
            start_date:startDateFormat,
            end_date:endDateFormat,
            currentRes:currentRes.data,
            lastWeekRes:lastWeekRes.data,
            currentResToplam:currentResToplam,
            lastWeekResTotal:lastWeekResTotal,
            oran:oran,
            populerTweetsRes:populerTweetsRes.data,
            hakaretRes:hakaretRes.data,
            kufurRes:kufurRes.data,
            siddetRes:siddetRes.data,
            genderKadınRes:genderKadınRes.data,
            genderErkekRes:genderErkekRes.data,
            genderUniRes:genderUniRes.data
        });
    }))
}