import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import del from "../img/del.png";
export const getServerSideProps = async () => {
  const res = await prisma.production.findMany();
  const production = JSON.parse(JSON.stringify(res));
  const r = await prisma.finished_product.findMany();
  const product = JSON.parse(JSON.stringify(r));
  const f = await prisma.employee.findMany();
  const employee = JSON.parse(JSON.stringify(f));
  const i = await prisma.ingredients.findMany();
  const ingredients = JSON.parse(JSON.stringify(i));
  const m = await prisma.raw_material.findMany();
  const materials = JSON.parse(JSON.stringify(m));
  return {
    props: { production, product, employee, ingredients, materials },
  };
};
function production({ production, product, employee, ingredients, materials }) {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  const [form, setForm] = useState({});
  const [up, setUp] = useState({});
  async function handleCreate(data) {
    try {
      const ingForproduct = ingredients.filter(
        (u) => u.product_id == data.product_id
      );
      let hasEnoughRawMaterial = ingForproduct.every((ingredient) => {
        let rawMaterial = materials.find(
          (r) => r.id === ingredient.raw_material
        );
        return (
          rawMaterial && rawMaterial.amount >= ingredient.amount * data.amount
        );
      });

      if (hasEnoughRawMaterial) {
        // reduce the amount and sum of each raw material used in the production
        ingForproduct.forEach((ingredient) => {
          let rawMaterial = materials.find(
            (r) => r.id === ingredient.raw_material
          );
          console.log("raw", rawMaterial);
          let newRawMaterial = { ...rawMaterial }; // create a new object for each rawMaterial
          newRawMaterial.amount -= ingredient.amount * data.amount;
          newRawMaterial.sum -=
            ingredient.amount *
            data.amount *
            (rawMaterial.sum / rawMaterial.amount);
          console.log("new", newRawMaterial);
          // find the index of the updated raw material in the materials array
          let index = materials.findIndex((r) => r.id === newRawMaterial.id);

          // update the raw material with a PATCH request
          fetch(`api/material/${newRawMaterial.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: newRawMaterial.amount,
              sum: newRawMaterial.sum,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to update raw material.");
              }
              return response.json();
            })
            .then((updatedRawMaterial) => {
              // update the materials array with the updated raw material
              materials[index] = updatedRawMaterial;
            })
            .catch((error) => {
              console.error(error);
              alert("Failed to update raw material.");
            });
        });

        // increase the amount and sum of the finished product
        let finishedProduct = product.find((p) => p.id === data.product_id);
        finishedProduct.amount += data.amount;
        finishedProduct.sum += ingForproduct.reduce((sum, ingredient) => {
          let rawMaterial = materials.find(
            (r) => r.id === ingredient.raw_material
          );
          return (
            sum +
            ingredient.amount *
              data.amount *
              (rawMaterial.sum / rawMaterial.amount)
          );
        }, 0);

        // update the finished product with a PATCH request
        fetch(`api/product/${finishedProduct.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: finishedProduct.amount,
            sum: finishedProduct.sum,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to update finished product.");
            }
            console.log("Production completed successfully.");
            refreshData(); // reload the page after successfully updating the finished product
          })
          .catch((error) => {
            console.error(error);
            alert("Failed to update finished product.");
          })
          .then(() => {
            fetch("api/createProduction", {
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            }).then(() => {
              setForm({});
              refreshData();
            });
          });
      } else {
        alert("Not enough raw material to produce the finished product.");
      }
    } catch {
      console.log(error);
    }
    console.log(data);
  }
  async function handleDelete(id) {
    try {
      fetch(`api/production/${id}`, {
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

    fetch(`api/production/${id}`, {
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
        <h1>production</h1>
        <div className="colums">
          <p className="label">id</p>
          <p className="label">product_id</p>
          <p className="label">amount</p>
          <p className="label">Date </p>
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
              setForm({ ...form, amount: parseFloat(e.target.value) })
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
      {production.map((s) => {
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
                  setUp({ ...up, amount: parseFloat(e.target.value) })
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

export default production;
