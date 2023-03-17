import prisma from "../../../lib/prisma";
export default async function handler(req, res) {
    const {name} = req.body
    const Id = req.query.id
     // DELETE
     if (req.method === 'DELETE') {
        const job = await prisma.Unit.delete({
            where: { id: Number(Id) }
        })
        res.json(job)
    } 
    // UPDATE
    else if (req.method === 'PUT') {
      const job = await prisma.Unit.update({
        where: { id: Number(Id) },
        data: {
          name
        }
      })
      res.status(200).json({ message: 'updated' })
    } 
    else {
        console.log("could not be modified")
        res.status(400).json({ message: "could not be modified" })
    }
  } 