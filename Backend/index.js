const express = require('express');
const server = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const productroter = require('./Routes/Product');
const categoryrouter = require('./Routes/Categories')
const brandsrouter = require('./Routes/Brand')
const usersRouter = require('./Routes/User')
const authRouter = require('./Routes/Auth')
const cartrouter = require('./Routes/Cart')
const orderrouter = require('./Routes/Order')
const passport = require('passport');
const localstratergy = require('./passport');
const stripechekout = require('./Routes/Stripe')


server.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    next();
});

server.use(express.json({ limit: '5mb' })); // or more if needed
server.use(express.urlencoded({ extended: true, limit: '5mb' }));

server.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders:['X-Total-Count']
}))
server.use(express.json());
server.use('/product' , productroter )
server.use('/category' , categoryrouter)
server.use('/brands' , brandsrouter)
server.use('/users',  usersRouter)
server.use('/auth', authRouter)
server.use('/cart', cartrouter)
server.use('/order', orderrouter)
server.use('/api/stripe', stripechekout);




main().catch(err =>  console.log(err))

localstratergy();
server.use(passport.initialize());

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('database connected')
  }


  server.listen(8080, () => {
    console.log('server started')
  })