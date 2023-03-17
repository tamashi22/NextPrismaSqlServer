import prisma from "../../../lib/prisma";
export default async function handler(req, res) {
    const {
        full_name,         
        job_title ,           
        selery ,              
        adress,             
        phone_number 
    } = req.body
    const Id = req.query.id
     // DELETE
     if (req.method === 'DELETE') {
        const result = await prisma.employee.delete({
            where: { id: Number(Id) }
        })
        res.json(result)
    } 
    // UPDATE
    else if (req.method === 'PATCH') {
      const result = await prisma.employee.update({
        where: { id: Number(Id) },
        data: {
           full_name: full_name,
          job_title: job_title,
          selery: selery,
          adress: adress,
          phone_number: phone_number,
        }
      })
      res.status(200).json({ message: 'job updated' })
    } 
    else {
        console.log("job could not be modified")
        res.status(400).json({ message: "job could not be modified" })
    }
  } 