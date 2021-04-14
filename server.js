// if(process.env.NODE_ENV !== "production"){
//   require('dotenv').config()
// }

const fs = require('fs');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended:false})
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const connectDB = require('./DB/connection')
const User = require('./DB/user')
// const sockettest = require('./DB/socket-test')
// const searchResult = require('./countryprocess')
const mailer = require('./mailverify-config')
const jwt = require('jsonwebtoken')

// searchResult.countrySearch()
connectDB();

const initializePassport = require('./passport-config')
initializePassport(
  passport,
   email => users.find(user => user.email === email))



// Load Node modules
var express = require('express');
const sockettest = require('./DB/socket-test');
// Initialise Express
var app = express();



// Render static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: "^%#BF743haIUH4763&%34/57U[",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});




// Set the view engine to ejs
app.set('view engine', 'ejs');




// Port website will run on
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("App Started on " + port));

app.get('/',checkAuthenticated, async function (req, res) {
  
  let n;
  req.user.then(user => {
    n = user.username;
    console.log(n + " has logged in")
    res.render('pages/index',{ loadedFile: {}, loggedInUser: n});

  })
});

app.get('/reset-password', async function (req, res) {
  let errors = [{msg: null}]


    res.render('pages/reset-password',{ errors});
  // })
});

app.post('/reset-password', async function (req, res) {
  let errors = []
  let email = req.body.email

  User.findOne({ "email": email})
  .then(async user => {
    if(!user) {
      // errors.push({msg: ""})
      console.log("Email not found in database");
    }


    //logic to send email again to user
    const generatedToken = jwt.sign(
      { email: email}, 
      'weouA8973Rf#%$vyg45RVE983H9JT9yIhFREW3l4zzuqqYWd7hZdmAbHiYt', 
      {expiresIn: '30m'})

    //compose email
    const html = `
    <br>
    You have initiated a password reset Request. <br>
    Reset your password by clicking the link below: <br>
    http://localhost:${port}/reset/${generatedToken}`

    let sender = "admin@n-dots.com"
    let subject = "Password Reset"
    await mailer.sendEmail(sender, subject, user.email, html )
 

    errors.push({ msg: "If this is your email (" + email + ") then please find a password reset link in your email"})
  
  res.render('pages/reset-password',{ errors });

})
});


app.get('/newDots',checkAuthenticated, function (req, res) {

  let userLoggedIn, userEmail;
  req.user.then(user => {

    userLoggedIn = user.username
    userEmail = user.email
      res.render('pages/newDots', { loggedInUser : userLoggedIn, nameOfPath : 'newDots'});
  })
});



app.get('/login',checkNotAuthenticated, function (req, res) {
  let errors = [{msg: null}]
      res.render('pages/login', {errors});
});

app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: 'back',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register',checkNotAuthenticated, function (req, res) {
  let errors = [{msg: null}]
      res.render('pages/register', { errors });
});

app.get('/auth/:secretToken', function (req, res) {
  let errors = []
  const verifyToken = req.params.secretToken


  if(!verifyToken) {
    errors[0] = {msg: 'Internal Server Error' }
    console.log('Internal Server Error');
    res.render('pages/flashmessage', { errors })
  }


  jwt.verify(verifyToken, 'weouA8973Rf#%$vyg45RVE983H9JT9yIhFREW3l4zzuqqYWd7hZdmAbHiYt', (err, decoded) =>
  {
    if(err) {

      console.log('Internal Server Error');
      errors[0] = {msg: 'Internal Server Error' }
      res.render('pages/flashmessage', { errors })

    }

    const verifiedEmail = decoded
    User.findOneAndUpdate({ "email": verifiedEmail.email}, {"active": true})
      .then(async user => {
        if(!user) {
          errors[0] = {msg: "Database Error! Please Register Again"}
          console.log('Database Error');
          res.render('pages/flashmessage', { errors })
        }

        console.log("User" + user + " Activated Successfully!");
        errors[0] = { msg : 'Email Verified! You may now Login.' }
        res.render('pages/login', { errors })

        
  })
  //check and validate token with user
  //?fail --> find reason 1.time expiry 2.server issue 
  //?success then redirect to login page, remove secret token and set account flag to true also change passport config to check for user flag if account flag is false.
  })
});


app.get('/reset/:secretToken',  function (req, res) {
  let errors = [{msg:null}]
  const verifyToken = req.params.secretToken


  if(!verifyToken) {
    errors[0] = {msg: 'Internal Server Error' }
    console.log('Internal Server Error');
    res.render('pages/flashmessage', { errors })
  }

  jwt.verify(verifyToken, 'weouA8973Rf#%$vyg45RVE983H9JT9yIhFREW3l4zzuqqYWd7hZdmAbHiYt', (err, decoded) =>
  {
    if(err) {

      console.log('Internal Server Error');
      errors[0] = {msg: 'Internal Server Error' }
      res.render('pages/flashmessage', { errors })

    }

    const verified = decoded
    console.log(verified);

  res.render('pages/reset-password-new', { errors, verified, verifyToken })
  })

});

app.post('/reset/:secretToken', function (req, res) {
  let currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let errors = []
  let {password, password2 } = req.body
  // console.log(req.body);

    //------------ Checking required fields ------------//
    if ( !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    //------------ Checking password length ------------//
    if (password.length < 8) {
      errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
      res.redirect(currentUrl, {
          errors,
          password,
          password2
      });
    }

  const verifyToken = req.params.secretToken
  // console.log(verifyToken);


  jwt.verify(verifyToken, 'weouA8973Rf#%$vyg45RVE983H9JT9yIhFREW3l4zzuqqYWd7hZdmAbHiYt',async (err, decoded) =>
  {
    if(err) {

      console.log('Internal Server Error');
      errors[0] = {msg: 'Internal Server Error' }
      res.render('pages/flashmessage', { errors })

    }

    const verifiedEmail = decoded
    const hashedPassword = await bcrypt.hash(password, 10)
    User.findOneAndUpdate({ "email": verifiedEmail.email}, {"password": hashedPassword, "active": true })
      .then(async user => {
        if(!user) {
          errors[0] = {msg: "Database Error! Please Register Again"}
          console.log('Database Error');
          res.render('pages/flashmessage', { errors })
        }

      console.log(" Password changed Successfully!");
      errors[0] = { msg : 'Password Updated! You may now Login.' }
      res.render('pages/login', { errors })

        
  })

  })
});


var users = []

app.post('/register',checkNotAuthenticated, async (req, res) => {
  try {

    const { name, email, password, password2 } = req.body;
    let errors = [];

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    //------------ Checking required fields ------------//
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    //------------ Checking password length ------------//
    if (password.length < 8) {
      errors.push({ msg: 'Password must be at least 8 characters' });
    }


    if (errors.length > 0) {
      res.render('pages/register', {
          errors,
          name,
          email,
          password,
          password2
      });
      console.log(errors);
  } else {

    let userDetail = {
      id: Date.now().toString(),
      username: name,
      email: email,
      password: hashedPassword,
      active: false
    }

    User.findOne({ "email" : userDetail.email })
    .then(async user => {
      if(user) {

        let e = "Email already registered!"
        // req.flash('msg', e)
        errors.push({ msg : 'Email ID already Registered. Please Login' })

        res.render('pages/register', { errors, name, email, password, password2 })
        console.log(e)
      }
      else {
        console.log('New User Registration')

        // console.log(userDetail)

        //logic to send email with secret token.
        let head = req.protocol + '://' + req.get('host')

        const generatedToken = jwt.sign(
          {name: userDetail.username, email: userDetail.email}, 
          'weouA8973Rf#%$vyg45RVE983H9JT9yIhFREW3l4zzuqqYWd7hZdmAbHiYt', 
          {expiresIn: '30m'})

        //compose email
        const html = `
        <br>
        Thank you for registering. <br>
        Activate your account by clicking on the link below: <br>
        ${head}/auth/${generatedToken}`

        let sender = "admin@n-dots.com"
        let subject = "Verify your Account"
        await mailer.sendEmail(sender, subject, userDetail.email, html )

        errors.push({ msg : 'Registration Success! A link has been sent to your Email.' })

        let userModel = new User(userDetail)
        await userModel.save()

        res.render('pages/login', { errors })
        console.log(userDetail)
      }
    });
    // users.push(user)
  }
    // res.json(userModel)
  } catch(e) {
    console.log(e)
    res.redirect('/register')
  }
})



app.get('/Mydots',checkAuthenticated, function (req, res) {

  let userLoggedIn, userEmail;
  req.user.then(user => {

    userLoggedIn = user.username
    userEmail = user.email
    sockettest.find({ createdBy: userEmail }, (err, data) => {
      if(err) {
        
        console.log(err)
      }

      else {
        console.log("Found Data ")

        let dotNames = [];

        data.forEach(function(points) {
          dotNames.push(points.dotName)
        })
        console.log('Names retrieved! ' + dotNames)

    res.render('pages/Mydots',{userfiles : dotNames, loggedInUser: userLoggedIn});
    }
  })
});
});

app.post('/loadDots/:id',urlencodedparser,checkAuthenticated, function (req, res){  
    // console.log(req);
    console.log('Autosave...');
    let saveRequest = JSON.parse(Object.keys(req.body)[0])
    let userLoggedIn, userEmail;
    req.user.then(user => {

      userLoggedIn = user.username
      userEmail = user.email

      var query = { dotName : req.params.id, createdBy: userEmail }
      console.log(query, saveRequest);

    Dots.findOneAndUpdate(query, { dotName: saveRequest["name"], content: saveRequest['value']} ,  (err, data) => {
      if (err) {
        console.log(err)
      }

      else {
        console.log('Updated Save to DB')
      }
    })
 });
});



app.post('/newDots',urlencodedparser,checkAuthenticated,  async function (req, res){  
    // console.log(req);
    // console.log('Received',JSON.stringify(req.body));
    // let saveRequest = JSON.parse(Object.keys(req.body)[0])
    let saveRequest = req.body
    let dCreatedBy;
    req.user.then(user => {
      dName = user.username;
      dCreatedBy = user.email

    dots = { 
    dotName : saveRequest.name,
    createdBy : dCreatedBy,
    content  : saveRequest.value
    }

    console.log("Dots Model Created..");

    let dotsModel = new sockettest(dots)
    dotsModel.save()

    console.log("Dots pushed to DB...");
    // res.redirect('/loadDots/' + dots.dotName );
    console.log(dots)

    let goTo = '/loadDots/' + dots.dotName;
    // res.redirect('/team');
    res.redirect(goTo);


  })
 
 });
 

  app.get('/loadDots/:id',checkAuthenticated, function (req, res) {
    let userLoggedIn, userEmail;
    req.user.then(user => {

      userLoggedIn = user.username
      userEmail = user.email

      var query = { "dotName" : req.params.id, "createdBy": userEmail }
      console.log(query);
    sockettest.findOne(query, (err, data) => {
      if (err) {
        console.log(err)
      }

      else {

        console.log('File ' + data.dotName + "Found with content " + data.content + " and Now loading!")
        let dotContent = data.content

    res.render('pages/index',{ nameOfFile : data.dotName, nameOfPath: 'loadDots', loadedFile : dotContent, loggedInUser: userLoggedIn });

  }
})
    })

  });






  app.get('/loadDots/:id/3d',checkAuthenticated, function (req, res) {
    let userLoggedIn, userEmail;
    req.user.then(user => {

      userLoggedIn = user.username
      userEmail = user.email
    sockettest.findOne({ dotName : req.params.id }, (err, data) => {
      if (err) {
        console.log("Error Found " + err)
      }

      else {
        // data = searchResult.countrySearch(req.params.country)


        console.log('Switching to 3D with '+ data.content)
        let dotContent = data.content



  // fs.readFile("./" + directory_name + "/" + req.params.id,function(err, result) {
  //   if(err) console.log('error', err);
  //   let reqfile = result
    res.render('pages/3d',{ nameOfFile : data.dotName,loadedFile : dotContent, loggedInUser: userLoggedIn });

  }
})
    })

  });


  app.delete('/logout', (req,res) => {
    req.logOut()
    res.redirect('/login')
  })

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }




