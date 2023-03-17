import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    const {
        name     ,                                                              
        unit     ,                                                              
        amount   ,                                                              
        sum     ,
  } = req.body
    try {
        console.log(req.body)
        // CREATE
        await prisma.raw_material.create({
          data: {
            name ,                                                              
            unit  ,                                                              
            amount ,                                                              
            sum ,
          }
        })
        res.status(200).json({ message: 'product created' })
      } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
      }
  }