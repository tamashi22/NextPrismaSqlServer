import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    const {
        product_id  ,
            amount     ,
            Date        ,
            employee_id ,
  } = req.body
    try {
        console.log(req.body)
        // CREATE
        await prisma.production.create({
          data: {
            product_id  ,
            amount     ,
            Date        ,
            employee_id ,
          }
        })
        res.status(200).json({ message: 'product created' })
      } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
      }
  }