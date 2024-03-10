import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required: true,
    },
}, {timestamps: true});

// Match suer entered passowrd to hash passowrd in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcryptjs.compareSync(enteredPassword, this.password);
}

// Encrypted password using bcryptjs
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hashSync(this.password, salt);
});

const User = mongoose.model('userSchema', userSchema);
export default User;
