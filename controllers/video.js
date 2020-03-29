const   moment      = require('moment'),
        axios       = require('axios'),
        TELESKOP_URL= process.env.TELESKOP_URL;

exports.video_analiz = async function (req, res, next) {
    const   token           = req.query.token,
            stream_id       = req.query.stream_id,
            start_date      = moment(req.query.start_date).subtract(1, `days`).format(`YYYY-MM-DDT21:00:00.000`),
            end_date        = moment(req.query.end_date).subtract(1, `days`).format(`YYYY-MM-DDT21:00:00.000`),
            betweenDays     = moment(end_date).diff(moment(start_date), `days`),
            lastWeekStart   = moment(start_date).subtract(betweenDays, `days`).format(`YYYY-MM-DDTHH:mm:ss.sss`),
            lastWeekEnd     = start_date,
            dayNames        = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi']

    axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
    // Current Week datas
    const currentRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/video/stats/histogram?end_date=${end_date}&start_date=`+start_date)
    var currentResToplam= 0
    for(var i=0; i < currentRes.data.stats.length; i++){
        currentRes.data.stats[i].day = dayNames[(new Date(currentRes.data.stats[i].key_as_string)).getDay()]
        currentResToplam += currentRes.data.stats[i].doc_count
    }
    // Before Week datas
    const lastWeekRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/video/stats/histogram?end_date=${lastWeekEnd}&start_date=`+lastWeekStart)
    var lastWeekResTotal= 0
    for(var i=0; i < lastWeekRes.data.stats.length; i++){
        lastWeekResTotal = lastWeekResTotal + lastWeekRes.data.stats[i].doc_count
    }
    // Oran
    var oran = ``;
    if (currentResToplam > lastWeekResTotal) {
        oran = `<b>%${((currentResToplam - lastWeekResTotal)/(currentResToplam)*100).toFixed(2) }<b> oranında artma`;
    } else {
        oran = `<b>%${((lastWeekResTotal - currentResToplam)/(currentResToplam)*100).toFixed(2) }<b> oranında azalma`;
    }
    // Popüler Videolar
    const populerTweetsRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/popular/analysis/video?end_date=${end_date}&start_date=${start_date}`)
    for(var i=0; i < populerTweetsRes.data.documents.length; i++){
        populerTweetsRes.data.documents[i].created_at = moment(populerTweetsRes.data.documents[i].created_at).format('DD.MM.YYYY HH:mm:ss')
    }
    // En Fazla İçerik Çıkan Kaynaklar
    const popularVideoCountRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/video/stats/sources?end_date=${end_date}&start_date=${start_date}`)
    res.render('video',{
        start_date          : moment(start_date).format("D.MM.Y"),
        end_date            : moment(end_date).format("D.MM.Y"),
        currentRes          : currentRes.data,
        lastWeekRes         : lastWeekRes.data,
        currentResToplam    : currentResToplam.toLocaleString(),
        lastWeekResTotal    : lastWeekResTotal,
        oran                : oran,
        populerTweetsRes    : populerTweetsRes.data,
        popularVideoCountRes:popularVideoCountRes.data
    })
    console.log('\x1b[33m%s\x1b[0m', "Video");
}