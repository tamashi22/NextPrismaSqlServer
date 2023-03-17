import React from 'react'
import prisma from '../lib/prisma';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import del from "../img/del.png"
export const getServerSideProps = async () => {
    const res = await  prisma.employee.findMany();
    const employee= JSON.parse(JSON.stringify(res));
    const j= await prisma.Job_title.findMany()
    const job= JSON.parse(JSON.stringify(j));
    
    return {
      props: { employee ,job},
    };
  };
function employee({ employee ,job}) {
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }
    const [form, setForm] = useState({ })
    const [up, setUp] = useState({ })
    async function handleCreate(data){
      try{
        fetch('api/createEmployee', {
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
        fetch(`api/employee/${id}`, {
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

      fetch(`api/employee/${id}`, {
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
    <div className='main'>
      
        <div className='header'>
            <h1>Employee</h1>
            <div className='colums'>
                <p className='label'>id</p>           
                <p className='label'>full_name</p>
                <p className='label'>Job_title</p>
                <p className='label'>selery </p>
                <p className='label'>address</p>
                <p className='label'>phone_number</p>
            </div>
        </div>
        <div >
        <form  onSubmit={e => {
          e.preventDefault()
          handleCreate(form)
      }}>
          <div  className="colums">
              
          <input className='input' type="text" onChange={e => setForm({...form, id: e.target.value})} disabled/>
              <input className='input' type="text" onChange={e => setForm({...form, full_name: e.target.value})}/>
              <select type="number" className='input' onChange={e => setForm({...form, job_title:  parseInt(e.target.value)})}>
                {job.map((j)=>{
                    return(
                        <option value={j.id}>{j.job_title}</option>    
                    )
                })}
              </select> 
              <input className='input' type="number"onChange={e => setForm({...form, selery: parseInt(e.target.value)})} />
              <input className='input' type="text" onChange={e => setForm({...form, adress: e.target.value})}/>
              <input className='input' type="number" onChange={e => setForm({...form, phone_number:  parseInt(e.target.value)})}/>
              <button className='btn2' type='submit' >post</button>
          </div>
        </form>
        {employee.map((a) => {
        return (
          <form key={a.id} onSubmit={e => {
            e.preventDefault()
            handleUpdate(a.id,up)
        }}>
          <div  className="colums">
            
              <input className='input' defaultValue={a.id} type="text" disabled/>
              <input className='input' defaultValue={a.full_name} type="text" onChange={e => setUp({...up, full_name: e.target.value})}/>
              <select className='input' onChange={e => setUp({...up, job_title: parseInt(e.target.value)})} >
                {job.filter(j=>j.id==a.job_title).map((j)=>{
                    return(<option defaultValue={j.id} selected>{j.job_title}</option>)
                })}
                
                {job.map((j)=>{
                    return(
                        <option value={j.id} >{j.job_title}</option>
                    )
                })}
              </select> 
              <input className='input' defaultValue={a.selery}type="number" onChange={e => setUp({...up, selery: parseInt(e.target.value)})}/>
              <input className='input' defaultValue={a.adress}type="text" onChange={e => setUp({...up, adress: e.target.value})}/>
              <input className='input' defaultValue={a.phone_number}type="number"onChange={e => setUp({...up, phone_number:  parseInt(e.target.value)})}/>
              <button className='btn1' type='submit' >update</button>
              <button className='delBtn'onClick={() => handleDelete(a.id)}><Image src={del} alt="del" width={20}
              height={20}/></button>
          </div>
          </form>
        );
      })}
        </div>
        

      

    </div>
  )
}

export default employee