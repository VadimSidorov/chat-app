const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const postRoutes = require('./routes/posts')
const UserRoutes = require('./routes/user')


const app = express();

app.use(bodyParser.json());
app.use("/images", express.static(path.join("images")));

mongoose.connect("mongodb+srv://vadim:" + process.env.MONGO_ATLAS_PW + "@cluster0-mtwkk.mongodb.net/node-angular?retryWrites=true")
  .then(()=>{
    console.log('Connected to the DB')
  })
  .catch(()=>{
    console.log('Fail to connect to the DB')
  })

app.use((req,res,next) => {
  res.setHeader(
    'Access-Control-Allow-Origin', '*'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
})

app.use("/api/posts", postRoutes);
app.use("/api/user", UserRoutes)

module.exports = app;
