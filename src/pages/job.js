import React from 'react'
import prisma from '../lib/prisma';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import del from "../img/del.png"
export const getServerSideProps = async () => {

    const j= await prisma.Job_title.findMany()
    const job= JSON.parse(JSON.stringify(j));
    
    return {
      props: { job},
    };
  };
function job({job}) {
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }
    const [form, setForm] = useState({job_title:""})

  async function handleCreate(data){
    try{
      fetch('api/createJob', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then(() => {
        setForm({job_title:""})
        refreshData()
      })
    }
    catch{
        console.log(error)
    }
  }
  async function handleDelete(id){
    try {
      fetch(`api/job/${id}`, {
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
    fetch(`api/job/${id}`, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT'
    }).then(() => {
      setForm({job_title:""})
      refreshData()
    })
  }
  return (
    <div>
        <div className='header'>
            <h1>Job_title</h1>
            <div className='colums'>
                <p className='label'>id</p>
                <p className='label'>Job_title</p>
            </div>
        </div>
        <form  onSubmit={e => {
          e.preventDefault()
          handleCreate(form)
      }}>
          <div  className="colums">
              
              <input className='input' placeholder='id' disabled type="text"/>
              <input className='input' placeholder='job_title'type="text"
                    onChange={e => setForm({...form, job_title: e.target.value})}
              />
              <button className='btn2' type='submit'>post</button>
          </div>
        </form>
        {job.map((j) => {
        return (
          <form key={j.id} onSubmit={e => {
            e.preventDefault()
            handleUpdate(j.id,form)
        }}>
          <div  className="colums">
            <input className='input' defaultValue={j.id}type="text" disabled/>
            <input className='input' defaultValue={j.job_title} onChange={e => setForm({...form, job_title: e.target.value})}type="text"/>
            <button className='btn1' type='submit' >update</button>
            <button className='delBtn'onClick={() => handleDelete(j.id)}><Image src={del} alt="del" width={20}
              height={20}/></button>
            
            </div>
            </form>
        );
        })}
        
    </div>
  )
}

export default job