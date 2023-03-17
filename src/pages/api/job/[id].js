import prisma from "../../../lib/prisma";
export default async function handler(req, res) {
    const {job_title} = req.body
    const Id = req.query.id
     // DELETE
     if (req.method === 'DELETE') {
        const job = await prisma.Job_title.delete({
            where: { id: Number(Id) }
        })
        res.json(job)
    } 
    // UPDATE
    else if (req.method === 'PUT') {
      const job = await prisma.Job_title.update({
        where: { id: Number(Id) },
        data: {
          job_title
        }
      })
      res.status(200).json({ message: 'job updated' })
    } 
    else {
        console.log("job could not be modified")
        res.status(400).json({ message: "job could not be modified" })
    }
  } 