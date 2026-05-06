import type {Request, Response, NextFunction } from 'express'
import prisma from '../config/prisma.js'






//GET all product

export const getAllProduct = async (req:Request, res:Response, next: NextFunction)=>{
    try {
        const product = await prisma.products.findMany({})
        return  res.status(200).json(product)
    } catch(err){
        next(err)
    }
}


// GET one product

export const getProduct = async (req:Request, res: Response, next: NextFunction) =>{
    try {
        const id = req.params.id
        const product = await prisma.products.findUnique({
            where :{ id : Number(id)  }

        })
        if (!product){
          return  res.status(404).json({message :"le produit n'existe pas ou n'est plus disponible"})
        }
        return res.status(200).json(product)
    } catch(err){
        next(err)
    }
}





