const   moment  = require('moment'),
        axios   = require('axios');

exports.video_analiz = async function (req, res, next) {
    const   token = req.query.token,
            stream_id = req.query.stream_id,
            start_date = req.query.start_date,
            end_date = req.query.end_date

    var     startDate = moment(start_date),
            endDate = moment(end_date),
            betweenDays = endDate.diff(startDate, `days`),
            lastWeekStart = startDate.subtract(betweenDays, `days`).format(`YYYY-MM-DDTHH:mm:ss.sss`),
            lastWeekEnd = start_date,
            dayNames = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi']

    axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
    // Current Week datas
    const currentRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/video/stats/histogram?end_date=${end_date}&start_date=`+start_date)
    var currentResToplam= 0
    for(var i=0; i < currentRes.data.stats.length; i++){
        currentRes.data.stats[i].day = dayNames[(new Date(currentRes.data.stats[i].key_as_string)).getDay()]
        currentResToplam += currentRes.data.stats[i].doc_count
    }
    // Before Week datas
    const lastWeekRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/video/stats/histogram?end_date=${lastWeekEnd}&start_date=`+lastWeekStart)
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
    // Popüler Videolar
    const populerTweetsRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/popular/analysis/video?end_date=${end_date}&start_date=${start_date}`)
    for(var i=0; i < populerTweetsRes.data.documents.length; i++){
        populerTweetsRes.data.documents[i].created_at = new Date(populerTweetsRes.data.documents[i].created_at).toLocaleDateString("en-US",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
    // En Fazla İçerik Çıkan Kaynaklar
    const popularVideoCountRes = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/video/stats/sources?end_date=${end_date}&start_date=${start_date}`)
    res.render('video',{
        start_date          : startDate.format("D.MM.Y"),
        end_date            : endDate.format("D.MM.Y"),
        currentRes          : currentRes.data,
        lastWeekRes         : lastWeekRes.data,
        currentResToplam    : currentResToplam,
        lastWeekResTotal    : lastWeekResTotal,
        oran                : oran,
        populerTweetsRes    : populerTweetsRes.data,
        popularVideoCountRes:popularVideoCountRes.data
    })
}