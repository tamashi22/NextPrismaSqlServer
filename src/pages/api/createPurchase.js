import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    const {
        raw_material   ,                                              
        amount         ,                                             
        sum            ,                                               
        date           ,                                               
        employee_id   ,
  } = req.body
    try {
        console.log(req.body)
        // CREATE
        await prisma.purchase_raw_material.create({
          data: {
            raw_material   ,                                              
            amount         ,                                             
            sum            ,                                               
            date           ,                                               
            employee_id   ,
          }
        })
        res.status(200).json({ message: 'created' })
      } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
      }
  }