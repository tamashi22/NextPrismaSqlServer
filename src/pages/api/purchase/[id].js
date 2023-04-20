import prisma from "../../../lib/prisma";
export default async function handler(req, res) {
  const { raw_material, amount, sum, date, employee_id } = req.body;
  const Id = req.query.id;
  // DELETE
  if (req.method === "DELETE") {
    const result = await prisma.purchase_raw_material.delete({
      where: { id: Number(Id) },
    });
    res.json(result);
  }
  // UPDATE
  else if (req.method === "PATCH") {
    const result = await prisma.purchase_raw_material.update({
      where: { id: Number(Id) },
      data: {
        raw_material: raw_material,
        amount: amount,
        sum: sum,
        date: date,
        employee_id: employee_id,
      },
    });
    res.status(200).json({ message: "updated" });
  } else {
    console.log("could not be modified");
    res.status(400).json({ message: "could not be modified" });
  }
}
