const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        // default: "Anonymous"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid!')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: [6, 'You should enter at least length 6'],
        // maxlength: 12,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("You shouldn't use this as password!")
            }
        },
        required: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 18) {
                throw new Error('Your age is not allowed!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true,
        }
    }]
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, 'thisismypassword')
    // console.log(token)
    user.tokens = user.tokens.concat({token})
    // console.count('running')
    await user.save()
    // console.count('running')
    return token;
}
    // the methods keyword we use when we try to access the method of instance of model object

userSchema.statics.findByCredentials = async (email, password) => {
    // statics keyword is used when we using the functution from the model of mongoose object
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Unable to login!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('Unable to login!');
    }

    return user
    
}

userSchema.pre('save', async function (next) {

    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();

})

const User = new mongoose.model('User', userSchema)

module.exports = User;