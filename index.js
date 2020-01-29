const express = require('express')
const app = express()
const puppeteer = require('puppeteer')
const merge = require('easy-pdf-merge');
const fs = require('fs');
const port = 3000
app.use(express.static('assets'));
app.set('view engine', 'ejs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.get('/genel', require('./controllers/genel').genel_analiz)
app.get('/haber', require('./controllers/haber').haber_analiz)
app.get('/twitter', require('./controllers/twitter').twitter_analiz)
app.get('/instagram', require('./controllers/instagram').instagram_analiz)
app.get('/forumblog', require('./controllers/forumblog').forumblog_analiz)
app.get('/video', require('./controllers/video').video_analiz)

app.get('/pdf', (req, res) => {
    var pdfUrls = [
        {
            "name":"genel",
            "url":"http://127.0.0.1:3000/genel?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzkzNTEwNzUsIm5iZiI6MTU3OTM1MTA3NSwianRpIjoiMGEwNDcwYmItNTRjMy00MjczLWE4MzgtZGJmODdkNmJiOWE5IiwiaWRlbnRpdHkiOiJzZXJ2ZXRAYmlsZ2ltZWR5YS5jb20udHIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.tIII43uoMHAm4f-2Ss7unjfFv7UMigRvAY0KxzO9wOo&stream_id=5debd0e928c70a000c7c3eb4&start_date=2020-01-12T20:21:00.000&end_date=2020-01-18T20:59:59.999"
        },
        {
            "name":"haber",
            "url":"http://127.0.0.1:3000/haber?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzkzNTEwNzUsIm5iZiI6MTU3OTM1MTA3NSwianRpIjoiMGEwNDcwYmItNTRjMy00MjczLWE4MzgtZGJmODdkNmJiOWE5IiwiaWRlbnRpdHkiOiJzZXJ2ZXRAYmlsZ2ltZWR5YS5jb20udHIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.tIII43uoMHAm4f-2Ss7unjfFv7UMigRvAY0KxzO9wOo&stream_id=5debd0e928c70a000c7c3eb4&start_date=2020-01-12T20:21:00.000&end_date=2020-01-18T20:59:59.999"
        },
        {
            "name":"twitter",
            "url":"http://127.0.0.1:3000/twitter?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzkzNTEwNzUsIm5iZiI6MTU3OTM1MTA3NSwianRpIjoiMGEwNDcwYmItNTRjMy00MjczLWE4MzgtZGJmODdkNmJiOWE5IiwiaWRlbnRpdHkiOiJzZXJ2ZXRAYmlsZ2ltZWR5YS5jb20udHIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.tIII43uoMHAm4f-2Ss7unjfFv7UMigRvAY0KxzO9wOo&stream_id=5debd0e928c70a000c7c3eb4&start_date=2020-01-12T20:21:00.000&end_date=2020-01-18T20:59:59.999"
        },
        {
            "name":"instagram",
            "url":"http://127.0.0.1:3000/instagram?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzkzNTEwNzUsIm5iZiI6MTU3OTM1MTA3NSwianRpIjoiMGEwNDcwYmItNTRjMy00MjczLWE4MzgtZGJmODdkNmJiOWE5IiwiaWRlbnRpdHkiOiJzZXJ2ZXRAYmlsZ2ltZWR5YS5jb20udHIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.tIII43uoMHAm4f-2Ss7unjfFv7UMigRvAY0KxzO9wOo&stream_id=5debd0e928c70a000c7c3eb4&start_date=2020-01-12T20:21:00.000&end_date=2020-01-18T20:59:59.999"
        },
        {
            "name":"forumblog",
            "url":"http://127.0.0.1:3000/forumblog?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzkzNTEwNzUsIm5iZiI6MTU3OTM1MTA3NSwianRpIjoiMGEwNDcwYmItNTRjMy00MjczLWE4MzgtZGJmODdkNmJiOWE5IiwiaWRlbnRpdHkiOiJzZXJ2ZXRAYmlsZ2ltZWR5YS5jb20udHIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.tIII43uoMHAm4f-2Ss7unjfFv7UMigRvAY0KxzO9wOo&stream_id=5debd0e928c70a000c7c3eb4&start_date=2020-01-12T20:21:00.000&end_date=2020-01-18T20:59:59.999"
        },
        {
            "name":"video",
            "url":"http://127.0.0.1:3000/video?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzkzNTEwNzUsIm5iZiI6MTU3OTM1MTA3NSwianRpIjoiMGEwNDcwYmItNTRjMy00MjczLWE4MzgtZGJmODdkNmJiOWE5IiwiaWRlbnRpdHkiOiJzZXJ2ZXRAYmlsZ2ltZWR5YS5jb20udHIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.tIII43uoMHAm4f-2Ss7unjfFv7UMigRvAY0KxzO9wOo&stream_id=5debd0e928c70a000c7c3eb4&start_date=2020-01-12T20:21:00.000&end_date=2020-01-18T20:59:59.999"
        }
    ]
    async function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    console.log("PDF Hazırlanıyor");
    var directory = "pdfs/"+Date.now()
    fs.mkdirSync(directory);
    (async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--headless','--start-maximized']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 2000, height: 768});
        var pdfFiles=[];
        pdfFiles.push(`pdfs/giris.pdf`);
        for(var i=0; i<pdfUrls.length; i++){
            console.log(`İşlem: ${pdfUrls[i].name}`);
            await page.goto(pdfUrls[i].url, {waitUntil: 'networkidle2'});
            await timeout(1000);
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
                    fullPage: true
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
                console.log(`Merged PDF: ${directory}/final.pdf`);
                resolve();
            });
        });
    };
})
app.listen(port, () => console.log(`http://127.0.0.1:${port}`))