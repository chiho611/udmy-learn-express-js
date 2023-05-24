const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const path = require("path");
// const expressHbs = require('express-handlebars');
const {get404} = require("./controllers/error");
const {mongooseConnect} = require('./util/database');
const User = require('./models/user');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("646d8f05892cb084c465a1a0")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err)
        })
    // next();
})

// app.engine("hbs", expressHbs({layoutsDir: 'views/layouts', defaultLayout: 'main-layout', extname: 'hbs'}));
// app.set("view engine", 'hbs');
app.set("view engine", 'ejs');
// app.set("view engine", 'pug');
// app.set("views", 'views'); default views folder

app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(get404)

mongooseConnect()
    .then(result => {

        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'alvin',
                    email: 'test@test.com',
                    cart: {items: []}
                })
                user.save();
            }
        })

        app.listen(3000, function () {
            console.log("info", 'Server is running at port : ' + 3000);
        });
    })
    .catch(err => {
        console.log(err)
    })
;
