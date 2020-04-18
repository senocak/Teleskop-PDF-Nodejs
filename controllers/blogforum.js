const   moment      = require(`moment`),
        axios       = require(`axios`),
        TELESKOP_URL=process.env.TELESKOP_URL;

exports.sayfaBir = async function (req, res, next) {
    let     token           = req.query.token,
            stream_id       = req.query.stream_id,
            start_date      = req.query.start_date,
            end_date        = req.query.end_date,
            betweenDays     = moment(end_date).diff(moment(start_date), `days`),
            lastWeekStart   = moment(start_date).subtract(betweenDays, `days`).format(`YYYY-MM-DDTHH:mm:ss.sss`),
            lastWeekEnd     = start_date,
            dayNames        = [`Pazar`,`Pazartesi`,`Salı`,`Çarşamba`,`Perşembe`,`Cuma`,`Cumartesi`]

    axios.defaults.headers.common[`Authorization`] = `Bearer `+token;
    // Current Week datas
    const currentRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/forumblog/stats/histogram?end_date=${end_date}&start_date=`+start_date)
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
        oran = `<b>%${((currentResToplam - lastWeekResTotal)/(currentResToplam)*100).toFixed(2) }</b> oranında artış`;
    } else {
        oran = `<b>%${((lastWeekResTotal - currentResToplam)/(currentResToplam)*100).toFixed(2) }</b> oranında azalış`;
    }
    if (betweenDays != 0) {
        start_date = moment(start_date).add(1, 'days').format("D.MM.Y");
        end_date = moment(end_date).add(1, 'days').format("D.MM.Y")
    }else{
        start_date = moment(start_date).format("D.MM.Y");
        end_date = moment(end_date).format("D.MM.Y")
    }
    res.render(`blogforum1`,{
        start_date              : start_date,
        end_date                : end_date,
        currentRes              : currentRes.data,
        lastWeekRes             : lastWeekRes.data,
        currentResToplam        : currentResToplam.toLocaleString(),
        lastWeekResTotal        : lastWeekResTotal,
        oran                    : oran
    })
    console.log('\x1b[33m%s\x1b[0m', "Blog Forum Sayfa 1");
}

exports.sayfaİki = async function (req, res, next) {
    let     token           = req.query.token,
            stream_id       = req.query.stream_id,
            start_date      = req.query.start_date,
            end_date        = req.query.end_date,
            betweenDays     = moment(end_date).diff(moment(start_date), `days`)

    axios.defaults.headers.common[`Authorization`] = `Bearer `+token;
    const currentRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/forumblog/stats/histogram?end_date=${end_date}&start_date=`+start_date)
    const populerForumBlogsRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/popular/analysis/forumblog?end_date=${end_date}&start_date=${start_date}`)
    for(var i=0; i < populerForumBlogsRes.data.documents.length; i++){
        populerForumBlogsRes.data.documents[i].created_at = new Date(populerForumBlogsRes.data.documents[i].created_at).toLocaleDateString("en-US",{ weekday: `long`, year: `numeric`, month: `long`, day: `numeric` })
    }
    const popularForumBlogCountRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/forumblog/stats/sources?end_date=${end_date}&start_date=${start_date}`)
    if (betweenDays != 0) {
        start_date = moment(start_date).add(1, 'days').format("D.MM.Y");
        end_date = moment(end_date).add(1, 'days').format("D.MM.Y")
    }else{
        start_date = moment(start_date).format("D.MM.Y");
        end_date = moment(end_date).format("D.MM.Y")
    }
    res.render(`blogforum2`,{
        start_date              : start_date,
        end_date                : end_date,
        currentRes              : currentRes.data,
        populerForumBlogsRes    : populerForumBlogsRes.data,
        popularForumBlogCountRes: popularForumBlogCountRes.data
    })
    console.log('\x1b[33m%s\x1b[0m', "Blog Forum Sayfa 2");
}