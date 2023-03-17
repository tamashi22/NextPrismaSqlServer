import prisma from "../../../lib/prisma";
export default async function handler(req, res) {
    const {
        name,
        unit,
      amount,
        sum ,
    } = req.body
    const Id = req.query.id
     // DELETE
     if (req.method === 'DELETE') {
        const result = await prisma.raw_material.delete({
            where: { id: Number(Id) }
        })
        res.json(result)
    } 
    // UPDATE
    else if (req.method === 'PATCH') {
      const result = await prisma.raw_material.update({
        where: { id: Number(Id) },
        data: {
            name :name,
            unit:unit,
          amount:amount,
            sum:sum ,
        }
      })
      res.status(200).json({ message: ' updated' })
    } 
    else {
        console.log("could not be modified")
        res.status(400).json({ message: "could not be modified" })
    }
  } 