import Document, { Head, Main, NextScript } from 'next/document'
import ResetStyle from '../assets/styles/resetStyle'
import * as React from 'react'
// import DebuggerStone from '../../debugger'

export default class MyDocument extends Document {
//   static getInitialProps({ renderPage }) {
//     const { html, head, errorHtml, chunks } = renderPage()
//     return { html, head, errorHtml, chunks }
//   }

  render() {
    /**
    * Here we use _document.js to add a "lang" propery to the HTML object if
    * one is set on the page.
    **/
    return (
      <html lang={this.props.__NEXT_DATA__.props.lang || 'en'}>
        <head>
            <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <meta content="telephone=no" name="format-detection" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta charSet="utf-8" />
            <ResetStyle />
            <script src='//webresource.c-ctrip.com/code/lizard/2.2/web/3rdlibs/bridge.js'></script>
            <script src='//webresource.c-ctrip.com/code/lizard/2.2/web/lizard.lite.min.js'></script>
            <script src='//pages.ctrip.com/public/Insurance/flight_insurance/asset/zepto.js'></script>
        </head>
        <body>
            <Main />
            <NextScript />
        </body>
      </html>
    )
  }
}