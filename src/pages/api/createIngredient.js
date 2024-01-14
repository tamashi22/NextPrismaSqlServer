import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { product_id, raw_material, amount } = req.body;

  try {
    await prisma.$queryRaw("EXEC insert_Ingredient @product_id, @raw_material, @amount", {
      product_id,
      raw_material,
      amount,
    });

    res.status(200).json({ message: "Ingredient inserted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error inserting ingredient" });
  }
}
