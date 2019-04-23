import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Link from 'next/link'
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
      url: `${protocol}${host}/api/bet/admin/${id}`,
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

    this.state = {
      serverName: bet.name,
      serverPlannedBirthDate: bet.plannedBirthDate,
      name: bet.name,
      plannedBirthDate: bet.plannedBirthDate,
      bets: {},
      betClosed: !!bet.closed,
    }
  }

  editBet = () => {
    this.setState({
      saving: true,
    }, async () => {
      const {
        bet: {
          adminId,
        },
      } = this.props

      const {
        name,
        plannedBirthDate,
      } = this.state

      await axios({
        method: 'patch',
        url: `/api/bet/admin/${adminId}`,
        data: {
          name,
          plannedBirthDate,
        },
      })

      this.setState({
        saving: false,
        serverName: name,
        serverPlannedBirthDate: plannedBirthDate,
      })
    })
  }

  changeName = ({ target: { value: name } }) => {
    this.setState({
      name,
    })
  }

  changePlannedBirthDate = ({ target: { value: plannedBirthDate } }) => {
    this.setState({
      plannedBirthDate,
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

  changeWeight = ({ target: { value: weight } }) => {
    this.setState(({ bets }) => ({
      bets: {
        ...bets,
        weight,
      },
    }))
  }

  changeBabyName = ({ target: { value: babyName } }) => {
    this.setState(({ bets }) => ({
      bets: {
        ...bets,
        babyName,
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

  closeBet = () => {
    this.setState({
      closeBetSaving: true,
    }, async () => {
      const {
        bet: {
          adminId,
          betOptions,
          plannedBirthDate,
        },
      } = this.props

      const {
        bets,
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
        url: `/api/bet/admin/close/${adminId}`,
        data: actualBets,
      })

      this.setState({
        closeBetSaving: false,
        betClosed: true,
      })
    })
  }

  render() {
    const {
      bet: {
        betOptions,
        id: betId,
      },
    } = this.props

    const {
      name,
      plannedBirthDate,
      serverName,
      serverPlannedBirthDate,
      saving,
      bets,
      betClosed,
      closeBetSaving,
    } = this.state

    const {
      sex = 'girl',
      birthday = plannedBirthDate,
      weight = 3000,
      babyName = '',
      size = 50,
    } = bets

    return (
      <PageWrapper>
        <h2>
          <span>Admin </span>
          {serverName}
        </h2>
        {!saving && !betClosed && (
          <form onSubmit={this.editBet}>
            <div>
              <label htmlFor="inputName">
                <h4>Name der Wette:</h4>
              </label>
              <input
                id="inputName"
                placeholder="Baby von Brangelina"
                onChange={this.changeName}
                value={name}
                type="text"
              />
            </div>
            <div>
              <label htmlFor="inputPlannedBirthDate">
                <h4>Geburtstermin</h4>
              </label>
              <input id="inputPlannedBirthDate" onChange={this.changePlannedBirthDate} value={plannedBirthDate} type="date" />
            </div>
            <br />
            <br />
            <div>
              <button
                type="submit"
                disabled={!((name && name !== serverName) || (plannedBirthDate && plannedBirthDate !== serverPlannedBirthDate))}
              >
                Wette &auml;ndern
              </button>
            </div>
          </form>
        )}
        {saving &&
          <h3>Wette wird editiert...</h3>
        }
        {betClosed && (
          <div>
            <h3>Herzlichen Gl&uuml;ckwunsch! Die Wette ist beendet.</h3>
            <Link href={`/b/${betId}`}>
              <a>Klicke hier f&uuml;r die Ergebnisse</a>
            </Link>
          </div>
        )}
        {!betClosed && (
          <div>
            <h3>Wette beenden und aufl&ouml;sen</h3>
            {closeBetSaving &&
              <h4>Wette wird beendet...</h4>
            }
            {!closeBetSaving && (
              <form onSubmit={this.closeBet}>
                {betOptions.sex && (
                  <div>
                    <h4>Es ist ein</h4>
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
                      <label htmlFor="girlRadio">M&auml;dchen</label>
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
                    <h4>Das Baby ist geboren am:</h4>
                    <div>
                      <input type="date" value={birthday} onChange={this.changeBirthday} />
                    </div>
                  </div>
                )}
                {betOptions.weight && (
                  <div>
                    <h3>Es wiegt so viel Gramm:</h3>
                    <div>
                      <input type="number" min="0" value={weight} onChange={this.changeWeight} />
                    </div>
                  </div>
                )}
                {betOptions.babyName && (
                  <div>
                    <h3>Das Baby heißt:</h3>
                    <div>
                      <input type="test" value={babyName} onChange={this.changeBabyName} />
                    </div>
                  </div>
                )}
                {betOptions.size && (
                  <div>
                    <h3>Es ist Zentimeter groß:</h3>
                    <div>
                      <input type="number" min="0" value={size} onChange={this.changeSize} />
                    </div>
                  </div>
                )}
                <br />
                <br />
                <button type="submit" disabled={betOptions.babyName && !babyName}>
                  <span>Wette aufl&ouml;sen</span>
                </button>
              </form>
            )}
          </div>
        )}
      </PageWrapper>
    )
  }
}

Page.propTypes = {
  bet: PropTypes.object,
}

export default withRouter(Page)
