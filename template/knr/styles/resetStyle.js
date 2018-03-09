import * as React from 'react'

export default () => {
  return <style>{`
    * {
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        margin: 0;
        padding: 0;
    }

    li, ol, ul {
        list-style: none;
    }

    address, cite, dfn, em, i, var {
        font-style: normal;
    }

    html {
        font-size: 23.4375px;
    }
  `}</style>
}