import React from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import del from "../img/del.png";
export const getServerSideProps = async () => {
  const res = await prisma.sale_of_products.findMany();
  const sale = JSON.parse(JSON.stringify(res));
  const r = await prisma.employee.findMany();
  const employee = JSON.parse(JSON.stringify(r));
  const p = await prisma.finished_product.findMany();
  const product = JSON.parse(JSON.stringify(p));
  const u = await prisma.budget.findMany();
  const budget = JSON.parse(JSON.stringify(u));
  return {
    props: { sale, employee, product, budget },
  };
};
function sale({ sale, employee, product, budget }) {
  console.log(sale);
  const router = useRouter();
  const currentDate= new Date()
  const refreshData = () => {
    router.replace(router.asPath);
  };
  const [form, setForm] = useState({});
  const [up, setUp] = useState({});

  async function handleCreate(data) {
    let finishedProduct = product.find((p) => p.id === data.product_id);
    console.log(finishedProduct);

    if (finishedProduct.amount < data.amount) {
      alert(`Not enough ${finishedProduct.name} on stock.`);
    } else {
      const newData = {
        amount: finishedProduct.amount - data.amount,
        sum:
          finishedProduct.sum -
          (finishedProduct.sum / finishedProduct.amount) * data.amount,
      };
      console.log("newData", newData);
      console.log("oldButget", budget);
      data.sum=newData.sum/newData.amount*data.amount
      data.Date=!data.Date&&new Date(currentDate).toISOString() 
      const newBudget={
        budget_amount:budget[0].budget_amount+data.sum*(1+budget[0].percent/100)
      }
      console.log("newButget", newBudget);
      await fetch("api/createSale", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
      await fetch(`api/product/${finishedProduct.id}`, {
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      })
      await fetch(`api/budget/${1}`, {
        body: JSON.stringify(newBudget),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      })
      .then(() => {
        setForm({});
        refreshData();
      });
    }

    console.log(data);
  }
  async function handleDelete(id) {
    try {
      fetch(`api/sale/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }).then(() => {
        refreshData();
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function handleUpdate(id, data) {
    console.log(data, id);

    fetch(`api/sale/${id}`, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    }).then(() => {
      setForm({});
      refreshData();
    });
  }
  return (
    <div>
      <div className="header">
        <h1>Sale of products</h1>
        <div className="colums">
          <p className="label">id</p>
          <p className="label">product_id</p>
          <p className="label">amount</p>
          <p className="label">sum </p>
          <p className="label">date</p>
          <p className="label">employee_id</p>
        </div>
      </div>
      {/* create */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate(form);
        }}
      >
        <div className="colums">
          <input className="input" type="text" disabled />
          <div>
            <select
              className="input"
              onChange={(e) =>
                setForm({ ...form, product_id: parseInt(e.target.value) })
              }
            >
              {product.map((j) => {
                return (
                  <option key={j.id} value={j.id}>
                    {j.name}
                  </option>
                );
              })}
            </select>
          </div>
          <input
            className="input"
            onChange={(e) =>
              setForm({ ...form, amount: parseInt(e.target.value) })
            }
          />
          <input
            className="input"
            disabled
            onChange={(e) =>
              setForm({ ...form, sum: parseInt(e.target.value) })
            }
          />
          <input
            className="input"
            onChange={(e) =>
              setForm({ ...form, Date: new Date(e.target.value).toISOString() })
            }
            type="datetime-local"
            step="1"
          />
          <select
            className="input"
            onChange={(e) =>
              setForm({ ...form, employee_id: parseInt(e.target.value) })
            }
          >
            {employee.map((j) => {
              return <option value={j.id}>{j.full_name}</option>;
            })}
          </select>
          <button className="btn2" type="submit">
            post
          </button>
        </div>
      </form>
      {/* create */}

      {sale.map((s) => {
        return (
          <form
            key={s.id}
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(s.id, up);
            }}
          >
            <div className="colums">
              <input className="input" value={s.id} type="text" disabled />
              <div>
                <select
                  className="input"
                  onChange={(e) =>
                    setUp({ ...up, product_id: parseInt(e.target.value) })
                  }
                >
                  {product
                    .filter((u) => u.id == s.product_id)
                    .map((u) => {
                      return (
                        <option value={u.id} selected>
                          {u.name}
                        </option>
                      );
                    })}

                  {product.map((j) => {
                    return (
                      <option key={j.id} value={j.id}>
                        {j.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <input
                className="input"
                defaultValue={s.amount}
                type="number"
                onChange={(e) =>
                  setUp({ ...up, amount: parseInt(e.target.value) })
                }
              />
              <input
                className="input"
                defaultValue={s.sum}
                type="number"
                onChange={(e) =>
                  setUp({ ...up, sum: parseInt(e.target.value) })
                }
              />
              <input
                className="input"
                defaultValue={s.Date.slice(0, 16)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    Date: new Date(e.target.value).toISOString(),
                  })
                }
                type="datetime-local"
                step="1"
              />
              <select
                className="input"
                onChange={(e) =>
                  setUp({ ...up, employee_id: parseInt(e.target.value) })
                }
              >
                {employee
                  .filter((u) => u.id == s.employee_id)
                  .map((u) => {
                    return <option>{u.full_name}</option>;
                  })}

                {employee.map((j) => {
                  return <option value={j.id}>{j.full_name}</option>;
                })}
              </select>
              <button className="btn1" type="submit">
                update
              </button>
              <button className="delBtn" onClick={() => handleDelete(s.id)}>
                <Image src={del} alt="del" width={20} height={20} />
              </button>
            </div>
          </form>
        );
      })}
    </div>
  );
}

export default sale;
// 2023-05-12T04:15:40.000Z
// 2023-05-12T04:16:29.965Z