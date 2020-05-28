const
    express     = require('express'),
    path        = require('path'),
    bodyParser  = require("body-parser"),
    router      = express.Router(),
    sqlite3     = require('sqlite3').verbose(),
    urlencodedParser = bodyParser.urlencoded({extended: false});

let body;
router.post("/", urlencodedParser, function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    const db = new sqlite3.Database(path.resolve(__dirname, '../db/database.sqlite3'), (err) => {
        if (err) console.error(err.massage);
    });
    db.serialize(() => {
        db.exec(`INSERT INTO orders (name,email,place,date,hall,dishes,notification)
        VALUES ('${req.body.name}','${req.body.email}','${req.body.place}','${req.body.date}', 
        '${req.body.hall}','${req.body.dish}', '${req.body.notification}');`, (err, row) => {
            if (err) console.error(err.message);
        });
    });
    db.close((err) => {
        if (err) console.error(err.message);
        next();
    });
    body = req.body;
    console.log(req.body);
});
router.post("/", function (req, res, next) {
    res.render('order', {
        title: 'Заказ произведён успешно!',
        body: body || req.body,
    });
});

module.exports = router;
