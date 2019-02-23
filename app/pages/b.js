import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'
import { isValid } from 'shortid'

import { withRouter } from 'next/router'

let protocol = 'https://'

if (process.env.NODE_ENV !== 'production') {
  protocol = 'http://'
}

class Page extends React.Component {
  static async getInitialProps({ req: { headers: { host } }, query: { id } }) {
    const { data: bet } = await axios({
      method: 'get',
      url: `${protocol}${host}/api/bet/${id}`,
    })

    return {
      bet,
    }
  }

  constructor(props) {
    super(props)

    const {
      bet,
    } = props

    let name = ''
    let uniqueBrowserId
    let betSaved = false
    const client = typeof localStorage !== 'undefined'

    if (client) {
      uniqueBrowserId = localStorage.getItem('browserId')
      name = localStorage.getItem('name') || ''

      if (!uniqueBrowserId) {
        uniqueBrowserId = uuid()
        localStorage.setItem('browserId', uniqueBrowserId)
      }

      if (bet.id) {
        betSaved = !!localStorage.getItem(`bet_${bet.id}`)
      }
    }

    this.state = {
      client,
      name,
      betSaved,
      uniqueBrowserId,
      bets: {},
      bet,
    }
  }

  saveBet = () => {
    const {
      bet: {
        betOptions,
        plannedBirthDate,
      },
    } = this.props

    this.setState({
      saving: true,
    }, async () => {
      const {
        bet: {
          id,
        },
      } = this.props

      const {
        name,
        bets,
        uniqueBrowserId,
      } = this.state

      const actualBets = {
        ...bets,
      }

      if (betOptions.sex && !actualBets.sex) {
        actualBets.sex = 'girl'
      }
      if (betOptions.birthday && !actualBets.birthday) {
        actualBets.birthday = plannedBirthDate
      }
      if (betOptions.weight && !actualBets.weight) {
        actualBets.weight = 3000
      }
      if (betOptions.size && !actualBets.size) {
        actualBets.size = 50
      }

      await axios({
        method: 'patch',
        url: `/api/bet/${id}`,
        data: {
          uniqueBrowserId,
          name,
          bets: actualBets,
        },
      })

      localStorage.setItem(`bet_${id}`, 'true')
      localStorage.setItem('name', name)
      this.setState(({ bet }) => ({
        saving: false,
        betSaved: true,
        bet: {
          ...bet,
          numberOfBets: bet.numberOfBets + 1,
        },
      }))
    })
  }

  changeSex = ({ target: { value: sex } }) => {
    this.setState(({ bets }) => ({
      bets: {
        ...bets,
        sex,
      },
    }))
  }

  changeBirthday = ({ target: { value: birthday } }) => {
    this.setState(({ bets }) => ({
      bets: {
        ...bets,
        birthday,
      },
    }))
  }

  changeWeight = ({ target: { value: weight } }) => {
    this.setState(({ bets }) => ({
      bets: {
        ...bets,
        weight,
      },
    }))
  }

  changeSize = ({ target: { value: size } }) => {
    this.setState(({ bets }) => ({
      bets: {
        ...bets,
        size,
      },
    }))
  }

  changeName = ({ target: { value: name } }) => {
    this.setState({
      name,
    })
  }

  render() {
    const {
      betSaved,
      saving,
      client,
      name: personsName,
      bets,
      bet: {
        id,
        name,
        plannedBirthDate,
        betAmount,
        numberOfBets,
        betOptions = {},
      },
    } = this.state

    const {
      sex = 'girl',
      birthday = plannedBirthDate,
      weight = 3000,
      size = 50,
    } = bets

    const invalidId = (!id || !isValid(id))
    const dataMissing = !name

    return (
      <div>
        {invalidId &&
          <h1>Bitte füge eine gültige ID zur URL hinzu.</h1>
        }
        {!invalidId && dataMissing &&
          <h1>Leider haben wir keine Daten zu dieser Wette gefunden. Möglicherweise wurde Sie gelöscht :/</h1>
        }
        {!invalidId && !dataMissing && (
          <>
            <h1>{name}</h1>
            <h2>Infos</h2>
            <ul>
              <li>
                <span>Geburtstermin:</span>
                {plannedBirthDate}
              </li>
              <li>
                <span>Wetteinsatz:</span>
                {betAmount}
                {' '}
                <span>Euro</span>
              </li>
              <li>
                <span>Teilnehmer:</span>
                {numberOfBets}
              </li>
            </ul>
            {betSaved && (
              <h3>
                <span>
                  Danke dass du mitgewettet hast
                </span>
                <span>&nbsp;</span>
                {personsName}
                <span>!</span>
              </h3>
            )}
            {saving &&
              <h4>Deine Wette wird gespeichert...</h4>
            }
            {!betSaved && !saving && client && (
              <form onSubmit={this.saveBet}>
                <h2>Wetten</h2>
                {betOptions.sex && (
                  <div>
                    <h3>Wird es ein</h3>
                    <div>
                      <input
                        type="radio"
                        name="sexRadioButton"
                        value="girl"
                        onChange={this.changeSex}
                        checked={sex === 'girl'}
                      />
                      <span>&nbsp;</span>
                      <span>Mädchen</span>
                    </div>
                    <h3>oder ein</h3>
                    <div>
                      <input
                        type="radio"
                        name="sexRadioButton"
                        value="boy"
                        onChange={this.changeSex}
                        checked={sex === 'boy'}
                      />
                      <span>&nbsp;</span>
                      <span>Bub</span>
                    </div>
                  </div>
                )}
                {betOptions.birthday && (
                  <div>
                    <h3>Das Baby wird am</h3>
                    <div>
                      <input type="date" value={birthday} onChange={this.changeBirthday} />
                    </div>
                    <h3>geboren</h3>
                  </div>
                )}
                {betOptions.weight && (
                  <div>
                    <h3>Es wird wiegen</h3>
                    <div>
                      <input type="number" min="0" value={weight} onChange={this.changeWeight} />
                    </div>
                    <h3>Gramm</h3>
                  </div>
                )}
                {betOptions.size && (
                  <div>
                    <h3>Es wird</h3>
                    <div>
                      <input type="number" min="0" value={size} onChange={this.changeSize} />
                    </div>
                    <h3>Zentimeter groß sein</h3>
                  </div>
                )}
                <div>
                  <span>Dein Name:</span>
                  <span>&nbsp;</span>
                  <input
                    type="text"
                    placeholder="Dein Name"
                    value={personsName}
                    onChange={this.changeName}
                  />
                </div>
                <button type="submit" disabled={!personsName}>
                  <span>Wette abgeben</span>
                </button>
              </form>
            )}
          </>
        )}
      </div>
    )
  }
}

Page.propTypes = {
  bet: PropTypes.object,
}

export default withRouter(Page)
