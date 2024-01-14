import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { employee_id, sale_counts, purchase_counts, production_counts, allActivity_count, year, month, amount, is_paid } = req.body;
  const Id = req.query.id;

  // DELETE
  if (req.method === "DELETE") {
    const result = await prisma.salary.delete({
      where: { id: Number(Id) },
    });
    res.json(result);
  }
  // UPDATE
  else if (req.method === "PATCH") {
    const result = await prisma.salary.update({
      where: { id: Number(Id),employee_id: employee_id, year: year, month: month },
      data: {
        employee_id: employee_id,
        sale_counts: sale_counts,
        purchase_counts: purchase_counts,
        production_counts: production_counts,
        allActivity_count: sale_counts+purchase_counts+production_counts,
        amount: amount,
        is_paid: is_paid,   
      },
    });
    res.status(200).json({ message: "updated" });
  } else {
    console.log("Could not be modified");
    res.status(400).json({ message: "Could not be modified" });
  }
}
