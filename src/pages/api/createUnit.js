import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    const {name} = req.body
    try {
        // CREATE
        await prisma.Unit.create({
          data: {
            name
          }
        })
        res.status(200).json({ message: 'Job created' })
      } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
      }
  }