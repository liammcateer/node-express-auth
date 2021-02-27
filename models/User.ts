import {model, Model, Document, Schema} from 'mongoose';
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

export interface IUser{
    email: string,
    password: string,
}

export interface IUserDocument extends IUser, Document {
}

export interface IUserModel extends Model<IUserDocument> {
    login(email: string, password: string): Promise<IUserDocument>;
}

const UserSchema = new Schema<IUserDocument, IUserModel>({
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

UserSchema.pre<IUserDocument>('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.statics.login = async function (this: Model<IUserDocument>, email: string, password: string): Promise<IUserDocument> {
    const user = await this.findOne({email});
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
    }
    throw "Email or password incorrect";
}

export default model<IUserDocument, IUserModel>('user', UserSchema);