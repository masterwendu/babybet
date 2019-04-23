import React from 'react'
import axios from 'axios'
import moment from 'moment'
import { name as fakeName } from 'faker'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'
import { BabyCarriage, Dice } from 'styled-icons/fa-solid'
import { isValid } from 'shortid'
import { withRouter } from 'next/router'
import PageWrapper from '../components/Page'

let protocol = 'https://'

if (process.env.NODE_ENV === 'development') {
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
      nameSuggestion: fakeName.firstName(),
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
    if (birthday) {
      this.setState(({ bets }) => ({
        bets: {
          ...bets,
          birthday,
        },
      }))
    }
  }

  changeBabyName = ({ target: { value: babyName } }) => {
    this.setState(({ bets }) => ({
      bets: {
        ...bets,
        babyName,
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

  getNewNameSuggestion = () => {
    this.setState({ nameSuggestion: fakeName.firstName() })
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
        result,
        closed,
        winners,
        winnersAmount,
      },
      nameSuggestion,
    } = this.state

    const {
      sex = 'girl',
      birthday = plannedBirthDate,
      weight = 3000,
      size = 50,
      babyName = '',
    } = bets

    const invalidId = (!id || !isValid(id))
    const dataMissing = !name

    return (
      <PageWrapper>
        {invalidId &&
          <h2>Bitte füge eine gültige ID zur URL hinzu.</h2>
        }
        {!invalidId && dataMissing &&
          <h2>Leider haben wir keine Daten zu dieser Wette gefunden. Möglicherweise wurde Sie gelöscht :/</h2>
        }
        {!invalidId && !dataMissing && (
          <>
            <h2>{name}</h2>
            {(
              <div>
                <h3>Infos</h3>
                <ul>
                  <li>
                    <span>Geburtstermin:&nbsp;</span>
                    <b>{moment(plannedBirthDate).format('DD.MM.YYYY')}</b>
                  </li>
                  <li>
                    <span>Wetteinsatz:&nbsp;</span>
                    <b>
                      {betAmount}
                      <span>&nbsp;€</span>
                    </b>
                  </li>
                  <li>
                    <span>Teilnehmer:&nbsp;</span>
                    <b>{numberOfBets}</b>
                  </li>
                </ul>
              </div>
            )}
            {closed && (
              <div>
                <h3>Die Wette ist zu Ende. Wettergebnisse:</h3>
                <ul>
                  {betOptions.birthday && (
                    <li>
                      <span>Geburtstag:&nbsp;</span>
                      <b>{moment(result.birthday).format('DD.MM.YYYY')}</b>
                    </li>
                  )}
                  {betOptions.size && (
                    <li>
                      <span>Größe:&nbsp;</span>
                      <b>
                        {result.size}
                        <span>&nbsp;cm</span>
                      </b>
                    </li>
                  )}
                  {betOptions.weight && (
                    <li>
                      <span>Gewicht:&nbsp;</span>
                      <b>
                        {result.weight}
                        <span>&nbsp;g</span>
                      </b>
                    </li>
                  )}
                  {betOptions.sex && (
                    <li>
                      <span>Es ist ein&nbsp;</span>
                      <b>{result.sex === 'girl' ? 'Bub' : 'Mädchen'}</b>
                    </li>
                  )}
                  {betOptions.babyName && (
                    <li>
                      <span>Das Baby heißt:&nbsp;</span>
                      <b>{result.babyName}</b>
                    </li>
                  )}
                </ul>
                {!winners.length ?
                  <h4>Leider hat niemand gewonnen, jeder darf sein Geld behalten</h4> :
                  (
                    <h4>
                      <span>Es gab </span>
                      {winners.length}
                      <span>&nbsp;Gewinner, welche jeweils&nbsp;</span>
                      {winnersAmount}
                      <span>&nbsp;Euro erhalten.</span>
                    </h4>
                  )
                }
                {!!winners.length && (
                  <div>
                    <h4>Gewonnen hat:</h4>
                    <ul>
                      {winners.map(({ name: winnerName }, k) => (
                        <li key={`winner_${k}`}>{winnerName}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {betSaved && (
              <h3>
                <span>
                  Danke, dass du mitgewettet hast
                </span>
                <span>&nbsp;</span>
                {personsName}
                <span>!</span>
              </h3>
            )}
            {saving &&
              <h4>Deine Wette wird gespeichert...</h4>
            }
            {!betSaved && !saving && client && !closed && (
              <form onSubmit={this.saveBet}>
                <h3>Wetten</h3>
                {betOptions.sex && (
                  <div>
                    <h4>Wird es ein</h4>
                    <div>
                      <input
                        type="radio"
                        name="sexRadioButton"
                        value="girl"
                        id="girlRadio"
                        onChange={this.changeSex}
                        checked={sex === 'girl'}
                      />
                      <span>&nbsp;</span>
                      <label htmlFor="girlRadio">Mädchen</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="sexRadioButton"
                        value="boy"
                        id="boyRadio"
                        onChange={this.changeSex}
                        checked={sex === 'boy'}
                      />
                      <span>&nbsp;</span>
                      <label htmlFor="boyRadio">Bub</label>
                    </div>
                  </div>
                )}
                {betOptions.birthday && (
                  <div>
                    <h4>Das Baby wird geboren am:</h4>
                    <div>
                      <input type="date" value={birthday} onChange={this.changeBirthday} />
                    </div>
                  </div>
                )}
                {betOptions.babyName && (
                  <div>
                    <h4>Das Kind wird folgenden Vornamen tragen:</h4>
                    <div>
                      <input className="copyUrlInput" placeholder={`Z.B.: ${nameSuggestion}`} type="text" value={babyName} onChange={this.changeBabyName} />
                      <button className="copyUrlButton" type="button">
                        <Dice size="16" title="Neuen Zufallsnamen generieren" onClick={this.getNewNameSuggestion} />
                      </button>
                    </div>
                  </div>
                )}
                {betOptions.weight && (
                  <div>
                    <h4>Es wird wiegen in Gramm:</h4>
                    <div>
                      <input type="number" min="0" value={weight} onChange={this.changeWeight} />
                    </div>
                  </div>
                )}
                {betOptions.size && (
                  <div>
                    <h4>Es wird wie viel Zentimeter groß sein:</h4>
                    <div>
                      <input type="number" min="0" value={size} onChange={this.changeSize} />
                    </div>
                  </div>
                )}
                <div>
                  <h4>Dein Name:</h4>
                  <input
                    type="text"
                    placeholder="Dein Name"
                    value={personsName}
                    onChange={this.changeName}
                  />
                </div>
                <br />
                <p><i>Babybet verwendet Cookies (LocalStorage) um deinen Namen und deine Wetten zu speichern, alle Daten die du bei uns angiebst werden nicht an Dritte weitergegeben und werden nur für die Wettenauswertung verwendet.</i></p>
                <br />
                <button type="submit" disabled={!personsName || (betOptions.babyName && !babyName)}>
                  <BabyCarriage size="18" />
                  <span>&nbsp;</span>
                  <span>Wette abgeben</span>
                  <span>&nbsp;</span>
                  <BabyCarriage size="18" />
                </button>
              </form>
            )}
          </>
        )}
      </PageWrapper>
    )
  }
}

Page.propTypes = {
  bet: PropTypes.object,
}

export default withRouter(Page)
