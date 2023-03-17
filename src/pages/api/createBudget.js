import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    const {
        budget_amount,
        percent       ,
        bonus       ,
    } = req.body
    try {
        console.log(req.body)
        // CREATE
        await prisma.budget.create({
          data: {
            budget_amount :budget_amount,
            percent:percent       ,
            bonus :bonus      , 
          }
        })
        res.status(200).json({ message: 'created' })
      } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
      }
  }