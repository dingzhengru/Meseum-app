'use strict';
var path = require('path');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5

var app = express();
var server = http.Server(app);

var upload = multer(); // for parsing multipart/form-data

// settings
app.set('json spaces', 4);
app.set('x-powered-by', false);

// middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// static middleware
app.use(express.static(path.join(__dirname, 'public')));

// app.post('/profile', upload.array(), function (request, response, next) {
//     console.log(request.body);
//     response.json(request.body);
// });

app.get('/meseumItems/all', function(request, response) {
    var meseumItems = [
        {
            id: 0,
            name: '宋 張擇端 清明易簡圖', 
            src: 'http://www.npm.gov.tw/exh96/orientation/images/b41_3.jpg',
            qr: 'img/qr-item-0.png', 
            detail: `本幅題為〈清明易簡圖〉，語出《易經．繫辭》：「易則易知，簡則易從。」即平易簡單之意，作者希望透過畫面，讓觀者對都城繁華勝景一目了然。 
            張擇端（活動於12世紀），字正道，東武人。善畫舟車、市橋、屋宇，作〈清明上河圖〉，現藏北京故宮博物院，後世畫家多摹仿之。此幅略分郊野鄉間、迎親隊伍、虹橋市集、城牆內外、天津之橋等段落。
            山石與樹木的畫法，與原畫差異較大，筆力稚弱，賦彩具裝飾性，空間平面化，應為明代摹本。`, 
        }, 
        {
            id: 1,
            name: '明 仇英 清明上河圖', 
            src: 'http://www.npm.gov.tw/exh96/orientation/images/b41_4.jpg',
            qr: 'img/qr-item-1.png', 
            detail: `本卷有多處與其它版本不同，如戲台演戲、射柳、雜耍特技、走索及校閱等。
            對金明池競渡的描寫細膩，不惟樓閣華美，歇山戧脊上安放脊獸，飛揚誇張，強調宮殿建築的麗富堂皇；活動場面更是熱鬧非凡，有龍池搶標、舞蹈遊藝等。
            重彩設色亦是其它作品所無，幅中大量運用了石青、石綠、朱砂、藤黃、胡粉及紫色等顏料，畫面呈現出濃烈瑰麗的風格，其它如水紋的畫法，圖案化的山石堆疊，組成成奇幻的空間感，推斷出自明代「蘇州片」畫家對仇英風格的刻意追摹。`
        }, 
        {
            id: 2,
            name: '清 院本清明上河圖', 
            src: 'http://www.npm.gov.tw/exh96/orientation/images/b41_1.jpg',
            qr: 'img/qr-item-2.png', 
            detail: `此卷是由清宮畫院畫家陳枚（1694－1745）、孫祜、金昆、戴洪與程志道通力合作完成。
            以人物景致繁多取勝，可謂是集各家所長的作品。
            全作分為鄉野風光、虹橋市集、城門內外及金明池。
            除了熙來攘往的人物，櫛比鱗次的商店，還有逸趣的文人園林、輝麗的皇室苑囿，極力營造熱鬧喧囂的氣氛，堪稱十八世紀城市風貌的縮影。
            建築均依據透視原理，房舍街巷經絡分明，大小比例與遠近距離，莫不精準掌握，且有西式建築列置其中。筆墨精謹與色彩斑爛，是院藏同題作品之最精者。`
        }
    ];
    response.header('Access-Control-Allow-Origin', '*');    // 允許跨網域存取的網域
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 允許跨網域存取的方法
    response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    
    response.json(meseumItems);
});

app.get('/shopItems/all', function(request, response) {
    var shopItems = [
        {
            id: 3415149900017,
            name: '夷曰匜記事夾文具盒', 
            src: 'http://www.npmshops.com/main/uploads/npmshops/PrdImg/3415149900017_b.jpg',
            price: 270 
        }, 
        {
            id: 7500200100140,
            name: '傳統與創新-先秦兩漢動物玉雕', 
            src: 'http://www.npmshops.com/main/uploads/npmshops/PrdImg/7500200100140_b.jpg',
            price: 800 
        }, 
        {
            id: 3403479900869,
            name: '鍾馗公仔 - 金重九首', 
            src: 'http://www.npmshops.com/main/uploads/npmshops/PrdImg/3403479900869_b.jpg',
            price: 380 
        }
    ];
    response.header('Access-Control-Allow-Origin', '*');    // 允許跨網域存取的網域
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 允許跨網域存取的方法
    response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    
    response.json(shopItems);
});

app.get('*', function(request, response) {
    // response.sendFile(__dirname + '/public/index.html');
    response.send('');
});

var port = 8081 || '3000';
var host = process.env.C9_HOSTNAME || process.env.HOSTNAME || 'localhost';

server.listen(port, function() {
   console.log('server is running on', host, port); 
});

// ----------------------------------/ express
