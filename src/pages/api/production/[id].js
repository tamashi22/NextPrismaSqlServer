import prisma from "../../../lib/prisma";
export default async function handler(req, res) {
    const {
        product_id ,    
        amount ,         
                  
        Date  ,          
        employee_id , 
    } = req.body
    const Id = req.query.id
     // DELETE
     if (req.method === 'DELETE') {
        const result = await prisma.production.delete({
            where: { id: Number(Id) }
        })
        res.json(result)
    } 
    // UPDATE
    else if (req.method === 'PATCH') {    
      const result = await prisma.production.update({
        where: { id: Number(Id) },
        data: {
            product_id :product_id,    
            amount:amount ,         
                   
            Date:Date  ,          
            employee_id :employee_id, 
        }
      })
      res.status(200).json({ message: 'updated' })
    } 
    else {
        console.log("could not be modified")
        res.status(400).json({ message: "could not be modified" })
    }
  } 