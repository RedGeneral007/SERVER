const mongoose = require('mongoose');

function connect () {

    return mongoose.connect(
        `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPWD}@rggfp.mcmqz.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    )
}

module.exports = {connect};