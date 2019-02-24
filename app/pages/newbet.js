import React from 'react'
import moment from 'moment'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Copy as CopyIcon } from 'styled-icons/boxicons-solid'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import PageWrapper from '../components/Page'

export default class NewBet extends React.Component {
  state = {
    fields: {
      name: '',
      plannedBirthDate: moment().add(3, 'months').format('YYYY-MM-DD'),
      betOptions: {
        sex: true,
        birthday: false,
        weight: false,
        babyName: false,
        size: false,
      },
      betAmount: '1',
    },
  }

  changeField = (field) => ({ target: { value } }) => {
    if (field !== 'plannedBirthDate' || value) {
      this.setState(({ fields }) => ({ fields: { ...fields, [field]: value } }))
    }
  }

  changeBetOptionField = (field) => ({ target: { checked } }) => this.setState(({ fields }) => {
    const { betOptions } = fields
    return {
      fields: {
        ...fields,
        betOptions: {
          ...betOptions,
          [field]: checked,
        },
      },
    }
  })

  validateFields = () => {
    const {
      fields: {
        name,
        plannedBirthDate,
        betOptions: {
          sex,
          birthday,
          weight,
          babyName,
          size,
        },
        betAmount,
      },
    } = this.state

    if (
      !name ||
      !plannedBirthDate ||
      !betAmount ||
      !(sex || birthday || weight || size || babyName)
    ) {
      return false
    }

    return true
  }

  submit = (e) => {
    e.preventDefault()
    if (this.validateFields()) {
      this.setState({
        loading: true,
      }, async () => {
        try {
          const { fields } = this.state

          fields.betAmount = Number(fields.betAmount.replace(',', '.'))

          const response = await fetch('/api/bet', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fields),
          })

          const created = await response.json()

          this.setState({
            loading: false,
            created,
          })
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
          this.setState({
            loading: false,
          })
        }
      })
    }
  }

  copyBetUrl = () => {
    toast.info('Wett URL ist jetzt in deiner Zwischenablage gespeichert', {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  copyAdminUrl = () => {
    toast.info('Admin URL ist jetzt in deiner Zwischenablage gespeichert', {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  render() {
    const {
      loading,
      created,
      fields: {
        name,
        plannedBirthDate,
        betOptions: {
          sex,
          birthday,
          weight,
          babyName,
          size,
        },
        betAmount,
      },
    } = this.state

    let betUrl = ''
    let betAdminUrl = ''
    if (created && typeof window !== 'undefined') {
      betUrl = `${window.location.host}/b/${created.id}`
      betAdminUrl = `${window.location.host}/c/${created.adminId}`
    }

    return (
      <PageWrapper>
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <h1>Babybet -  neue Wette</h1>
        {!loading && !created && (
          <div>
            <h3>Neue Wette erstellen</h3>
            <p>
              Wenn du eine Babywette erstellst bitte denke vorher gut darüber nach.
              Frage auf jeden Fall immer beide Eltern des Kindes um Erlaubnis und vergewissere dich dass es wirklich ok ist auf ihr ungeborenes zu wetten.
            </p>
            <p>
              Eine Wette kann auch einen Wetteinsatz haben, dieser ist rein privat und den Personen welche an der Wette teilnehmen. Es gibt keinen Rechtsanspruch auf Geld und Babybet.de dient nur als Hilfsmittel für die Wette, kann aber keine Schulden eintreiben.
            </p>

            <form onSubmit={this.submit}>
              <div>
                <label htmlFor="inputName">
                  Name der Wette:
                </label>
                <br />
                <input
                  id="inputName"
                  placeholder="Baby von Brangelina"
                  onChange={this.changeField('name')}
                  value={name}
                  type="text"
                />
              </div>
              <br />
              <div>
                <label htmlFor="inputPlannedBirthDate">
                  Geburtstermin
                  <br />
                </label>
                <input id="inputPlannedBirthDate" onChange={this.changeField('plannedBirthDate')} value={plannedBirthDate} type="date" />
              </div>
              <br />
              <h4>Welche Wettoption möchtest du aktivieren?</h4>
              <div>
                <input id="inputSex" onChange={this.changeBetOptionField('sex')} checked={sex} type="checkbox" />
                <label htmlFor="inputSex">
                  <span>&nbsp;</span>
                  Geschlecht
                </label>
              </div>
              <div>
                <input id="inputPBirthday" onChange={this.changeBetOptionField('birthday')} checked={birthday} type="checkbox" />
                <label htmlFor="inputPBirthday">
                  <span>&nbsp;</span>
                  Geburtstag
                </label>
              </div>
              <div>
                <input id="inputWeight" onChange={this.changeBetOptionField('weight')} checked={weight} type="checkbox" />
                <label htmlFor="inputWeight">
                  <span>&nbsp;</span>
                  Gewicht [g]
                </label>
              </div>
              <div>
                <input id="inputSize" onChange={this.changeBetOptionField('size')} checked={size} type="checkbox" />
                <label htmlFor="inputSize">
                  <span>&nbsp;</span>
                  Größe [cm]
                </label>
              </div>
              <div>
                <input id="inputBabyName" onChange={this.changeBetOptionField('babyName')} checked={babyName} type="checkbox" />
                <label htmlFor="inputBabyName">
                  <span>&nbsp;</span>
                  Name des Babies
                </label>
              </div>
              <br />
              <div>
                <label htmlFor="inputBetAmount">
                  Wetteinsatz [€]
                </label>
                <br />
                <input step="0.01" min="0" id="inputBetAmount" onChange={this.changeField('betAmount')} value={betAmount} type="number" />
              </div>
              <br />
              <div>
                <button
                  disabled={
                    !name || (
                      !sex && !weight && !size && !birthday && !babyName
                    )
                  }
                  type="submit"
                >
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        )}
        {loading && (
          <h3>
            Babybet wird erstellt...
            <br />
            Bitte warten...
          </h3>
        )}
        {created && (
          <div>
            <h3>Babybet wurde erfolgreich erstellt</h3>
            <h4>Url zum Wetten:</h4>
            <p>Sende diese URL zu deinen Freunden damit sie mitspielen können</p>
            <input className="copyUrlInput" type="text" readOnly defaultValue={betUrl} />
            <CopyToClipboard onCopy={this.copyBetUrl} text={betUrl}>
              <button className="copyUrlButton" type="button">
                <CopyIcon size="16" title="In die Zwischenablage kopieren" />
              </button>
            </CopyToClipboard>
            <h4>Url zum Administrieren</h4>
            <p>Nur für dich damit du die Wette beenden kannst, ändern oder löschen, bitte speichere diesen Link ab, damit du später die Wette auflösen kannst.</p>
            <input className="copyUrlInput" type="text" readOnly defaultValue={betAdminUrl} />
            <CopyToClipboard onCopy={this.copyAdminUrl} text={betUrl}>
              <button className="copyUrlButton" type="button">
                <CopyIcon size="16" title="In die Zwischenablage kopieren" />
              </button>
            </CopyToClipboard>
          </div>
        )}
      </PageWrapper>
    )
  }
}
