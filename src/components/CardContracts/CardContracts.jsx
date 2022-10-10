import React from 'react'
import CardContract from '../CardContract/CardContract'
import ContractForm from '../ContractForm/ContractForm'
import style from './CardContracts.module.css'
import { ButtonGroup,Button, Pagination } from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react'
import { getUserDetail } from '../../redux/actions/actions'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import {sumador} from '../../AuxFunctions'

function CardContracts({isLoading,getUserDetail,user}) {
  const[columns,setColumns] = useState([[],[],[]])
  const[page,setPage] = useState(1)
  const[maxPage,setMaxPage] = useState(1)
  const[type,setType] = useState('p')
  const[update,setUpdate] = useState(false)
  let keys = sumador()

  const changePag = (e) => {
    setPage(e.target.innerText)
  }

  const id = useParams().id

  useEffect(()=>{
    getUserDetail(id)
    console.log("--------------->Entre")
  },[update])


  useEffect(()=>{
    let contratos = []
    if(user.Contracts){
      if(type == 'p')
      contratos = user.Contracts.filter(e => !e.confirmed && !e.finished)
      if(type == 'c')
      contratos = user.Contracts.filter(e => e.confirmed && !e.finished)
      if(type == 't')
      contratos = user.Contracts.filter(e => e.finished && e.confirmed)
      if(type == 'f')
      contratos = user.Contracts.filter(e => e.finished && !e.confirmed)
    }

    setMaxPage(Math.ceil(contratos.length/9))
    let num = 0
    const columnas_aux = [[],[],[]]
    for (let index = (page*9)-9; index < (9*page) && index < contratos.length ; index++) {
      const element = contratos[index];
      columnas_aux[num].push(element)
      num++
      num = num%3
    }
    setColumns(columnas_aux)
    console.log(columnas_aux)
  },[page,type,isLoading])


  const forceUpdate = () =>{
    setUpdate(!update)
  }

  const changeType = (e) =>{
    setType(e.target.value)
  }

  return (
    <div className={style.cardContracts}>
      <div className={style.filters}>
      <ButtonGroup style={{display:'flex',gap:"6vw"}} variant='text' aria-label="text button group">
      <Button value='p' onClick={changeType}>Pendientes</Button>
      <Button value='c' onClick={changeType}>Confirmados</Button>
      <Button value='t' onClick={changeType}>Terminados</Button>
      <Button value='f' onClick={changeType}>Cancelados</Button>
      </ButtonGroup>
      </div>
      
        {!isLoading ? <div className={style.cardContainer}>
        <div className={style.columnContainer}>
        {columns[0].length > 0 ? columns[0].map(e =>  <CardContract id = {e.id} key = {keys()} date={e.date} location={e.location}
        state = {e.finished ? "Terminado" : e.confirmed? "Confirmado" : "Pendiente de confirmacion"}
        description = {e.description}
        worker = {user.Worker && true}
        type = {type}
        force = {forceUpdate}
        /> ):<h3>No hay contratos para mostrar...</h3>}
        </div>
        <div className={style.columnContainer}>
        {columns[1].map(e =>  <CardContract id = {e.id} key = {keys()} date={e.date} location={e.location}
        state = {e.finished ? "Terminado" : e.confirmed? "Confirmado" : "Pendiente de confirmacion"}
        description = {e.description}
        worker = {user.Worker && true}
        type = {type}
        force = {forceUpdate}
        /> )}
        </div>
        <div className={style.columnContainer}>
        {columns[2].map(e =>  <CardContract id = {e.id} key = {keys()} date={e.date} location={e.location}
        state = {e.finished ? "Terminado" : e.confirmed? "Confirmado" : "Pendiente de confirmacion"}
        description = {e.description}
        worker = {user.Worker && true}
        type = {type}
        force = {forceUpdate}
        /> )}
        </div>
      </div> : <h3>Loading...</h3> }
      
    <Pagination count={maxPage} onChange={changePag} style={{height:'10vh',marginTop:20,display:'flex',justifyContent:"center"}}/>
    </div>
  )
}


const mapStateToProps = (state) => ({
  isLoading: state.isLoading,
  user: state.userDetail,
  authState: state.authState
})

function mapDispatchToProps (dispatch) {
  return {

    getUserDetail : (id) => dispatch(getUserDetail(id)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CardContracts)
