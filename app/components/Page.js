import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import styled, { createGlobalStyle } from 'styled-components'
import { Baby as BabyIcon } from 'styled-icons/fa-solid'
import Head from 'next/head'

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    background: black;
    color: white;
    @media (prefers-color-scheme: light) {
      background: white;
      color: black;
    }

  }
  a, a:visited, a:active {
    color: inherit;
  }

  label {
    cursor: pointer;
  }

  input {
    border: 1px solid white;
    color: white;
    background: black;
    padding: 5px;

    &::placeholder {
      color: #9b9b9b;
    }
    width: calc(100% - 12px);
    &[type='checkbox'], &[type='radio'] {
      width: auto;
      &:focus {
        box-shadow: none;
      }
    }
    
    transition: box-shadow 0.3s;
    outline: none;

    &:focus {
      border: 1px solid white;
      box-shadow: 0px 0px 6px 3px white;
    }

    &.copyUrlInput {
      width: calc(100% - 64px);
    }

    @media (prefers-color-scheme: light) {
      background: white;
      color: black;
      border-color: #222;
      &:focus {
        border-color: #222;
        box-shadow: 0px 0px 6px 3px #999;
      }
    }
  }

  button {
    border: 1px solid black;
    border-radius: 5px;
    padding: 8px;
    background: white;
    color: black;
    cursor: pointer;
    width: 100%;
    box-shadow: 0px 0px 6px 1px white;
    transition: box-shadow 0.6s, background 0.4s;

    &:hover {
      box-shadow: 1px 1px 12px 6px #cac1c1;
    }
    &:disabled {
      background: grey;
      cursor: not-allowed;
      box-shadow: none;
      &:hover {
        box-shadow: none;
      }
    }

    @media (prefers-color-scheme: light) {
      background: white;
      color: black;
      &:disabled {
        background: #ecf0f1;
      }
    }

    &.copyUrlButton {
      width: 50px;
    }
    &.Toastify__close-button {
      width: auto;
      box-shadow: none;
      &:hover {
        box-shadow: none;
      }
    }
  }


  .copyUrlWrapper {
    display: flex;
    align-items: flex-start;
    width: calc(100% - 64px);
    color: inherit;
    background-color: inherit;

    .copyUrl {
      display: inline-block;
      width: calc(100% - 64px);
      border: 1px solid white;
      padding: 6px;
      text-decoration: underline;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-color: inherit;
      margin-right: 10px;
      color: inherit;
      background-color: inherit;
      a {
        color: inherit;
        background-color: inherit;
      }
    }
  }
`

const Wrapper = styled.div`
  text-align: center;
  background: inherit;
  color: inherit;
  position: inherit;
  width: 100%;
  min-height: 100%;

  a.h1 {
    text-decoration: none;
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    color: inherit;
    background-color: inherit;
  }
`
const Content = styled.div`
  position: relative;
  display: inline-block;
  text-align: left;
  max-width: 600px;
  margin: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
`

const Page = ({ children }) => (
  <>
    <Head>
      <meta httpEquiv="content-type" content="text/html; charset=utf-8"></meta>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="robots" content="noindex,nofollow,noarchive" />
      <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" />
      <link rel="icon" href="/static/favicon.ico" type="image/x-icon" />
      <title>Babybet</title>
    </Head>
    <Wrapper>
      <Link href="/">
        <a className="h1">
          <BabyIcon size="37" />
          <span>&nbsp;Babybet</span>
        </a>
      </Link>
      <Content>
        {children}
      </Content>
      <GlobalStyle />
    </Wrapper>
  </>
)

Page.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Page
