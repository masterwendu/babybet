import React from 'react'

export default class NewBet extends React.Component {
  state = {
    fields: {
      parent1: 'Wendelin',
      parent2: 'Peleska',
      plannedBirthDate: '17.05.2019',
      betOptions: {
        sex: true,
        birthday: false,
        weight: false,
        size: false,
      },
      betAmount: '1',
    }
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
      parent1,
      parent2,
      plannedBirthDate,
      betOptions: {
        sex,
        birthday,
        weight,
        size,
      },
      betAmount,
    } = this.state.fields

    if (
      !parent1 ||
      !parent2 ||
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
          const response = await fetch('/api/newbet', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.fields)
          })

          const created = await response.json()

          this.setState({
            loading: false,
            created,
          })
        } catch (e) {
          console.error(e)
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
    } = this.state

    return (
      <div>
        <h1>Babybet -  neue Wette</h1>
        {!loading && !created &&
          <div>
            <p>Neue Wette erstellen</p>

            <form onSubmit={this.submit}>
              <div>
                <h4>Namen der Eltern</h4>
                <label>
                  Elternteil 1
                  <br />
                  <input onChange={this.changeField('parent1')} value={this.state.fields.parent1} type="text" />
                </label>
                <br/>
                <label>
                  Elternteil 2
                  <br />
                  <input onChange={this.changeField('parent2')} value={this.state.fields.parent2} type="text" />
                </label>
              </div>
              <br />
              <div>
                <label>
                  Geburtstermin
                  <br />
                  <input onChange={this.changeField('plannedBirthDate')} value={this.state.fields.plannedBirthDate} type="date" />
                </label>
              </div>
              <br />
              <div>
                <label>
                  Geschlecht
                  <span>&nbsp;</span>
                  <input onChange={this.changeBetOptionField('sex')} checked={this.state.fields.betOptions.sex} type="checkbox" />
                </label>
              </div>
              <div>
                <label>
                  Geburtstag
                  <span>&nbsp;</span>
                  <input onChange={this.changeBetOptionField('birthday')} checked={this.state.fields.betOptions.birthday} type="checkbox" />
                </label>
              </div>
              <div>
                <label>
                  Gewicht [g]
                  <span>&nbsp;</span>
                  <input onChange={this.changeBetOptionField('weight')} checked={this.state.fields.betOptions.weight} type="checkbox" />
                </label>
              </div>
              <div>
                <label>
                  Größe [cm]
                  <span>&nbsp;</span>
                  <input onChange={this.changeBetOptionField('size')} checked={this.state.fields.betOptions.size} type="checkbox" />
                </label>
              </div>
              <br />
              <div>
                <label>
                  Wetteinsatz [€]
                  <br />
                  <input onChange={this.changeField('betAmount')} value={this.state.fields.betAmount} type="number" />
                </label>
              </div>
              <br />
              <div>
                <button type="submit">Erstellen</button>
              </div>
            </form>
          </div>
        }
        {loading &&
          <div>
            Babybet wird erstellt...
            <br />
            Bitte warten...
          </div>
        }
        {created &&
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
        }
      </div>
    )
  }
}
