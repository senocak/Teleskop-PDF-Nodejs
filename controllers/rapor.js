const   moment      = require(`moment`),
        axios       = require(`axios`),
        puppeteer   = require('puppeteer'),
        merge       = require('easy-pdf-merge'),
        fs          = require('fs')
exports.rapor = async function (req, res, next) {
    var     uuid = req.query.uuid,
            data = await axios.get(`https://apiv2.teleskop.app/v2.0/analysis/params/${uuid}`).then(function (response) { return response.data.params })
    async function date(date) {
        return date.split('+')[0];
    }
    res.render('rapor',{
        token       : data.token,
        stream_id   : data.stream_id,
        start_date  : await date(data.start_date),
        end_date    : await date(data.end_date)
    });
}
exports.pdf = async function (req, res, next) {
    const   uuid        = req.query.uuid,
            port        = process.env.PORT,
            data        = await axios.get(`https://apiv2.teleskop.app/v2.0/analysis/params/${uuid}`).then(function (response) { return response.data.params }),
            token       = data.token,
            stream_id   = data.stream_id,
            start_date  = await date(data.start_date),
            end_date    = await date(data.end_date)
    async function date(date) {
        return date.split('+')[0];
    }
    var pdfUrls = [
        {
            'name':'genel',
            'url':`http://127.0.0.1:${port}/genel?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':'haber',
            'url':`http://127.0.0.1:${port}/haber?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`twitter`,
            'url':`http://127.0.0.1:${port}/twitter?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`instagram`,
            'url':`http://127.0.0.1:${port}/instagram?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`forumblog`,
            'url':`http://127.0.0.1:${port}/forumblog?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`video`,
            'url':`http://127.0.0.1:${port}/video?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        }
    ]
    async function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    console.log(`PDF Hazırlanıyor`);
    //const directoryDate = Date.now()
    const   directoryDate   = moment().format('DD_MM_YYYY__HH_mm_ss_a') + `_` + uuid,
            directory       = `assets/pdfs/` + directoryDate
    fs.mkdirSync(directory);
    (async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args    : ['--headless', '--start-maximized', '--no-sandbox']
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
                    path    : pdfFileName,
                    format  : 'A4',
                    margin  : {
                        bottom: '100px',
                    },
                    displayHeaderFooter: true,
                    footerTemplate: `<div style='width:100%; margin-top:100px; text-align:center; font-size:10px; border-bottom: 20px solid #4e82c9;'>
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
            success :true,
            'path'  :`/pdfs/${directoryDate}/final.pdf`
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
}
exports.a = async function (req, res, next) {
    const   token = req.query.token,
            stream_id = req.query.stream_id,
            start_date = req.query.start_date,
            end_date = req.query.end_date
    axios.defaults.headers.common[`Authorization`] = `Bearer `+token;
    const turkiyeHaritasi = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/analysis/city/count?end_date=${end_date}&start_date=${start_date}`).then(function (response) { return response.data })
    const ulusalBolgeselYerelGrafik = await axios.get(`https://apiv2.teleskop.app/v2.0/streams/${stream_id}/news/analysis/natloc/count?end_date=${end_date}&start_date=${start_date}`).then(function (response) { return response.data })
    res.json(turkiyeHaritasi)
}