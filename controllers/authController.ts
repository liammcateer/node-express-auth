import User from '../models/User'
import {Request, Response} from 'express';
import mongoose from 'mongoose';
import mongodb from 'mongodb';
import jwt from 'jsonwebtoken';
import { configuration } from '../configuration';

const jwtExpireTime = 3 * 24 * 60 * 60;

export const register_post = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const user = await User.create({email, password});
        const jwtToken = generateJwtToken(user._id);
        res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: jwtExpireTime * 1000 })
        res.sendStatus(201);
    } catch (err) {
        res.status(400).json(handleValidationError(err))
    }
}

export const register_get = (req: Request, res: Response) => {
    res.render('register');
}

export const login_get = (req: Request, res: Response) => {
    res.render('login');
}

export const login_post = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        const jwtToken = generateJwtToken(user._id);
        res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: jwtExpireTime * 1000 })
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
}

export const logout_get = async (req: Request, res: Response) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/');
}

function generateJwtToken(userId: string): string {
    return jwt.sign({ userId }, configuration.jwtSecret, {
        expiresIn:  jwtExpireTime,
    });
    
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
        const emailError = err.errors['email']?.message;
        const passwordError = err.errors['password']?.message;
        error.email = emailError ? emailError : '';
        error.password = passwordError ? passwordError: '';
    }

    return error;
}