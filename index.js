const   express = require('express'),
        app = express(),
        puppeteer = require('puppeteer'),
        merge = require('easy-pdf-merge'),
        fs = require('fs'),
        logger = require('morgan'),
        port = 3000,
        moment = require('moment');
app.locals.moment = moment; // Pass throught the moment library to ejs view pages
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
app.use(logger('dev'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/pdfs'));
app.use(express.static(__dirname + '/assets'));

app.get('/genel', require('./controllers/genel').genel_analiz)
app.get('/haber', require('./controllers/haber').haber_analiz)
app.get('/twitter', require('./controllers/twitter').twitter_analiz)
app.get('/instagram', require('./controllers/instagram').instagram_analiz)
app.get('/forumblog', require('./controllers/forumblog').forumblog_analiz)
app.get('/video', require('./controllers/video').video_analiz)
app.get('/rapor', (req, res)=>{
    res.render('rapor',{
        token : req.query.token,
        stream_id : req.query.stream_id,
        start_date : req.query.start_date,
        end_date : req.query.end_date
    });
})
app.get('/pdf', (req, res) => {
    const token = req.query.token
    const stream_id = req.query.stream_id
    const start_date = req.query.start_date
    const end_date = req.query.end_date
    var pdfUrls = [
        {
            "name":"genel",
            "url":"http://127.0.0.1:"+port+"/genel?token="+token+"&stream_id="+stream_id+"&start_date="+start_date+"&end_date="+end_date+""
        },
        {
            "name":"haber",
            "url":"http://127.0.0.1:"+port+"/haber?token="+token+"&stream_id="+stream_id+"&start_date="+start_date+"&end_date="+end_date+""
        },
        {
            "name":"twitter",
            "url":"http://127.0.0.1:"+port+"/twitter?token="+token+"&stream_id="+stream_id+"&start_date="+start_date+"&end_date="+end_date+""
        },
        {
            "name":"instagram",
            "url":"http://127.0.0.1:"+port+"/instagram?token="+token+"&stream_id="+stream_id+"&start_date="+start_date+"&end_date="+end_date+""
        },
        {
            "name":"forumblog",
            "url":"http://127.0.0.1:"+port+"/forumblog?token="+token+"&stream_id="+stream_id+"&start_date="+start_date+"&end_date="+end_date+""
        },
        {
            "name":"video",
            "url":"http://127.0.0.1:"+port+"/video?token="+token+"&stream_id="+stream_id+"&start_date="+start_date+"&end_date="+end_date+""
        }
    ]
    async function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    console.log("PDF Hazırlanıyor");
    //const directoryDate = Date.now()
    const directoryDate = moment().format('DD_MM_YYYY__HH_mm_ss_a') + "_" + stream_id
    var directory = "assets/pdfs/" + directoryDate
    fs.mkdirSync(directory);
    (async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--headless', '--start-maximized', '--no-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 2000, height: 768});
        var pdfFiles=[];
        pdfFiles.push(`assets/pdfs/giris.pdf`);
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
        pdfFiles.push(`assets/pdfs/bitis.pdf`);
        await mergeMultiplePDF(pdfFiles);
        res.status(200).json({
            success:true,
            "path":"/pdfs/"+directoryDate+"/final.pdf"
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