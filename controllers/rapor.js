const   moment      = require(`moment`),
        axios       = require(`axios`),
        puppeteer   = require('puppeteer'),
        merge       = require('easy-pdf-merge'),
        fs          = require('fs'),
        TELESKOP_URL= process.env.TELESKOP_URL,
        path        = require("path");

exports.report = async function (req, res, next) {
    var     uuid = req.query.uuid,
            data = await axios.get(`${TELESKOP_URL}/analysis/params/${uuid}`).then(function (response) { return response.data.params }).catch(function (error) {
                res.status(500).json({
                    "hata": error.response.data.message
                })
            });
    if (!Object.keys(data).length > 0 ) {
        res.status(500).json({
            "hata": "Invalid UUID"
        })
    }
    const file = path.join(path.join(rootDir,"assets"),data.pdf_path);
    res.download(file);
}
exports.rapor = async function (req, res, next) {
    const   uuid = req.query.uuid,
            data = await axios.get(`${TELESKOP_URL}/analysis/params/${uuid}`).then(function (response) { return response.data.params }).catch(function (error) {
                res.status(500).json({
                    "hata": error.response.data.message
                })
            });
    if (!Object.keys(data).length > 0 ) {
        res.status(500).json({
            "hata": "Invalid UUID"
        })
    }
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
            data        = await axios.get(`${TELESKOP_URL}/analysis/params/${uuid}`).then(function (response) { return response.data.params }).catch(function (error) {
                res.status(500).json({
                    "hata": error.response.data.message
                })
            }),
            token       = data.token,
            stream_id   = data.stream_id,
            start_date  = await date(data.start_date),
            end_date    = await date(data.end_date)
    if (!Object.keys(data).length > 0 ) {
        res.status(500).json({
            "hata": "Invalid UUID"
        })
    }
    async function date(date) {
        return date.split('+')[0];
    }
    var pdfUrls = [
        {
            'name':'genel',
            'url':`genel?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':'haber',
            'url':`haber?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`twitter`,
            'url':`twitter?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`instagram`,
            'url':`instagram?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`blogforum`,
            'url':`blogforum?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`video`,
            'url':`video?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
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
            await page.goto(`http://127.0.0.1:${process.env.PORT}/${pdfUrls[i].url}`, {waitUntil: 'networkidle2'});
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
                    fullPage: true,
                    printBackground: true,
                }
            );
        }
        await browser.close();
        pdfFiles.push(`assets/pdfs/bitis.pdf`);
        await mergeMultiplePDF(pdfFiles);
        const path = `/pdfs/${directoryDate}/final.pdf`;
        await axios.post(`${process.env.TELESKOP_URL}/analysis/path/uuid/${uuid}`, {"path": path});
        res.status(200).json({
            success :true,
            'path'  :path
        })
        console.log('\x1b[33m%s\x1b[0m', "Rapor");
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