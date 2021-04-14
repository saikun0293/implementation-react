const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const URI = "mongodb+srv://test-user:test-user@dotstest1.pru1y.mongodb.net/database?retryWrites=true&w=majority"

const connectDB = async () => {
    try {

    
    await mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log('DB Connected!')
    } catch(e) {
        console.log(e)
    }
}

module.exports = connectDB;