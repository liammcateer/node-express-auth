import {model, Model, Document, Schema} from 'mongoose';
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

export interface IUserDocument extends Document {
    email: string;
    password: string;
}

export interface IUserModel extends Model<IUserDocument> {
    login(email: string, password: string): Promise<IUserDocument>;
}

const userSchema: Schema = new Schema({
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

userSchema.pre<IUserDocument>('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (email: string, password: string): Promise<IUserDocument> {
    const user = await User.findOne({email});
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
    }
    throw "Email or password incorrect";
}

export const User: IUserModel = model<IUserDocument, IUserModel>('user', userSchema);