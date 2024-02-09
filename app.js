const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));



app.get('/login', (req, res) => {

    if (req.session.username) {
        // res.render('/hmapge', { username: req.session.username });
        res.redirect('/hmpage')
    } else {
        const errorMessage = req.query.error || '';
        
    res.render('login' , { errorMessage });
    }
   
   
});

app.get('/', (req, res) => {
    if (req.session.username) {
        res.render('/hmpage', { username: req.session.username });
    } else {
        res.redirect('/login');
    }
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'adi' && password === 'viv') {
        req.session.username = username;
       
        res.cookie('sessionId', req.session.id);
        res.redirect('/hmpage');
    } else {
        const errorMessage = 'Invalid username or password';
        res.redirect('/login?error=' + encodeURIComponent(errorMessage));
    }
});

app.get('/hmpage', (req, res,next) => {
    if (req.session.username) {
        res.render('hmpage', { username: req.session.username });
    } else {
        res.redirect('/login'); 
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('sessionId');
        res.redirect('/login');
    });
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
