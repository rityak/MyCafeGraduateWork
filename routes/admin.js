const
    express             = require('express'),
    router              = express.Router(),
    bodyParser          = require("body-parser"),
    path                = require("path"),
    sqlite3             = require('sqlite3').verbose(),
    urlencodedParser    = bodyParser.urlencoded({extended: false});

let users = [];
router.get('/', urlencodedParser, function(req, res, next) {
    res.render('admin', {
        title: "Login to admin panel",
        body: req.body,
        author: {},
    });
});
router.post('/', urlencodedParser, function (req, res, next) {
    const db = new sqlite3.Database(path.resolve(__dirname, '../db/database.sqlite3'), (err) => {
        if (err) console.error(err.massage);
    });
    db.serialize(() => {
        db.each(`SELECT id, username, password, isAdmin FROM users;`, (err, row) => {
            if (err) console.error(err.message);
            users.push(row);
        });
    });
    db.close((err) => {
        if (err) console.error(err.message);
        next();
    });
});
router.post('/', urlencodedParser, function(req, res, next) {
    let login = false;
    let isAdmin = undefined;
    users.forEach((item, i) => {
        if (item.username === req.body.username && item.password === req.body.password) {
            login = true;
            isAdmin = false;
            if (item.isAdmin === "true") {
                isAdmin = true;
            }
        }
    });
    if (login && isAdmin) {
        const halls = [];
        const dishes = [];
        const orders = [];
        const db = new sqlite3.Database(path.resolve(__dirname, '../db/database.sqlite3'), (err) => {
            if (err) console.error(err.massage);
        });
        /* HALLS */
        db.serialize(() => {
            db.each(`SELECT id, title, body, images, old__price, new__price FROM hall;`, (err, row) => {
                if (err) console.error(err.message);
                halls.push(row);
            });
        });
        /* DISHES */
        db.serialize(() => {
            db.each(`SELECT id, title, image, price, type FROM dish;`, (err, row) => {
                if (err) console.error(err.message);
                dishes.push(row);
            });
        });
        /* ORDERS */
        db.serialize(() => {
            db.each(`SELECT id, name, email, place, date, notification, hall, dishes FROM orders;`, (err, row) => {
                if (err) console.error(err.message);
                orders.push(row);
            });
        });
        db.close((err) => {
            if (err) console.error(err.message);
            initRenderPage (halls, dishes, orders);
        });
    } else {
        initRenderPage ();
    }
    function initRenderPage (halls, dishes, orders) {
        const props = {
            title: "Admin panel",
            body: req.body,
            author: {
                error: !login,
                admin: isAdmin
            },
        };

        if (halls   ) props.halls    = halls;
        if (dishes  ) props.dishes   = dishes;
        if (orders  ) props.orders   = orders;
        res.render('admin', props);
    }
});

router.post('/hall/', urlencodedParser, function (req, res, next) {
    const hall = req.body;
    const db = new sqlite3.Database(path.resolve(__dirname, '../db/database.sqlite3'), (err) => {
        if (err) console.error(err.massage);
    });
    db.serialize(() => {
        if (hall.title && hall.body && hall.old && hall.new){
            let SQL = `UPDATE hall SET
                 title = '${hall.title}',
                 body = '${hall.body}',
                 old__price = '${hall.old}',
                 new__price = '${hall.new}'
                 WHERE id = '${(hall.id).toString()}';`;
            db.exec(SQL, (err) => {
                if (err) console.error(err.message);
            });
        }
    });
    db.close((err) => {
        if (err) console.error(err.message);
    });
});

router.post('/dishes/', urlencodedParser, function (req, res, next) {
    const dishes = req.body;
    const { id, title, price } = dishes;

    const db = new sqlite3.Database(path.resolve(__dirname, '../db/database.sqlite3'), (err) => {
        if (err) console.error(err.massage);
    });
    try {
        db.serialize(() => {
            if (id && title && price){
                for (let [i, item] of id.entries()) {
                    let SQL = `UPDATE dish SET title = ${title[i]}, price = ${price[i]} WHERE id = ${item};`;
                    db.exec(SQL, (err) => {
                        if (err) console.error(err.message);
                    });
                    console.log(SQL);
                }
            }
        });
    } catch (e) {
        console.log(e);
    }

    db.close((err) => {
        if (err) console.error(err.message);
    });
});

module.exports = router;
