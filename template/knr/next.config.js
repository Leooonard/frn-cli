const withTypescript  = require('@zeit/next-typescript')

const prefix = process.env.NODE_ENV === 'production' ? '/' : '/';
module.exports = withTypescript({
    assetPrefix: prefix
})
