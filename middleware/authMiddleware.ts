import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {Request, Response} from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt
    if(token){
        const secret = process.env.JWT_SECRET;
        if(secret){
            jwt.verify(token, secret, (err: any, decodedToken: any) => {
                if(err){
                    res.redirect('/login');
                } else {
                    next();
                }
            });
        } else {
            res.redirect('/login');
        }
    }else{
        console.error('JWT secret missing');
        throw ("Server error");
    }
    
}