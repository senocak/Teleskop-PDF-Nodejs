const   express = require('express'),
        app     = express(),
        logger  = require('morgan'),
        moment  = require('moment'),
        path    = require('path'),
        cors    = require('cors'),
        dotenv  = require('dotenv').config()
const
        GenelController     = require('./controllers/genel'),
        HaberController     = require('./controllers/haber'),
        TwitterController   = require('./controllers/twitter'),
        InstagramController = require('./controllers/instagram'),
        BlogController      = require('./controllers/blogforum'),
        VideoController     = require('./controllers/video'),
        RaporController     = require('./controllers/rapor')
app.locals.moment = moment; // Pass throught the moment library to ejs view pages
global.rootDir = path.resolve(__dirname);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
app.use(cors());
app.use(logger('dev'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/assets'));

app.get('/genel', GenelController.genel_analiz)

app.get('/haber/1', HaberController.sayfaBir)
app.get('/haber/2', HaberController.sayfaİki)
app.get('/haber/3', HaberController.sayfaUc)
app.get('/haber/4', HaberController.sayfaDort)

app.get('/twitter/1', TwitterController.sayfaBir)
app.get('/twitter/2', TwitterController.sayfaİki)
app.get('/twitter/3', TwitterController.sayfaUc)

app.get('/instagram', InstagramController.instagram_analiz)

app.get('/blogforum/1', BlogController.sayfaBir)
app.get('/blogforum/2', BlogController.sayfaİki)

app.get('/video/1', VideoController.sayfaBir)
app.get('/video/2', VideoController.sayfaİki)

app.get('/rapor', RaporController.rapor)

app.get('/pdf', RaporController.pdf)

app.get('/report', RaporController.report)

app.get('/kapak', RaporController.kapak)
app.get('/arka', RaporController.arka)

app.listen(process.env.PORT, () => console.log(`http://127.0.0.1:${process.env.PORT}`))