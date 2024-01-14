import React from "react";
import prisma from "../lib/prisma";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import del from "../img/del.png";
export const getServerSideProps = async () => {
  const res = await prisma.employee.findMany();
  const employee = JSON.parse(JSON.stringify(res));
  const s = await prisma.salary.findMany();
  const salary = JSON.parse(JSON.stringify(s));
  const b = await prisma.budget.findMany();
  const budget = JSON.parse(JSON.stringify(b));

  return {
    props: { employee, budget, salary },
  };
};
function salaryes({ employee, budget, salary }) {
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [filteredSalary, setFilterSalay] = useState();
  const [form, setForm] = useState({});
  const [up, setUp] = useState({});
  const [total, setTotal] = useState();
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    const filteredSalaries = salary.filter(
      (salary) => salary.year === year && salary.month === month
     
    );
    const updatedSalaries = filteredSalaries.map((s) => {
      const matchingEmployee = employee.find((e) => e.id === s.employee_id);
      if (matchingEmployee) {
        const newAmount =
          s.allActivity_counts === 0
            ? matchingEmployee.selery
            : matchingEmployee.selery +
              (matchingEmployee.selery *
                (budget[0].bonus * s.allActivity_counts)) /
                100;
        return {
          ...s,
          amount: s.amount > 0 ? s.amount : newAmount,
        };
      }
      return s;
    });
    const totalAmount = updatedSalaries.reduce((sum, s) => sum + s.amount, 0);
    setTotal(totalAmount);
    setFilterSalay(updatedSalaries);
    refreshData()
  }, [year, month]);

  const handleInputChange = (itemId, fieldName, value) => {
    setFilterSalay((prevData) => {
      return prevData.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            [fieldName]: value,
          };
        }
        return item;
      });
    });
  };
  async function handlePay() {
    if (budget[0].amount > total) {
      const updatedData = filteredSalary.map((obj) => ({
        ...obj,
        is_paid: true, // Update field value
      }));
      console.log(updatedData);
      try {
        const response = await fetch("/api/updateSalaryes", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }).then(() => {
          fetch(`api/budget/${1}`, {
            body: JSON.stringify({
              amount: budget[0].budget_amount - total,
            }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
          });
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData); // Message from the server
          // Perform any additional actions after updating salaries
        } else {
          console.log("Error:", response.statusText);
        }
      } catch (error) {
        console.log("Error:", error.message);
      }
    } else {
      alert("Not Enough budget");
    }
  }

  return (
    <div className="main">
      <div className="header">
        <h1>Salaries</h1>
        <label for="year">Choose year: </label>
        <select
          id="year"
          className="input"
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>

        <label for="month">Choose month: </label>
        <select
          id="month"
          className="input"
          onChange={(e) => setMonth(parseInt(e.target.value))}
        >
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        <button className="btn1" type="button" onClick={handlePay}>
          pay Salaries
        </button>

        <div className="colums">
          <p className="label">id</p>
          <p className="label">employee</p>
          <p className="label">salary</p>
          <p className="label">purchase_counts</p>
          <p className="label">sale_counts</p>
          <p className="label">production_counts</p>
          <p className="label">allActivity_count</p>
          <p className="label">amount</p>
          <p className="label">is_paid</p>
        </div>
      </div>
      <div>
        {filteredSalary &&
          filteredSalary.map((a) => {
            return (
              <form>
                <div className="colums">
                  <input
                    className="input"
                    defaultValue={a.id}
                    type="text"
                    disabled
                  />

                  <select className="input" disabled>
                    {employee
                      .filter((j) => j.id == a.employee_id)
                      .map((j) => {
                        return (
                          <option defaultValue={j.id} selected>
                            {j.full_name}
                          </option>
                        );
                      })}
                  </select>

                  {employee
                    .filter((j) => j.id == a.employee_id)
                    .map((j) => {
                      return (
                        <input
                          defaultValue={j.selery}
                          className="input"
                          disabled={a.is_paid && true}
                        />
                      );
                    })}
                  <input
                    className="input"
                    defaultValue={a.purchase_counts}
                    type="text"
                    disabled={a.is_paid && true}
                    onChange={(e) =>
                      handleInputChange(
                        a.id,
                        "a.purchase_counts",
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <input
                    className="input"
                    defaultValue={a.sale_counts}
                    type="text"
                    disabled={a.is_paid && true}
                    onChange={(e) =>
                      handleInputChange(
                        a.id,
                        "a.sale_counts",
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <input
                    className="input"
                    defaultValue={a.production_counts}
                    type="text"
                    disabled={a.is_paid && true}
                    onChange={(e) =>
                      handleInputChange(
                        a.id,
                        "a.production_counts",
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <input
                    className="input"
                    defaultValue={a.allActivity_counts}
                    type="text"
                    disabled={a.is_paid && true}
                    onChange={(e) =>
                      handleInputChange(
                        a.id,
                        "allActivity_counts",
                        parseInt(e.target.value)
                      )
                    }
                  />

                  <input
                    className="input"
                    defaultValue={a.amount}
                    type="text"
                    disabled={a.is_paid && true}
                    onChange={(e) =>
                      handleInputChange(
                        a.id,
                        "amount",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <input
                    className="input"
                    defaultValue={a.is_paid}
                    type="text"
                    disabled={a.is_paid && true}
                    onChange={(e) =>
                      handleInputChange(
                        a.id,
                        "is_paid",
                        parseInt(e.target.value)
                      )
                    }
                  />
                  {/* 
                  <button className="btn1" type="submit">
                    update
                  </button>
                  <button className="delBtn" onClick={() => handleDelete(a.id)}>
                    <Image src={del} alt="del" width={20} height={20} />
                  </button> */}
                </div>
              </form>
            );
          })}
      </div>
      <h2 className="total">total Sum:{total && total}</h2>
    </div>
  );
}

export default salaryes;
