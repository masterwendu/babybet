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
        <h1>Babybet</h1>
        <p>Hallo bei Babybet</p>
        <Link href="/newbet">
          <a>Wette erstellen</a>
        </Link>
        <div>
          {loading &&
            <h4>Deine Wetten werden geladen...</h4>
          }
          {!loading && bets && !!bets.length && (
            <div>
              <h2>Deine Wetten: </h2>
              {bets.map((bet) => (
                <div>
                  <h4>
                    {bet.name}
                    {bet.closed && ' (Wette beendet)'}
                    <span>&nbsp;</span>
                    {!bet.closed && (
                      <>
                        <span>(Wette läuft,&nbsp;</span>
                        {bet.numberOfBets}
                        <span>&nbsp;Wetten abgegeben)</span>
                      </>
                    )}
                    {bet.closed && bet.won && (
                      <>
                        <h4>
                          <span>Du hast&nbsp;</span>
                          {bet.winnersAmount}
                          <span>&nbsp;Euro gewonnen!</span>
                        </h4>
                      </>
                    )}
                    {bet.closed && !bet.won && (
                      <>
                        <h4>Du hast leider nichts gewonnen!</h4>
                      </>
                    )}
                  </h4>
                  <Link href={`/b/${bet._id}`}>
                    <a>Wette ansehen</a>
                  </Link>
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
