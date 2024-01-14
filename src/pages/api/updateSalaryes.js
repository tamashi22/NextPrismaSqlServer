import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const {
    employee_id,
    sale_counts,
    purchase_counts,
    production_counts,
    allActivity_counts,
    year,
    month,
    amount,
    is_paid,
  } = req.body;
  try {
    // update many
    await prisma.salary.updateMany({
      where: { employee_id: employee_id, year: year, month: month },
      data: {
        year: year,
        month: month,
        employee_id: employee_id,
        sale_counts: sale_counts,
        purchase_counts: purchase_counts,
        production_counts: production_counts,
        allActivity_counts: sale_counts + purchase_counts + production_counts,
        amount: amount,
        is_paid: is_paid,
      },
    });
    res.status(200).json({ message: "Salaries updated" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}
