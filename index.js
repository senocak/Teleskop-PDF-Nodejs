const   express = require('express'),
        app     = express(),
        logger  = require('morgan'),
        moment  = require('moment'),
        dotenv  = require('dotenv')
dotenv.config();
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
app.get('/rapor', require('./controllers/rapor').rapor)//http://127.0.0.1:3000/rapor?uuid=5e4e7469011d78000b86bbef
app.get('/pdf', require('./controllers/rapor').pdf)
app.listen(process.env.PORT, () => console.log(`http://127.0.0.1:${process.env.PORT}`))