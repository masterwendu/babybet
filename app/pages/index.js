import React from 'react'
import uuid from 'uuid/v4'
import axios from 'axios'
import Link from 'next/link'
import PageWrapper from '../components/Page'

class Page extends React.Component {
  constructor(props) {
    super(props)

    let loading = false
    const client = typeof localStorage !== 'undefined'

    if (client) {
      let uniqueBrowserId = localStorage.getItem('browserId')

      if (!uniqueBrowserId) {
        uniqueBrowserId = uuid()
        localStorage.setItem('browserId', uniqueBrowserId)
      } else {
        loading = true
        this.getListForBrowser(uniqueBrowserId)
      }
    }

    this.state = {
      loading,
    }
  }

  getListForBrowser = async (uniqueBrowserId) => {
    const { data: bets } = await axios({
      method: 'get',
      url: `/api/myBets/${uniqueBrowserId}`,
    })
    this.setState({
      loading: false,
      bets,
    })
  }

  render() {
    const {
      loading,
      bets,
    } = this.state

    return (
      <PageWrapper>
        <p>Hallo bei Babybet</p>
        <div>
          <Link href="/newbet">
            <button type="button">Neue Wette erstellen</button>
          </Link>
        </div>
        {loading && (
          <h3>Deine Wetten werden geladen...</h3>
        )}
        <div>
          {!loading && bets && !!bets.length && (
            <div>
              <h2>Deine Wetten: </h2>
              {bets.map((bet, k) => (
                <div key={`myBet${k}`}>
                  <div>
                    <b>{bet.name}</b>
                    <br />
                    <i>
                      {bet.closed ?
                        <span>Wette beendet</span> :
                        (
                          <span>
                            <span>Wette l&auml;uft,&nbsp;</span>
                            {bet.numberOfBets}
                            <span>&nbsp;Wette</span>
                            {bet.numberOfBets !== 1 && 'n'}
                            <span>&nbsp;abgegeben</span>
                          </span>
                        )
                      }
                    </i>
                    {bet.closed && bet.won && (
                      <div>
                        <b>
                          <span>Du hast&nbsp;</span>
                          {bet.winnersAmount}
                          <span>&nbsp;Euro gewonnen!</span>
                        </b>
                      </div>
                    )}
                    {bet.closed && !bet.won && (
                      <div>
                        <b>Du hast leider nichts gewonnen!</b>
                      </div>
                    )}
                  </div>
                  <Link href={`/b/${bet._id}`}>
                    <a>
                      {'=>'}
                      <span>&nbsp;Wette ansehen</span>
                    </a>
                  </Link>
                  <br />
                  {bet.adminId && (
                    <>
                      <Link href={`/ba/${bet.adminId}`}>
                        <a>
                          {'==>'}
                          <span>&nbsp;Wette administrieren</span>
                        </a>
                      </Link>
                      <br />
                    </>
                  )}
                  <br />
                </div>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    )
  }
}

export default Page
