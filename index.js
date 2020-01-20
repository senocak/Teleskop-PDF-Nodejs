const express = require('express')
const app = express()
const axios = require('axios');
app.use(express.static('assets'));
const port = 3000
app.set('view engine', 'ejs');

app.get('/genel', (req, res) => {
    const token = req.query.token
    const stream_id = req.query.stream_id
    const start_date = req.query.start_date
    const end_date = req.query.end_date
    axios.defaults.headers.common['Authorization'] = 'Bearer '+token;

    var current = new Date(start_date);
    var lastWeekStart = new Date(current.setDate(current.getDate() - 7));
    var lastWeekEnd = start_date

    axios.all([
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/all/stats/histogram?end_date='+end_date+'&start_date='+start_date),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/all/stats/histogram?end_date='+lastWeekEnd+'&start_date='+lastWeekStart),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/stats/totals?end_date='+lastWeekEnd+'&start_date='+lastWeekStart),
        axios.get('http://apple.com')
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
        var startDate = start_date.replace(/-/g, '.').split("T")[0]
        var endDate = end_date.replace(/-/g, '.').split("T")[0]
        res.render('general',{
            start_date:startDate,
            end_date:endDate,
            currentRes:currentRes.data,
            lastWeekRes:lastWeekRes.data,
            currentResToplam:currentResToplam,
            lastWeekResTotal:lastWeekResTotal,
            oran:oran,
            kategoriChartRes:kategoriChartRes.data
        });
      }))
})
const puppeteer = require('puppeteer')

app.get('/export/pdf', (req, res) => {
    (async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--disable-dev-shm-usage']
        })
        const page = await browser.newPage()
        await page.goto('http://127.0.0.1:3000/genel?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzkzNTEwNzUsIm5iZiI6MTU3OTM1MTA3NSwianRpIjoiMGEwNDcwYmItNTRjMy00MjczLWE4MzgtZGJmODdkNmJiOWE5IiwiaWRlbnRpdHkiOiJzZXJ2ZXRAYmlsZ2ltZWR5YS5jb20udHIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.tIII43uoMHAm4f-2Ss7unjfFv7UMigRvAY0KxzO9wOo&stream_id=5debd0e928c70a000c7c3eb4&start_date=2020-01-12T20:21:00.000&end_date=2020-01-18T20:59:59.999',{ waitUntil: "networkidle2" })
        const buffer = await page.pdf({
            path: 'pdfs/general.pdf',
            format: 'A4',
            printBackground: true
        })
        res.type('application/pdf')
        res.send(buffer)
        browser.close()
    })()
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))