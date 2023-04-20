import React from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import del from "../img/del.png";
export const getServerSideProps = async () => {
  const res = await prisma.purchase_raw_material.findMany();
  const pur = JSON.parse(JSON.stringify(res));
  const r = await prisma.raw_material.findMany();
  const materials = JSON.parse(JSON.stringify(r));
  const f = await prisma.employee.findMany();
  const employee = JSON.parse(JSON.stringify(f));
  const mo = await prisma.budget.findMany();
  const money = JSON.parse(JSON.stringify(mo));
  return {
    props: { pur, materials, employee, money },
  };
};
function purchase({ pur, materials, employee, money }) {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  const [form, setForm] = useState({});
  const [up, setUp] = useState({});
  const [bud, setBud] = useState(false);
  async function handleCreate(data) {
    try {
      money[0].budget_amount - data.sum > 0
        ? fetch("api/createPurchase", {
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          }).then(() => {
            const old = materials.filter((u) => u.id == data.raw_material);

            const id = old[0].id;

            fetch(`api/material/${id}`, {
              body: JSON.stringify({
                sum: old[0].sum + data.sum,
                amount: old[0].amount + data.amount,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "PATCH",
            });

            fetch(`api/budget/${1}`, {
              body: JSON.stringify({
                budget_amount: money[0].budget_amount - data.sum,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "PATCH",
            }).then(() => {
              setForm({});
              refreshData();
            });
          })
        : setBud(true);
    } catch {
      console.log(error);
    }
    console.log(data);
  }

  async function handleDelete(id, m, sum, amount) {
    const old = materials.filter((u) => u.id == m);
    console.log(old, sum, money[0]);
    const id2 = old[0].id;
    console.log(money[0].budget_amount);
    const mDiff = money[0].budget_amount - sum;
    console.log(mDiff);
    const idb = 1;
    money[0].budget_amount - sum > 0
      ? fetch(`api/budget/${idb}`, {
          body: JSON.stringify({ budget_amount: mDiff - sum }),

          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
        })
          .then(() => {
            fetch(`api/material/${id2}`, {
              body: JSON.stringify({
                sum: old[0].sum - sum,
                amount: old[0].amount - amount,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "PATCH",
            });

            fetch(`api/purchase/${id}`, {
              headers: {
                "Content-Type": "application/json",
              },
              method: "DELETE",
            });
          })

          .then(() => {
            refreshData();
            setForm({});
          })
      : setBud(true);
  }

  async function handleUpdate(id, data, material1, oldsum, oldA) {
    const old = materials.filter((u) => u.id == material1);

    const id2 = old[0].id;
    const sumDiff = data.sum - oldsum;
    const aDiff = data.amount ? data.amount - oldA : 0;
    console.log(aDiff);
    const budDiff = data.sum ? data.sum - oldsum : 0;
    console.log(budDiff);
    money[0].budget_amount + budDiff > 0
      ? fetch(`api/material/${id2}`, {
          body: JSON.stringify({
            sum: data.sum && old[0].sum + sumDiff,
            amount: data.amount && old[0].amount + aDiff,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
        })
          .then(() => {
            fetch(`api/purchase/${id}`, {
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
              method: "PATCH",
            });

            fetch(`api/budget/${1}`, {
              body: JSON.stringify({
                budget_amount: money[0].budget_amount - budDiff,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "PATCH",
            });
          })

          .then(() => {
            setForm({});
            refreshData();
          })
      : setBud(true);
  }
  return (
    <div>
      <div className="header">
        <div className="budget">
          <h1>Purchase Raw materials</h1>
          <div>
            <p>budget_amount:{money[0].budget_amount}</p>
            <p>{bud == true ? "The budget cannot be less than 0" : ""}</p>
          </div>
        </div>
        <div className="colums">
          <p className="label">id</p>
          <p className="label">raw_material</p>
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
          <input className="input" type="text" dis />
          <select
            className="input"
            onChange={(e) =>
              setForm({ ...form, raw_material: parseInt(e.target.value) })
            }
          >
            {materials.map((j) => {
              return <option value={j.id}>{j.name}</option>;
            })}
          </select>
          <input
            className="input"
            type="number"
            onChange={(e) =>
              setForm({ ...form, amount: parseInt(e.target.value) })
            }
          />
          <input
            className="input"
            type="number"
            onChange={(e) =>
              setForm({ ...form, sum: parseInt(e.target.value) })
            }
          />
          <input
            className="input"
            onChange={(e) =>
              setForm({ ...form, date: new Date(e.target.value).toISOString() })
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
      {pur.map((p) => {
        return (
          <div className="fle">
            <form
              key={p.id}
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(p.id, up, p.raw_material, p.sum, p.amount);
              }}
            >
              <div className="colums">
                <input className="input" value={p.id} type="text" disabled />
                <select
                  className="input"
                  onChange={(e) =>
                    setUp({ ...up, raw_material: parseInt(e.target.value) })
                  }
                >
                  {materials
                    .filter((u) => u.id == p.raw_material)
                    .map((u) => {
                      return (
                        <option value="" selected>
                          {u.name}
                        </option>
                      );
                    })}

                  {materials.map((j) => {
                    return <option value={j.id}>{j.name}</option>;
                  })}
                </select>
                <input
                  className="input"
                  defaultValue={p.amount}
                  type="text"
                  onChange={(e) =>
                    setUp({ ...up, amount: parseInt(e.target.value) })
                  }
                />
                <input
                  className="input"
                  defaultValue={p.sum}
                  type="text"
                  onChange={(e) =>
                    setUp({ ...up, sum: parseInt(e.target.value) })
                  }
                />
                <input
                  className="input"
                  defaultValue={p.date.slice(0, 16)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: new Date(e.target.value).toISOString(),
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
                    .filter((u) => u.id == p.employee_id)
                    .map((u) => {
                      return (
                        <option value="" selected>
                          {u.full_name}
                        </option>
                      );
                    })}

                  {employee.map((j) => {
                    return <option value={j.id}>{j.full_name}</option>;
                  })}
                </select>
                <button className="btn1" type="submit">
                  update
                </button>
              </div>
            </form>
            <button
              className="delBtn"
              onClick={() =>
                handleDelete(p.id, p.raw_material, p.sum, p.amount)
              }
            >
              <Image src={del} alt="del" width={20} height={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default purchase;
