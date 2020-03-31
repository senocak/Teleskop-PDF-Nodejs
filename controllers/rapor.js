const   moment      = require(`moment`),
        axios       = require(`axios`),
        puppeteer   = require('puppeteer'),
        merge       = require('easy-pdf-merge'),
        fs          = require('fs'),
        TELESKOP_URL= process.env.TELESKOP_URL,
        path        = require("path")
        rimraf      = require("rimraf");;

exports.kapak = async function (req, res, next) {
    var     stream_id   = req.query.stream_id,
            end_date    = req.query.end_date,
            start_date  = req.query.start_date,
            token       = req.query.token;

    axios.defaults.headers.common[`Authorization`] = `Bearer ${token}`;
    const data = await axios.get(`${TELESKOP_URL}/streams/${stream_id}/all/stats/histogram?end_date=${end_date}&start_date=`+start_date).then(function (response) { return response.data })
    res.render("kapak", {
        "data"          : data,
        "start_date"    : moment(start_date).format("D.MM.Y"),
        "end_date"      : moment(end_date).format("D.MM.Y"),
    });
    console.log('\x1b[33m%s\x1b[0m', "Kapak");
}

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
    if(JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]'){
        res.status(500).json({
            "hata": "Invalid UUID"
        })
    }
    res.render('rapor',{
        token       : data.token,
        stream_id   : data.stream_id,
        start_date  : data.start_date.split('+')[0],
        end_date    : data.end_date.split('+')[0]
    });
}
exports.pdf = async function (req, res, next) {
    const   uuid        = req.query.uuid,
            data        = await axios.get(`${TELESKOP_URL}/analysis/params/${uuid}`).then(function (response) { return response.data.params }).catch(function (error) {
                res.status(500).json({
                    "hata": error.response.data.message
                })
            }),
            token       = data.token,
            stream_id   = data.stream_id,
            start_date  = data.start_date.split('+')[0],
            end_date    = data.end_date.split('+')[0]

    if(JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]'){
        res.status(500).json({
            "hata": "Invalid UUID"
        })
    }
    var pdfUrls = [
        {
            'name':'kapak',
            'url':`kapak?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':'genel',
            'url':`genel?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':'haber1',
            'url':`haber/1/?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':'haber2',
            'url':`haber/2/?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':'haber3',
            'url':`haber/3/?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':'haber4',
            'url':`haber/4/?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`twitter1`,
            'url':`twitter/1/?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`twitter2`,
            'url':`twitter/2/?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`twitter3`,
            'url':`twitter/3/?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`instagram`,
            'url':`instagram?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`blogforum1`,
            'url':`blogforum/1/?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`blogforum2`,
            'url':`blogforum/2/?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`video1`,
            'url':`video/1/?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        },
        {
            'name':`video2`,
            'url':`video/2/?token=${token}&stream_id=${stream_id}&start_date=${start_date}&end_date=${end_date}`
        }
    ]
    async function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    console.log(`PDF Hazırlanıyor`);
    const   directoryDate   = moment().format('DD_MM_YYYY__HH_mm_ss_a') + `_` + uuid,
            directory       = `assets/pdfs/${directoryDate}`
    fs.mkdirSync(directory);

    (async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args    : ['--headless', '--start-maximized', '--no-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 2000, height: 768});
        var pdfFiles=[];
        //pdfFiles.push(`assets/pdfs/giris.pdf`);
        for(var i=0; i<pdfUrls.length; i++){
            await page.goto(`http://127.0.0.1:${process.env.PORT}/${pdfUrls[i].url}`, {waitUntil: 'networkidle2'});
            await timeout(1000);
            const pdfFileName =  directory+`/${pdfUrls[i].name}.pdf`;
            pdfFiles.push(pdfFileName);
            await page.pdf(
                {
                    path    : pdfFileName,
                    format  : 'A4',
                    fullPage: true,
                    printBackground: true,
                    pageRanges: '1',
                }
            );
        }
        await browser.close();
        pdfFiles.push(`assets/bitis.pdf`);
        await mergeMultiplePDF(pdfFiles);
        const path = `/pdfs/${directoryDate}.pdf`;
        await axios.post(`${process.env.TELESKOP_URL}/analysis/path/uuid/${uuid}`, {"path": path});
        res.status(200).json({
            success :true,
            'path'  :path
        })
        console.log('\x1b[33m%s\x1b[0m', "Rapor Gönderildi");
    })();
    const mergeMultiplePDF = (pdfFiles) => {
        return new Promise((resolve, reject) => {
            merge(pdfFiles,`${directory}.pdf`,function(err){
                if(err){
                    console.log(err);
                    reject(err);
                }
                console.log('\x1b[33m%s\x1b[0m', `Oluşturulan PDF: ${directory}.pdf`);
                rimraf(directory, function () {
                    console.log('\x1b[33m%s\x1b[0m', `Geçici Klasör Silindi: ${directory}`);
                });
                resolve();
            });
        });
    };
}