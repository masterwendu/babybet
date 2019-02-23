import React from 'react'
import moment from 'moment'

export default class NewBet extends React.Component {
  state = {
    fields: {
      name: '',
      plannedBirthDate: moment().add(3, 'months').format('YYYY-MM-DD'),
      betOptions: {
        sex: true,
        birthday: false,
        weight: false,
        size: false,
      },
      betAmount: '1',
    },
  }

  changeField = (field) => ({ target: { value } }) => this.setState(({ fields }) => ({ fields: { ...fields, [field]: value } }))

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
          size,
        },
        betAmount,
      },
    } = this.state

    if (
      !name ||
      !plannedBirthDate ||
      !betAmount ||
      !(sex || birthday || weight || size)
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
          size,
        },
        betAmount,
      },
    } = this.state

    return (
      <div>
        <h1>Babybet -  neue Wette</h1>
        {!loading && !created && (
          <div>
            <p>Neue Wette erstellen</p>

            <form onSubmit={this.submit}>
              <div>
                <h4>Namen der Eltern</h4>
                <label htmlFor="inputName">
                  Name der Wette:
                  <br />
                  <input
                    name="inputName"
                    placeholder="Baby von Brangelina"
                    onChange={this.changeField('name')}
                    value={name}
                    type="text"
                  />
                </label>
              </div>
              <br />
              <div>
                <label htmlFor="inputPlannedBirthDate">
                  Geburtstermin
                  <br />
                  <input name="inputPlannedBirthDate" onChange={this.changeField('plannedBirthDate')} value={plannedBirthDate} type="date" />
                </label>
              </div>
              <br />
              <div>
                <label htmlFor="inputSex">
                  Geschlecht
                  <span>&nbsp;</span>
                  <input name="inputSex" onChange={this.changeBetOptionField('sex')} checked={sex} type="checkbox" />
                </label>
              </div>
              <div>
                <label htmlFor="inputPBirthday">
                  Geburtstag
                  <span>&nbsp;</span>
                  <input name="inputPBirthday" onChange={this.changeBetOptionField('birthday')} checked={birthday} type="checkbox" />
                </label>
              </div>
              <div>
                <label htmlFor="inputWeight">
                  Gewicht [g]
                  <span>&nbsp;</span>
                  <input name="inputWeight" onChange={this.changeBetOptionField('weight')} checked={weight} type="checkbox" />
                </label>
              </div>
              <div>
                <label htmlFor="inputSize">
                  Größe [cm]
                  <span>&nbsp;</span>
                  <input name="inputSize" onChange={this.changeBetOptionField('size')} checked={size} type="checkbox" />
                </label>
              </div>
              <br />
              <div>
                <label htmlFor="inputBetAmount">
                  Wetteinsatz [€]
                  <br />
                  <input name="inputBetAmount" onChange={this.changeField('betAmount')} value={betAmount} type="number" />
                </label>
              </div>
              <br />
              <div>
                <button type="submit">Erstellen</button>
              </div>
            </form>
          </div>
        )}
        {loading && (
          <div>
            Babybet wird erstellt...
            <br />
            Bitte warten...
          </div>
        )}
        {created && (
          <div>
            Babybet wurde erfolgreich erstellt
            <br />
            Url zum Wetten:
            <span>&nbsp;</span>
            <input type="text" readOnly defaultValue={`${window.location.host}/b/${created.id}`} />
            <br />
            Url zum Administrieren (nur für dich damit du die Wette beenden kannst, ändern oder löschen):
            <span>&nbsp;</span>
            <input type="text" readOnly defaultValue={`${window.location.host}/c/${created.adminId}`} />
          </div>
        )}
      </div>
    )
  }
}
