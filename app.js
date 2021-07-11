const express=require('express');
const app=express();
const server = require('http').Server(app);
const mongoose=require('mongoose');
const cors=require("cors");
const dotenv=require('dotenv');
const expressLayouts=require('express-ejs-layouts');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const io = require('socket.io')(server,{
    cors: {
        origin: '*',
        methods: ["GET" ,"POST"]
      }
});
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
debug: true,
});

app.use('/peerjs', peerServer);

dotenv.config();

app.use(cors());

const PORT=process.env.PORT||5000;

//Passport config
require('./config/passport')(passport);

//DB config
const db=require('./config/keys').MongoURI;

//Connect to DB
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log("DB Connected"))
.catch((err)=>console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));

//Bodyparser
app.use(express.urlencoded({extended:false}));

//Express Session
app.use(session({
    secret: 'frag',
    resave: true,
    saveUninitialized: true,
}));

//Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});


//Join room
io.on('connection',socket=>{
    socket.on("join-room",(roomId,userId,user)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected',userId);
        //Disconnect
        socket.on('disconnect',()=>{
            socket.broadcast.emit('user-disconnected',userId);
        })
        //Chat
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message,user);
        });
    })
})

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


server.listen(PORT,()=>console.log(`server is running at port ${PORT}`))