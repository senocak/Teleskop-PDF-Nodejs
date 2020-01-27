const express = require('express')
const app = express()
const axios = require('axios');
app.use(express.static('assets'));
const port = 3000
app.set('view engine', 'ejs');
const puppeteer = require('puppeteer')
const merge = require('easy-pdf-merge');
const fs = require('fs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.get('/genel', (req, res) => {
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
app.get('/haber-analiz', (req, res) => {
    //https://apiv2.teleskop.app/v2.0/streams/5cdbc881d6177a000b74e1b1/news/stats/histogram?end_date=2019-10-31T14:35:45.395&start_date=2019-10-24T14:35:45.395
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
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/news/stats/histogram?end_date='+lastWeekEnd+'&start_date='+lastWeekStart)
    ]).then(axios.spread((currentRes, lastWeekRes) => {
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
        res.render('haber-analiz',{
            start_date:startDate,
            end_date:endDate,
            currentRes:currentRes.data,
            lastWeekRes:lastWeekRes.data,
            currentResToplam:currentResToplam,
            lastWeekResTotal:lastWeekResTotal,
            oran:oran
        });
    }))
})
app.get('/twitter', (req, res) => {
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
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter/stats/histogram?end_date='+end_date+'&start_date='+start_date),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter/stats/histogram?end_date='+lastWeekEnd+'&start_date='+lastWeekStart),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/popular/twitter?end_date='+end_date+'&start_date='+start_date),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter?&start_date='+start_date+'&end_date='+end_date+'&slang=3'),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter?&start_date='+start_date+'&end_date='+end_date+'&slang=2'),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter?&start_date='+start_date+'&end_date='+end_date+'&slang=4'),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter/analysis/gender?gender=2?&start_date='+start_date+'&end_date='+end_date),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter/analysis/gender?gender=1?&start_date='+start_date+'&end_date='+end_date),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/twitter/analysis/gender?gender=0?&start_date='+start_date+'&end_date='+end_date)
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
        var startDate = start_date.replace(/-/g, '.').split("T")[0]
        var endDate = end_date.replace(/-/g, '.').split("T")[0]
        res.render('twitter',{
            start_date:startDate,
            end_date:endDate,
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
})
app.get('/instagram', (req, res) => {
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
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/instagram/stats/histogram?end_date='+end_date+'&start_date='+start_date),
        axios.get('https://apiv2.teleskop.app/v2.0/streams/'+stream_id+'/instagram/stats/histogram?end_date='+lastWeekEnd+'&start_date='+lastWeekStart)
    ]).then(axios.spread((currentRes, lastWeekRes,populerInstaRes) => {
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
        var startDate = start_date.replace(/-/g, '.').split("T")[0]
        var endDate = end_date.replace(/-/g, '.').split("T")[0]
        res.render('instagram',{
            start_date:startDate,
            end_date:endDate,
            currentRes:currentRes.data,
            lastWeekRes:lastWeekRes.data,
            currentResToplam:currentResToplam,
            lastWeekResTotal:lastWeekResTotal,
            oran:oran
        });
    }))
})
app.get('/pdf', (req, res) => {
    var pdfUrls = [
        {
            "name":"genel",
            "url":"http://127.0.0.1:3000/genel?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzkzNTEwNzUsIm5iZiI6MTU3OTM1MTA3NSwianRpIjoiMGEwNDcwYmItNTRjMy00MjczLWE4MzgtZGJmODdkNmJiOWE5IiwiaWRlbnRpdHkiOiJzZXJ2ZXRAYmlsZ2ltZWR5YS5jb20udHIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.tIII43uoMHAm4f-2Ss7unjfFv7UMigRvAY0KxzO9wOo&stream_id=5debd0e928c70a000c7c3eb4&start_date=2020-01-12T20:21:00.000&end_date=2020-01-18T20:59:59.999"
        },
        {
            "name":"haber-analiz",
            "url":"http://127.0.0.1:3000/haber-analiz?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzkzNTEwNzUsIm5iZiI6MTU3OTM1MTA3NSwianRpIjoiMGEwNDcwYmItNTRjMy00MjczLWE4MzgtZGJmODdkNmJiOWE5IiwiaWRlbnRpdHkiOiJzZXJ2ZXRAYmlsZ2ltZWR5YS5jb20udHIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.tIII43uoMHAm4f-2Ss7unjfFv7UMigRvAY0KxzO9wOo&stream_id=5debd0e928c70a000c7c3eb4&start_date=2020-01-12T20:21:00.000&end_date=2020-01-18T20:59:59.999"
        },
        {
            "name":"twitter",
            "url":"http://127.0.0.1:3000/twitter?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzkzNTEwNzUsIm5iZiI6MTU3OTM1MTA3NSwianRpIjoiMGEwNDcwYmItNTRjMy00MjczLWE4MzgtZGJmODdkNmJiOWE5IiwiaWRlbnRpdHkiOiJzZXJ2ZXRAYmlsZ2ltZWR5YS5jb20udHIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.tIII43uoMHAm4f-2Ss7unjfFv7UMigRvAY0KxzO9wOo&stream_id=5debd0e928c70a000c7c3eb4&start_date=2020-01-12T20:21:00.000&end_date=2020-01-18T20:59:59.999"
        },
        {
            "name":"instagram",
            "url":"http://127.0.0.1:3000/instagram?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzkzNTEwNzUsIm5iZiI6MTU3OTM1MTA3NSwianRpIjoiMGEwNDcwYmItNTRjMy00MjczLWE4MzgtZGJmODdkNmJiOWE5IiwiaWRlbnRpdHkiOiJzZXJ2ZXRAYmlsZ2ltZWR5YS5jb20udHIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.tIII43uoMHAm4f-2Ss7unjfFv7UMigRvAY0KxzO9wOo&stream_id=5debd0e928c70a000c7c3eb4&start_date=2020-01-12T20:21:00.000&end_date=2020-01-18T20:59:59.999"
        }
    ]
    console.log("PDF Hazırlanıyor");
    var directory = "pdfs/"+Date.now()
    fs.mkdirSync(directory);
    (async () => {
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        var pdfFiles=[];
        pdfFiles.push(`pdfs/giris.pdf`);
        for(var i=0; i<pdfUrls.length; i++){
            console.log(`Url: ${pdfUrls[i].name}`);
            await page.goto(pdfUrls[i].url, {waitUntil: 'networkidle2'});
            var pdfFileName =  directory+`/${pdfUrls[i].name}.pdf`;
            pdfFiles.push(pdfFileName);
            await page.pdf(
                {
                    path: pdfFileName,
                    format: 'A4',
                    margin: {
                        bottom: '100px',
                    },
                    displayHeaderFooter: true,
                    footerTemplate: `<div style="width:100%; margin-top:100px; text-align:center; font-size:10px; border-bottom: 20px solid #4e82c9;">
                                        <strong>a:</strong> Mustafa Kemal Mahallesi, 2129. Sokak, No:6/2 Çankaya – ANKARA <strong>t:</strong> 0 850 303 41 05 <strong>m:</strong> info@teleskop.app
                                    </div>`,
                }
            );
        }
        await browser.close();
        pdfFiles.push(`pdfs/bitis.pdf`);
        await mergeMultiplePDF(pdfFiles);
        res.status(200).json({
            "pdf":directory+"/final.pdf"
        })
        //res.download(directory+'./pdfs/final.pdf')
    })();
    const mergeMultiplePDF = (pdfFiles) => {
        return new Promise((resolve, reject) => {
            merge(pdfFiles,directory+"/final.pdf",function(err){
                if(err){
                    console.log(err);
                    reject(err);
                }
                console.log('Başarılı');
                resolve();
            });
        });
    };
})
app.listen(port, () => console.log(`http://127.0.0.1:${port}`))