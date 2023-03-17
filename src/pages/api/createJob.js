import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    const {job_title} = req.body
    try {
        // CREATE
        await prisma.Job_title.create({
          data: {
            job_title
          }
        })
        res.status(200).json({ message: 'Job created' })
      } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
      }
  }