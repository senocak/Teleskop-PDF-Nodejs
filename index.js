const   express = require('express'),
        app     = express(),
        logger  = require('morgan'),
        moment  = require('moment'),
        dotenv  = require('dotenv')
const
        GenelController     = require('./controllers/genel'),
        HaberController     = require('./controllers/haber'),
        TwitterController   = require('./controllers/twitter'),
        InstagramController = require('./controllers/instagram'),
        ForumController     = require('./controllers/forumblog'),
        VideoController     = require('./controllers/video'),
        RaporController     = require('./controllers/rapor')
dotenv.config();
app.locals.moment = moment; // Pass throught the moment library to ejs view pages
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
app.use(logger('dev'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/pdfs'));
app.use(express.static(__dirname + '/assets'));
app.get('/genel', GenelController.genel_analiz)
app.get('/haber', HaberController.haber_analiz)
app.get('/twitter', TwitterController.twitter_analiz)
app.get('/instagram', InstagramController.instagram_analiz)
app.get('/forumblog', ForumController.forumblog_analiz)
app.get('/video', VideoController.video_analiz)
app.get('/rapor', RaporController.rapor)
app.get('/pdf', RaporController.pdf)
app.listen(process.env.PORT, () => console.log(`http://127.0.0.1:${process.env.PORT}`))
//uuid=5e4e7469011d78000b86bbef