import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    const {
        full_name,         
        job_title ,           
        selery ,              
        adress,             
        phone_number  
    } = req.body
    try {
        console.log(req.body)
        // CREATE
        await prisma.employee.create({
          data: {
            full_name,         
            job_title ,           
            selery ,              
            adress,             
            phone_number  
          }
        })
        res.status(200).json({ message: 'employee created' })
      } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
      }
  }