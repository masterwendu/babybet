import React from 'react'
import axios from 'axios'

import { withRouter } from 'next/router'

const Page = withRouter((props) => (
    <div>
       <h1>{props.bet.name} - {props.router.query.betId}</h1>
       <p>Bet now</p>
       <div>{props.bet.numberOfBets}</div>
       <div>{props.bet.betAmount}</div>
       <div>{props.bet.plannedBirthDate}</div>

    </div>
))

Page.getInitialProps = async (context) => {
  console.log(context)

  const { query: { betId } } = context
  const { data: bet } = await axios.get(`/api/betinfo/${betId}`)

  return {
    bet,
  }
}

export default Page