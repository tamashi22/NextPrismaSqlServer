import prisma from "../../../lib/prisma";
export default async function handler(req, res) {
  const { product_id, raw_material, amount } = req.body;
  const id = req.query.id;
  // DELETE
  if (req.method === "DELETE") {
    await prisma.$queryRaw("EXEC delete_ingredient @id", {
      id,
    });
  }
  // UPDATE
  else if (req.method === "PUT") {
    await prisma.$queryRaw(
      "EXEC update_ingredient @id, @product_id, @raw_material, @amount",
      {
        id,
        product_id,
        raw_material,
        amount,
      }
    );
    res.status(200).json({ message: "updated" });
  } else {
    console.log("could not be modified");
    res.status(400).json({ message: "could not be modified" });
  }
}
