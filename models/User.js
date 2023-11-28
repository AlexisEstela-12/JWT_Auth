const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minLength: [6, 'Minimun password length is 6 characters'],
    },
})

// fire a function after doc saved to db

// userSchema.post('save', function(doc,next) {
//     console.log('new user was created & saved', doc)
//     next() // esta parte es necesaria porque sino el llamado se va mantener en espera

// })

//fire a fucntion before doc saved to db

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)  //this hace referencia al objeto o usuario que se esta intentando crear
    next()
})

// static method to login user

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if (user){
        const auth =  await bcrypt.compare(password, user.password)
        if (auth){
            return user
        }
        throw Error('Incorrect password')
    }
    throw Error('Incorrect email')
}

const User= mongoose.model('user',userSchema)
module.exports = User