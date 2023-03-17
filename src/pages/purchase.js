import React from 'react'
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import del from "../img/del.png"
export const getServerSideProps = async () => {
    const res = await  prisma.purchase_raw_material.findMany();
    const pur= JSON.parse(JSON.stringify(res));
    const r = await  prisma.raw_material.findMany();
    const materials= JSON.parse(JSON.stringify(r));
    const f = await  prisma.employee.findMany();
  const employee= JSON.parse(JSON.stringify(f));
    return {
        props: { pur,materials,employee},
      };
}
function purchase({pur,materials,employee}) {
    const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }
    const [form, setForm] = useState({ })
    const [up, setUp] = useState({ })
    async function handleCreate(data){
      try{
        fetch('api/createPurchase', {
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
        fetch(`api/purchase/${id}`, {
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

      fetch(`api/purchase/${id}`, {
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
            <h1>Purchase Raw materials</h1>
            <div className='colums'>
                <p className='label'>id</p>
                <p className='label'>raw_material</p>
                <p className='label'>amount</p>
                <p className='label'>sum </p> 
                <p className='label'>date</p>
                <p className='label'>employee_id</p>
            </div>
        </div>

        {/* create */}
        <form  onSubmit={e => {
          e.preventDefault()
          handleCreate(form)
      }}> 
            <div  className="colums">
            <input className='input' type="text" dis/>
            <select className='input' onChange={e => setForm({...form,raw_material: parseInt(e.target.value)})}>
                       
                
                {materials.map((j)=>{
                    return(
                        <option value={j.id}>{j.name}</option>    
                    )
                })}
            </select> 
            <input className='input'type="number" onChange={e => setForm({...form,amount: parseInt(e.target.value)})}/>
            <input className='input'type="number" onChange={e => setForm({...form,sum: parseInt(e.target.value)})}/>
            <input className='input'onChange={e => setForm({...form, date: new Date(e.target.value).toISOString()})}type="datetime-local" step="1"/>
            <select className='input' onChange={e => setForm({...form,employee_id: parseInt(e.target.value)})}>
                
                {employee.map((j)=>{
                    return(
                        <option value={j.id}>{j.full_name}</option>    
                    )
                })}
            </select> 
            <button className='btn2' type='submit' >post</button>
        </div>
        </form>
        {/* create */}
        {pur.map((p) => {

        return (
            <form key={p.id} onSubmit={e => {
                e.preventDefault()
                handleUpdate(p.id,up)
            }}>
          <div className="colums">
            <input className='input' value={p.id}type="text"disabled/>
            <select className='input' onChange={e => setUp({...up,raw_material: parseInt(e.target.value)})}>
                        {materials.filter(u=>u.id==p.raw_material).map((u)=>{
                    return(<option value="" selected>{u.name}</option>)
                })}
                
                {materials.map((j)=>{
                    return(
                        <option value={j.id}>{j.name}</option>    
                    )
                })}
            </select> 
            <input className='input' defaultValue={p.amount}type="text" onChange={e => setUp({...up,amount: parseInt(e.target.value)})}/>
            <input className='input' defaultValue={p.sum}type="text" onChange={e => setUp({...up,sum: parseInt(e.target.value)})}/>
            <input className='input' defaultValue={p.date.slice(0, 16)} onChange={e => setForm({...form, date: new Date(e.target.value).toISOString()})} type="datetime-local" step="1"/>
            <select className='input' onChange={e => setUp({...up,employee_id: parseInt(e.target.value)})}>
                {employee.filter(u=>u.id==p.employee_id).map((u)=>{
                    return(<option value="" selected>{u.full_name}</option>)
                })}
                
                {employee.map((j)=>{
                    return(
                        <option value={j.id}>{j.full_name}</option>    
                    )
                })}
            </select> 
            <button className='btn1' type='submit' >update</button>
              <button className='delBtn'onClick={() => handleDelete(p.id)}><Image src={del} alt="del" width={20}
              height={20}/></button> 
        </div>
        </form>
        );})}
    </div>
  )
}

export default purchase