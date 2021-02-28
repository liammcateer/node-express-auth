import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {Request, Response} from 'express';
import { configuration } from '../configuration';
import { IJwtToken } from '../interfaces/IJwtToken';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt
    if(token){
        const secret = configuration.jwtSecret;
        jwt.verify(token, secret, (err: any, decodedToken: IJwtToken) => {
            if(err){
                res.redirect('/login');
            } else {
                next();
            }
        });
    }else{
        res.redirect('/login');
    }
}

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt
    if(token){
        const secret = configuration.jwtSecret;
        jwt.verify(token, secret, async (err: any, decodedToken: IJwtToken) => {
            if(err){
                res.locals.user = null;
                next();
            } else {
                const user = await User.findById(decodedToken.userId);
                res.locals.user = user;
                next();
            }
        });
    }else {
        res.locals.user = null;
        next();
    }
}