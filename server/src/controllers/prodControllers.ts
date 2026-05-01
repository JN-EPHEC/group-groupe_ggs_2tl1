import type {Request, Response, NextFunction } from 'express'
import prisma from '../config/prisma.js'






//GET all product

export const getAllProduct = async (req:Request, res:Response, next: NextFunction)=>{
    try {
        const product = await prisma.Products.findMany({})
        return  res.status(200).json(product)
    } catch(err){
        next(err)
    }
}


// GET one product

export const getProduct = async (req:Request, res: Response, next: NextFunction) =>{
    try {
        const id = req.params.id
        const product = await prisma.Products.findUnique({
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

// CREATE product

export const createProduct = async (req:Request, res: Response, next: NextFunction) =>{
    try{
    const data = req.body
    if (!data || Object.keys(data).length === 0){
        return res.status(400).json({message : "Erreur lors de la création de produit, body vide"})

    }
     const product = await prisma.Products.create({
        data : data
    });
    return res.status(201).json(product);
    }catch(err){
        next(err)
    }
}

// DELETE product

export const deleteProduct = async (req:Request, res: Response, next:NextFunction) => {
    try{
    const id = req.params.id
    const exists = await prisma.Products.findUnique({where : {id : Number(id)}});
    if (!exists){
        return res.status(404).json({message : "le produit n'existe pas ou plus" })
    }
    const product = await prisma.Products.delete({
        where : {id : Number(id)},
    });
    return res.status(200).json(product)
    } catch(err){
        next(err)
    }

}

// MODIFY parts of the product
export const modifyItemProduct = async (req:Request, res:Response,next :  NextFunction) => {
    try{
      const id = req.params.id
        const exists = await prisma.Products.findUnique({where:{id:Number(id)}});
        if(!exists){
            return res.status(404).json({message : "le produit dont un élément est a modifier n'existe pas " })
        }
        const data = req.body
        if (!data || Object.keys(data).length === 0){
            return res.status(400).json({message : "Le body est vide "})
        }
        const product = await prisma.Products.updateMany({
        where : {id : Number(id)},
        data : data

    })
    return res.status(200).json({message :" le produit a été modifié"})
    } catch(err){
        next(err)
    }
}

// MODIFY all of the product
export const modifyProduct = async (req: Request, res : Response, next : NextFunction)=> {
    try{
        const id = req.params.id
        const exists = await prisma.Products.findUnique({where:{id:Number(id)}});
        if(!exists){
            return res.status(404).json({message : "le produit  a modifier n'existe pas " })
        }
        const data = req.body
        if (!data || Object.keys(data).length === 0){
            return res.status(400).json({message : "Le body est vide "})
        }
        const product = await prisma.Products.updateMany({
            where : {id : Number(id)},
            data : data
        });
        
        return res.status(200).json({message :" l'élément du produit a été modifié"})


    }catch(err){
        next(err)
    }
}



