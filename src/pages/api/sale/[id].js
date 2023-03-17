import prisma from "../../../lib/prisma";
export default async function handler(req, res) {
    const {
        product_id ,    
        amount ,         
        sum   ,          
        Date  ,          
        employee_id , 
    } = req.body
    const Id = req.query.id
     // DELETE
     if (req.method === 'DELETE') {
        const result = await prisma.sale_of_products.delete({
            where: { id: Number(Id) }
        })
        res.json(result)
    } 
    // UPDATE
    else if (req.method === 'PATCH') {    
      const result = await prisma.sale_of_products.update({
        where: { id: Number(Id) },
        data: {
            product_id :product_id,    
            amount:amount ,         
            sum:sum  ,          
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