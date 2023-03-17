import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Image from 'next/image';
import del from "../img/del.png"
export const getServerSideProps = async () => {
const res = await  prisma.ingredients.findMany();
const ingredients= JSON.parse(JSON.stringify(res));
const r = await  prisma.finished_product.findMany();
const u= await prisma.raw_material.findMany()
const materials= JSON.parse(JSON.stringify(u));
const product= JSON.parse(JSON.stringify(r));
  return {
      props: { ingredients,product,materials},
    };
}
function ingredients({ingredients,product,materials}) {
  const [prod, setProd] = useState();
  console.log(prod)
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }
    const [form, setForm] = useState({ })
    const [up, setUp] = useState({ })
    async function handleCreate(data){
      let post={...data,product_id:parseInt(prod)}
      try{
        fetch('api/createIngredient', {
          body: JSON.stringify(post),
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
      
      
    }
    async function handleDelete(id){
      try {
        fetch(`api/ingredient/${id}`, {
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

      fetch(`api/ingredient/${id}`, {
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
        <h1>Ingrediests</h1>
          <div className='flex'>
            <p>Product</p>
            <select className='input' onChange={(e)=>setProd(e.target.value)}>
            {product.map((j)=>{
                    return(
                        <option key={j.id}value={j.id}>{j.name}</option>  
                    )
                })}
            </select>
          </div>
           
            
            <div className='colums'>
                <p className='label'>id</p>
                <p className='label'>raw_material</p>
                <p className='label'>amount</p>
            </div>
          {prod ?
          <form  onSubmit={e => {
            e.preventDefault()
            handleCreate(form)
          }}> 
             <div  className="colums">
             <input className='input' type="text"disabled/>
             <select className='input' onChange={e => setForm({...form,raw_material: parseInt(e.target.value)})}>
               
               {materials.map((j)=>{
                   return(
                       <option value={j.id}>{j.name}</option>    
                   )
               })}
             </select>
             <input className='input' type="text" onChange={e => setForm({...form,amount: parseInt(e.target.value)})}/>
             <button className='btn2' type='submit' >post</button>
           </div>
           </form>
            :<p>выберите продукт</p>
          }
            { prod&&ingredients.filter(u=>u.product_id==prod).map((p)=>{
                      return(
                        <form key={p.id} onSubmit={e => {
                          e.preventDefault()
                          handleUpdate(p.id,up)
                      }}>
                        <div  className="colums">
                          <input className='input' value={p.id}type="text" disabled/>
                          <select className='input' onChange={e => setUp({...up,raw_material: parseInt(e.target.value)})}>
                            {materials.filter(m=>m.id==p.raw_material).map((m)=>{
                                return(<option value="" selected>{m.name}</option>)
                            })}
                            
                            {materials.map((j)=>{
                                return(
                                    <option value="">{j.name}</option>    
                                )
                            })}
                          </select>
                          <input className='input' defaultValue={p.amount}type="text" onChange={e => setUp({...up,amount: parseInt(e.target.value)})}/>
                          <button className='btn1' type='submit' >update</button>
              <button className='delBtn'onClick={() => handleDelete(p.id)}><Image src={del} alt="del" width={20}
              height={20}/></button> 
                        </div>

                        </form>
                      )
                  })}
            
        </div>
    </div>
  )
}

export default ingredients