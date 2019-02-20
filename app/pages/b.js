import React from 'react'
import { isValid } from 'shortid'

import { withRouter } from 'next/router'

class Page extends React.Component {
  render() {
    const {
      router: {
        query: {
          id,
          name,
          plannedBirthDate,
          betAmount,
          numberOfBets,
          betOptions,
        },
      }
    } = this.props

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
        {!invalidId && !dataMissing &&
          <>
            <h1>{name}</h1>
            <h2>Infos</h2>
            <ul>
              <li>Geburtstermin: {plannedBirthDate}</li>
              <li>Wetteinsatz: {betAmount} Euro</li>
              <li>Teilnehmer: {numberOfBets}</li>
            </ul>
            <h2>Wetten</h2>
            {betOptions.sex &&
              <div>
                <h3>Wird es ein</h3>
                <div>
                  <input type="radio" name="sexRadioButton" />
                  <span>&nbsp;</span>
                  Mädchen
                </div>
                <h3>oder ein</h3>
                <div>
                  <input type="radio" name="sexRadioButton" />
                  <span>&nbsp;</span>
                  Bub
                </div>
              </div>
            }
            {betOptions.birthday &&
              <div>
                <h3>Das Baby wird am</h3>
                <div>
                  <input type="date" />
                </div>
                <h3>geboren</h3>
              </div>
            }
            {betOptions.weight &&
              <div>
                <h3>Es wird wiegen</h3>
                <div>
                  <input type="number" min="0" />
                </div>
                <h3>Gramm</h3>
              </div>
            }
            {betOptions.size &&
              <div>
                <h3>Es wird</h3>
                <div>
                  <input type="number" min="0" />
                </div>
                <h3>Zentimeter groß sein</h3>
              </div>
            }
            <div>
              Dein Name:
              <span>&nbsp;</span>
              <input type="text" placeholder="Dein Name" />
            </div>
            <button>Wette abgeben</button>
          </>
        }
      </div>
    )
  }
}

export default withRouter(Page)