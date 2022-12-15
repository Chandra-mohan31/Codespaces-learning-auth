const mongoose = require("mongoose");

const {MONGO_DB_URL} = process.env

exports.connect = () =>{
    mongoose.connect(MONGO_DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
            .then( console.log(`DB connected successfully`))
            .catch((err)=>{
                console.log(`db connection failed`);
                console.log(err);
                process.exit(0);
            })
}