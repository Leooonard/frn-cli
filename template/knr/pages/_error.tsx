/**
 * Creating a page named _error.js lets you override HTTP error messages
 */
import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import ErrorStyles from '../assets/styles/errorStyle'

export default class Error extends React.Component {
    errorCode: number;
    url: any

    constructor (props) {
        super(props);
        this.errorCode = props.errorCode;
        this.url = props.url;
    }

  static getInitialProps({res, xhr}) {
    const errorCode = res ? res.statusCode : (xhr ? xhr.status : null)
    return {errorCode}
  }

  render() {
    var response
    switch (this.errorCode) {
      case 200: // Also display a 404 if someone requests /_error explicitly
      case 404:
        response = (
          <div>
            <Head>
            </Head>
            <div className="errorPage">
              <h3>Page Not Found</h3>
              <p>The page <strong>{ this.url.pathname }</strong> does not exist.</p>
            </div>
            <ErrorStyles />
          </div>
        )
        break
      case 500:
        response = (
          <div>
            <Head>
            </Head>
            <div className="errorPage">
              <h1>Internal Server Error</h1>
              <p>An internal server error occurred.</p>
            </div>
            <ErrorStyles />
          </div>
        )
        break
      default:
        response = (
          <div>
            <Head>
            </Head>
            <div className="errorPage">
              <h1>HTTP { this.errorCode } Error</h1>
              <p>
                An <strong>HTTP { this.errorCode }</strong> error occurred while
                trying to access <strong>{ this.url.pathname }</strong>
              </p>
            </div>
            <ErrorStyles />
          </div>
        )
    }

    return response
  }

}
