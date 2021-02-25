import { User } from '../models/User'
import {Request, Response} from 'express';
import mongoose from 'mongoose';
import mongodb from 'mongodb';

module.exports.register_post = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const user = await User.create({email, password});
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json(handleValidationError(err))
    }
}

interface UserValidationError {
    email: string,
    password: string,
}

function handleValidationError(err: mongoose.Error): UserValidationError {
    const error: UserValidationError = {email: '', password: ''};
    if(err instanceof mongodb.MongoError && err.code === 11000){
        error.email = "That email already exists";
    }else if (err instanceof mongoose.Error.ValidationError){
        error.email = err.errors['email'].message
        error.password = err.errors['password'].message
    }

    return error;
}