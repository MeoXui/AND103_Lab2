const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const local = 'mongodb+srv://huynkph38086:huynkph38086@cluster0.g7bpwz7.mongodb.net/NewDB'
const atlat = 'mongodb+srv://huynkph38086:huynkph38086@cluster0.g7bpwz7.mongodb.net/?retryWrites=true&w=majority'

const connect = async () => {
    try {
        await mongoose.connect(local, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Ket noi thang cong')
    } catch (error) {
        console.log(error)
        console.log('Ket noi that bai')
    }
}
module.exports = { connect }