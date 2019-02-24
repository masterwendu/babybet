import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { withRouter } from 'next/router'
import PageWrapper from '../components/Page'


let protocol = 'https://'

if (process.env.NODE_ENV !== 'production') {
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
      size = 50,
    } = bets

    return (
      <PageWrapper>
        <h2>
          <span>Admin </span>
          {serverName}
        </h2>
        {!saving && (
          <form onSubmit={this.editBet}>
            <div>
              <label htmlFor="inputName">
                Name der Wette:
                <br />
                <input
                  name="inputName"
                  placeholder="Baby von Brangelina"
                  onChange={this.changeName}
                  value={name}
                  type="text"
                />
              </label>
            </div>
            <div>
              <label htmlFor="inputPlannedBirthDate">
                Geburtstermin
                <br />
                <input name="inputPlannedBirthDate" onChange={this.changePlannedBirthDate} value={plannedBirthDate} type="date" />
              </label>
            </div>
            <div>
              <button
                type="submit"
                disabled={!((name && name !== serverName) || (plannedBirthDate && plannedBirthDate !== serverPlannedBirthDate))}
              >
                Wette ändern
              </button>
            </div>
          </form>
        )}
        {saving &&
          <h3>Wette wird editiert...</h3>
        }
        {betClosed && (
          <div>
            <h3>Herzlichen Gl�ckwunsch! Die Wette ist beendet.</h3>
            <Link href={`/b/${betId}`}>
              <a>Klicke hier f�r die Ergebnisse</a>
            </Link>
          </div>
        )}
        {!betClosed && (
          <div>
            <h3>Wette beenden und aufl�sen</h3>
            {closeBetSaving &&
              <h4>Wette wird beendet...</h4>
            }
            {!closeBetSaving && (
              <form onSubmit={this.closeBet}>
                <h2>Wetten</h2>
                {betOptions.sex && (
                  <div>
                    <h3>Es ist ein</h3>
                    <div>
                      <input
                        type="radio"
                        name="sexRadioButton"
                        value="girl"
                        onChange={this.changeSex}
                        checked={sex === 'girl'}
                      />
                      <span>&nbsp;</span>
                      <span>M�dchen</span>
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
                    <h3>Das Baby ist am</h3>
                    <div>
                      <input type="date" value={birthday} onChange={this.changeBirthday} />
                    </div>
                    <h3>geboren</h3>
                  </div>
                )}
                {betOptions.weight && (
                  <div>
                    <h3>Es wiegt</h3>
                    <div>
                      <input type="number" min="0" value={weight} onChange={this.changeWeight} />
                    </div>
                    <h3>Gramm</h3>
                  </div>
                )}
                {betOptions.size && (
                  <div>
                    <h3>Es ist</h3>
                    <div>
                      <input type="number" min="0" value={size} onChange={this.changeSize} />
                    </div>
                    <h3>Zentimeter gro� sein</h3>
                  </div>
                )}
                <button type="submit">
                  <span>Wette aufl�sen</span>
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
