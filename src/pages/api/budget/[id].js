import prisma from "../../../lib/prisma";
export default async function handler(req, res) {
    const {
        budget_amount,
        percent       ,
        bonus       , 
    } = req.body
    const Id = req.query.id
     // DELETE
     if (req.method === 'DELETE') {
        const result = await prisma.budget.delete({
            where: { id: Number(Id) }
        })
        res.json(result)
    } 
    // UPDATE
    else if (req.method === 'PATCH') {
      const result = await prisma.budget.update({
        where: { id: Number(Id) },
        data: {
            budget_amount:budget_amount,
        percent :percent     ,
        bonus:bonus       ,
        }
      })
      res.status(200).json({ message: 'updated' })
    } 
    else {
        console.log("could not be modified")
        res.status(400).json({ message: "could not be modified" })
    }
  } 