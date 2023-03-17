import React from 'react'
import prisma from '../lib/prisma';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import del from "../img/del.png"
export const getServerSideProps = async () => {

    const u= await prisma.Unit.findMany()
    const w= JSON.parse(JSON.stringify(u));
    
    return {
      props: {w},
    };
  };
export default function unit({w}) {
    console.log(w)
    const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }
    const [form, setForm] = useState({job_title:""})

  async function handleCreate(data){
    try{
      fetch('api/createUnit', {
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
      fetch(`api/unit/${id}`, {
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
    fetch(`api/unit/${id}`, {
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
            <h1>Unit</h1>
            <div className='colums'>
                <p className='label'>id</p>
                <p className='label'>unit</p>
            </div>
        </div>

        <form  onSubmit={e => {
          e.preventDefault()
          handleCreate(form)
      }}>
          <div  className="colums">
              
              <input className='input' placeholder='id' disabled type="text"/>
              <input className='input' placeholder='name'type="text"
                    onChange={e => setForm({...form, name: e.target.value})}
              />
              <button className='btn2' type='submit'>post</button>
          </div>
        </form>


        {w.map((k) => {
        return (
          <form key={k.id} onSubmit={e => {
            e.preventDefault()
            handleUpdate(k.id,form)
        }}>
          <div  className="colums">
            <input className='input' defaultValue={k.id}type="text"/>
            <input className='input' defaultValue={k.name}type="text"  onChange={e => setForm({...form, name: e.target.value})}/>
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
