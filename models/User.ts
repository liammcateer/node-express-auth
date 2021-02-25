import {model, Model, Document, Schema} from 'mongoose';
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

export interface IUser extends Document {
    email: string;
    password: string;
}

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Please enter an email address"],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Password must be 8 characters long']
    }
});

userSchema.pre<IUser>('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const User = model<IUser>('user', userSchema);