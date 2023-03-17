import React from 'react'
import prisma from '../lib/prisma';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import del from "../img/del.png"
export const getServerSideProps = async () => {

    const u= await prisma.budget.findMany()
    const money= JSON.parse(JSON.stringify(u));
    
    return {
      props: {money},
    };
  };
function budget({money}) {
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }
    const [form, setForm] = useState({ })
    const [up, setUp] = useState({ })
    async function handleCreate(data){
      try{
        fetch('api/createBudget', {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        }).then(() => {
          setForm({
           })
          refreshData()
        })
      }
      catch{
          console.log(error)
      }
      console.log(data)
    }
    async function handleDelete(id){
      try {
        fetch(`api/budget/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'DELETE'
        }).then(() => {
          refreshData()
        })
      } catch (error) {
        console.log(error)
      } 
    }
    async function handleUpdate(id,data){
      console.log(data,id)

      fetch(`api/budget/${id}`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH'
      }).then(() => {
        setForm({})
        refreshData()
      })
    }
  return (
    <div>
        <div className='header'>
            <h1>Budget</h1>
            <div className='colums'>
                <p className='label'>id</p>
                <p className='label'>budget_amount</p>
                <p className='label'>percent</p>
                <p className='label'>bonus</p>
            </div>
        </div>

        {/* create */}
        <form  onSubmit={e => {
          e.preventDefault()
          handleCreate(form)
      }}>
          <div className="colums">
            <input className='input' type="text" disabled/>
            <input className='input' type="number"onChange={e => setForm({...form, budget_amount:  parseInt(e.target.value)})}/>
            <input className='input' type="number"onChange={e => setForm({...form, percent:  parseInt(e.target.value)})}/>
            <input className='input' type="number"onChange={e => setForm({...form, bonus:  parseInt(e.target.value)})}/>
            <button className='btn2' type='submit' >post</button>
          </div>
        </form>
        {/* create */}

        {money.map((k) => {
        return (
          <form key={k.id} onSubmit={e => {
            e.preventDefault()
            handleUpdate(k.id,up)
        }}>
          <div  className="colums">
            <input className='input' defaultValue={k.id}           type="text"/>
            <input className='input' defaultValue={k.budget_amount}type="text"onChange={e => setUp({...up, budget_amount:  parseInt(e.target.value)})}/>
            <input className='input' defaultValue={k.percent}      type="text"onChange={e => setUp({...up, percent:  parseInt(e.target.value)})}/>
            <input className='input' defaultValue={k.bonus}        type="text"onChange={e => setUp({...up, bonus:  parseInt(e.target.value)})}/>
            <button className='btn1' type='submit' >update</button>
            <button className='delBtn'onClick={() => handleDelete(k.id)}><Image src={del} alt="del" width={20}
              height={20}/></button>
          </div>
          </form>
        );
        })}
    </div>
  )
}

export default budget