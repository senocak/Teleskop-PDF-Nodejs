const   moment      = require(`moment`),
        axios       = require(`axios`),
        numeral     = require('numeral');//currentResToplam: numeral(currentResToplam).format('0,0'),var ;
        TELESKOP_URL= process.env.TELESKOP_URL;

exports.sayfaBir = async function (req, res, next) {
    const   token           = req.query.token,
            stream_id       = req.query.stream_id,
            start_date      = req.query.start_date,
            end_date        = req.query.end_date,
            betweenDays     = moment(end_date).diff(moment(start_date), `days`),
            lastWeekStart   = moment(start_date).subtract(betweenDays, `days`).format(`YYYY-MM-DDTHH:mm:ss.sss`),
            lastWeekEnd     = start_date

    axios.defaults.headers.common[`Authorization`] = `Bearer `+token;
    // Current Week datas
    var gsDayNames = [`Pazar`,`Pazartesi`,`Salı`,`Çarşamba`,`Perşembe`,`Cuma`,`Cumartesi`]
    const currentRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/twitter/stats/histogram?end_date=${end_date}&start_date=`+start_date)
    var currentResToplam= 0
    for(var i=0; i < currentRes.data.stats.length; i++){
        currentRes.data.stats[i].day = gsDayNames[(new Date(currentRes.data.stats[i].key_as_string)).getDay()]
        currentResToplam += currentRes.data.stats[i].doc_count
    }
    // Last week datas
    const lastWeekRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/twitter/stats/histogram?end_date=${lastWeekEnd}&start_date=`+lastWeekStart)
    var lastWeekResTotal = 0;
    for(var i=0; i < lastWeekRes.data.stats.length; i++){
        lastWeekResTotal += lastWeekRes.data.stats[i].doc_count
    }
    // Oran
    var oran = ``;
    if (currentResToplam > lastWeekResTotal) {
        oran = `<b>%${((currentResToplam - lastWeekResTotal)/(currentResToplam)*100).toFixed(2) }</b> oranında artış`;
    } else {
        oran = `<b>%${((lastWeekResTotal - currentResToplam)/(currentResToplam)*100).toFixed(2)}</b> oranında azalış`;
    }
    //Popüler Tweetler
    const populerTweetsRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/popular/twitter?end_date=${end_date}&start_date=${start_date}`)
    for(var i=0; i < populerTweetsRes.data.documents.length; i++){
        populerTweetsRes.data.documents[i].created_at = new Date(populerTweetsRes.data.documents[i].created_at).toLocaleDateString("en-US",{ weekday: `long`, year: `numeric`, month: `long`, day: `numeric` })
    }
    res.render(`twitter1`,{
        start_date      : moment(start_date).format("D.MM.Y"),
        end_date        : moment(end_date).format("D.MM.Y"),
        currentRes      : currentRes.data,
        lastWeekRes     : lastWeekRes.data,
        currentResToplam: currentResToplam.toLocaleString(),
        lastWeekResTotal: lastWeekResTotal,
        oran            : oran
    });
    console.log('\x1b[33m%s\x1b[0m', "Twitter Sayfa 1");
}

exports.sayfaİki = async function (req, res, next) {
    const   token           = req.query.token,
            stream_id       = req.query.stream_id,
            start_date      = req.query.start_date,
            end_date        = req.query.end_date

    axios.defaults.headers.common[`Authorization`] = `Bearer `+token;
    // Current Week datas
    var gsDayNames = [`Pazar`,`Pazartesi`,`Salı`,`Çarşamba`,`Perşembe`,`Cuma`,`Cumartesi`]
    const currentRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/twitter/stats/histogram?end_date=${end_date}&start_date=`+start_date)
    var currentResToplam= 0
    for(var i=0; i < currentRes.data.stats.length; i++){
        currentRes.data.stats[i].day = gsDayNames[(new Date(currentRes.data.stats[i].key_as_string)).getDay()]
        currentResToplam += currentRes.data.stats[i].doc_count
    }
    //Popüler Tweetler
    const populerTweetsRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/popular/twitter?end_date=${end_date}&start_date=${start_date}`)
    for(var i=0; i < populerTweetsRes.data.documents.length; i++){
        populerTweetsRes.data.documents[i].created_at = new Date(populerTweetsRes.data.documents[i].created_at).toLocaleDateString("en-US",{ weekday: `long`, year: `numeric`, month: `long`, day: `numeric` })
    }
    // Pie Chart
    const
            hakaretRes      = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/twitter?&start_date=${start_date}&end_date=${end_date}&slang=3`),
            kufurRes        = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/twitter?&start_date=${start_date}&end_date=${end_date}&slang=2`),
            siddetRes       = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/twitter?&start_date=${start_date}&end_date=${end_date}&slang=4`),
            genderKadınRes  = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/twitter/analysis/gender?gender=2`),
            genderErkekRes  = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/twitter/analysis/gender?gender=1`),
            genderUniRes    = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/twitter/analysis/gender?gender=0`)
    res.render(`twitter2`,{
        start_date      : moment(start_date).format("D.MM.Y"),
        end_date        : moment(end_date).format("D.MM.Y"),
        currentRes      : currentRes.data,
        currentResToplam: currentResToplam.toLocaleString(),
        hakaretRes      : hakaretRes.data,
        kufurRes        : kufurRes.data,
        siddetRes       : siddetRes.data,
        genderKadınRes  : genderKadınRes.data,
        genderErkekRes  : genderErkekRes.data,
        genderUniRes    : genderUniRes.data
    });
    console.log('\x1b[33m%s\x1b[0m', "Twitter Sayfa 2");
}

exports.sayfaUc = async function (req, res, next) {
    const   token           = req.query.token,
            stream_id       = req.query.stream_id,
            start_date      = req.query.start_date,
            end_date        = req.query.end_date

    axios.defaults.headers.common[`Authorization`] = `Bearer `+token;
    const currentRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/twitter/stats/histogram?end_date=${end_date}&start_date=`+start_date)
    const populerTweetsRes = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/popular/twitter?end_date=${end_date}&start_date=${start_date}`)
    for(var i=0; i < populerTweetsRes.data.documents.length; i++){
        populerTweetsRes.data.documents[i].created_at = new Date(populerTweetsRes.data.documents[i].created_at).toLocaleDateString("en-US",{ weekday: `long`, year: `numeric`, month: `long`, day: `numeric` })
    }
    res.render(`twitter3`,{
        start_date      : moment(start_date).format("D.MM.Y"),
        end_date        : moment(end_date).format("D.MM.Y"),
        currentRes      : currentRes.data,
        populerTweetsRes: populerTweetsRes.data
    });
    console.log('\x1b[33m%s\x1b[0m', "Twitter Sayfa 3");
}