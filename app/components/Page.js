import React from 'react'
import PropTypes from 'prop-types'
import styled, { createGlobalStyle } from 'styled-components'
import Head from 'next/head'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
  a, a:visited, a:active {
    color: white;
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
    &[type='checkbox'] {
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
      width: calc(100% - 62px);
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
    &:disabled, &[disabled] {
      background: grey;
      cursor: not-allowed;
      box-shadow: none;
      &:hover {
        box-shadow: none;
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
`

const Wrapper = styled.div`
  text-align: center;
  background: black;
  color: white;
  position: absolute;
  width: 100%;
  min-height: 100%;
`
const Content = styled.div`
  position: relative;
  display: inline-block;
  text-align: left;
  max-width: 600px;
  margin: 10px;
  padding: 10px;
`

const Page = ({ children }) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="robots" content="noindex,nofollow,noarchive" />
      <title>Babybet</title>
    </Head>
    <Wrapper>
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
