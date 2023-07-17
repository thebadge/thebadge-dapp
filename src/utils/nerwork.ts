const isTestnet = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID == '5'
const isMainnet = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID == '100'

export { isMainnet, isTestnet }
