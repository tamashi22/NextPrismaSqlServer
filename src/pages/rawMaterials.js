import React from 'react'
import prisma from '../lib/prisma';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import del from "../img/del.png"
export const getServerSideProps = async () => {
    const res = await  prisma.raw_material.findMany();
    const materials= JSON.parse(JSON.stringify(res));
    const j= await prisma.unit.findMany()
    const unit= JSON.parse(JSON.stringify(j));
    
    return {
      props: { materials ,unit},
    };
  };
function rawMaterials({materials,unit}) {
  const router = useRouter()
    const refreshData = () => {
      router.replace(router.asPath)
    }
      const [form, setForm] = useState({ })
      const [up, setUp] = useState({ })
    async function handleCreate(data){
      try{
        fetch('api/createMaterial', {
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
      console.log(id)
      try {
        fetch(`api/material/${id}`, {
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
  
      fetch(`api/material/${id}`, {
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
            <h1>Raw materials</h1>
            <div className='colums'>
                <p className='label'>id</p>
                <p className='label'>name</p>
                <p className='label'>unit</p>
                <p className='label'>amount </p>
                <p className='label'>sum</p>
            </div>
        </div>
         {/* //create */}
         <form  onSubmit={e => {
          e.preventDefault()
          handleCreate(form)
      }}>
        <div  className="colums">
            <input className='input' type="text" disabled/>
            <input className='input' type="text" onChange={e => setForm({...form, name: e.target.value})}/>
            <select className='input' onChange={e => setForm({...form, unit: parseInt(e.target.value)})}>
              
                
                {unit.map((j)=>{
                    return(
                        <option value={j.id}>{j.name}</option>    
                    )
                })}
              </select> 
              <input className='input' type="text" onChange={e => setForm({...form, amount: parseInt(e.target.value)})}/>
              <input className='input' type="text" onChange={e => setForm({...form, sum: parseInt(e.target.value)})}/>
              <button className='btn2' type='submit' >post</button>
            </div>
            </form>
            {/* create */}



        {materials.map((a) => {
        return (
          <form key={a.id} onSubmit={e => {
            e.preventDefault()
            handleUpdate(a.id,up)
        }}>
          <div  className="colums">
            <input className='input' defaultValue={a.id} disabled type="text"/>
            <input className='input' defaultValue={a.name} onChange={e => setUp({...up, name: e.target.value})}type="text"/>
            <select className='input' onChange={e => setUp({...up, unit: parseInt(e.target.value)})}>
                {unit.filter(u=>u.id==a.unit).map((u)=>{
                    return(<option value="" selected>{u.name}</option>)
                })}
                
                {unit.map((j)=>{
                    return(
                        <option value={j.id}>{j.name}</option>    
                    )
                })}
              </select> 
              <input className='input' defaultValue={a.amount} onChange={e => setUp({...up, amount: parseInt(e.target.value)})}type="text"/>
              <input className='input' defaultValue={a.sum}    onChange={e => setUp({...up, sum: parseInt(e.target.value)})}type="text"/>
              <button className='btn1' type='submit' >update</button>
              <button className='delBtn'onClick={() => handleDelete(a.id)}><Image src={del} alt="del" width={20}
              height={20}/></button>
            </div>
            </form>
        );
        })}
    </div>
  )
}

export default rawMaterials