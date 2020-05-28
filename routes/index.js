const
    path    = require('path'),
    express = require('express'),
    router  = express.Router(),
    sqlite3 = require('sqlite3').verbose();
let halls   = [], dishes = [], contacts = [];

/* GET Next Month */
function getMonth () {
    return (["января", "февраля", "марта", "апреля", "мая", "июня","июля", "августа",
            "сентября", "октября", "ноября", "декабря"][(
                (( new Date().getMonth() + 1 ) > 11)
                    ? 0
                    : new Date().getMonth() + 1
            )]);
}


/* Database connecting */
router.use('/', function (req, res, next) {
    halls = [];
    dishes = [];
    contacts = [];
    const db = new sqlite3.Database(path.resolve(__dirname, '../db/database.sqlite3'), (err) => {
        if (err) console.error(err.massage);
    });
    db.serialize(() => {
        db.each(`SELECT id, title, body, images, old__price, new__price FROM hall;`, (err, row) => {
            if (err) console.error(err.message);
            halls.push(row);
        });
        db.each(`SELECT id, title, image, price, type FROM dish;`, (err, row) => {
            if (err) console.error(err.message);
            dishes.push(row);
        });
        db.each(`SELECT id, contact FROM contacts;`, (err, row) => {
            if (err) console.error(err.message);
            contacts.push(row);
        });
    });
    db.close((err) => {
        if (err) console.error(err.message);
        next();
    });
});

/* Homepage render  */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'MyCafe',
        halls: halls,
        dishes: dishes,
        contacts: contacts,
        month: getMonth()
    });
});

module.exports = router;