const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/off-campus-interview"

// Asynchronus Function
mongoose.connect(url)
.then((result) => {
    console.log('connect to DB');
})

.catch((err) => {
    console.log(err);
});

module.exports = mongoose;