import type {Request,Response,NextFunction} from 'express'
import prisma from '../config/prisma'



// GET ALL catégories

export const getAllCat = async ( req:Request,res:Response, next:NextFunction)=> {
    try{
        const categorie = await prisma.categories.findMany({})
        return res.status(200).json(categorie)
    }catch(err){next(err)}
}
//GET ONE catégorie
export const getOneCat = async ( req: Request,res: Response, next: NextFunction) =>{
    try{
        const id = req.params.id;
        const categorie = await prisma.categories.findUnique({where:{id:Number(id)}});
        if (!categorie){
            return res.status(404).json({message : `La catégorie portant l'id:${id} n'existe pas`})};
        return res.status(200).json(categorie)
    }catch(err){next(err)}
}
