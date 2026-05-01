import type {Response, Request, NextFunction} from 'express'
import prisma from '../config/prisma.js'



// GET /orders
export const getOrder = async (req:Request, res: Response, next: NextFunction) =>{
    try{
        const orders = await prisma.Orders.findMany({})
        return  res.status(200).json(orders)
    }catch(err){next(err)}

   
}

// Get /orders/id

export const getOneOrder = async (req:Request,res:Response, next: NextFunction) =>{
    try{
        const id = req.params.id;
        const exists = await prisma.Orders.findUnique({where:{id:Number(id)}});
        if(!exists){return res.status(400).json({message : `L'order avec  l'ID : ${id} n'existe pas`})};
        const oneOrder = await prisma.Orders.findUnique({where : {id : Number(id)}});
        return res.status(200).json(oneOrder)
    }catch(err){next(err)}
}


// POST

export const createOrder = async (req:Request, res : Response, next: NextFunction) =>{
    try{
    const data = req.body
    if(!data || Object.keys(data).length === 0 ){
        return res.status(404).json({message: `le body est vide`})}
    const newOrder = await prisma.Orders.create({data:data})
    return res.status(201).json(newOrder)
    }catch(err){next(err)}
}

