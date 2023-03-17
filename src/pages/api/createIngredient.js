import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    const {
        product_id   ,
        raw_material ,                                       
        amount ,
    } = req.body
    try {
        console.log(req.body)
        // CREATE
        await prisma.ingredients.create({
          data: {
            product_id   ,
        raw_material ,                                       
        amount , 
          }
        })
        res.status(200).json({ message: ' created' })
      } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
      }
  }