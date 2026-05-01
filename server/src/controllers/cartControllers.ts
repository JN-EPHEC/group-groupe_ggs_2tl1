import type {Response, Request, NextFunction} from 'express'
import prisma from '../config/prisma'


// GET panier

export const getCart = async ( req:Request,res: Response, next:NextFunction) =>{
    try{
        const cart = await prisma.OrderProduct.findMany({})
        res.status(200).json(cart)

    }catch(err){next(err)}

}

// ADD panier

export const addItems = async ( req:Request,res: Response, next:NextFunction) =>{
    try{
        

    }catch(err){next(err)}

}
// PATCH panier

export const modifyItem = async ( req:Request,res: Response, next:NextFunction) =>{
    try{

    }catch(err){next(err)}

}
// DELETE ONE ITEM panier

export const deleteItem = async ( req:Request,res: Response, next:NextFunction) =>{
    try{

    }catch(err){next(err)}

}
// DELETE ALL panier

export const deleteCart = async ( req:Request,res: Response, next:NextFunction) =>{
    try{

    }catch(err){next(err)}

}