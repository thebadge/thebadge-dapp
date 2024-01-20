import { useEffect, useMemo, useState } from 'react'

import { useTokenIcons } from '@/src/providers/tokenIconsProvider'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { Token } from '@/types/token'

export const useTokensLists = (onChange?: (token: Token | null) => void) => {
  const { readOnlyChainId } = useWeb3Connection()
  const [token, setToken] = useState<Token | null>(null)
  const { tokensByNetwork } = useTokenIcons()
  const tokens = useMemo(
    () => tokensByNetwork[readOnlyChainId] || [],
    [readOnlyChainId, tokensByNetwork],
  )
  const [tokensList, setTokensList] = useState(tokens)
  const [searchString, setSearchString] = useState('')

  const onSelectToken = (token: Token | null) => {
    setToken(token)

    if (typeof onChange !== 'undefined') {
      onChange(token)
    }
  }

  useEffect(() => {
    if (searchString.length === 0) {
      setTokensList(tokens)
    } else {
      setTokensList(
        tokens.filter(
          (item) => item.symbol.toLowerCase().indexOf(searchString.toLowerCase()) !== -1,
        ),
      )
    }
  }, [tokens, searchString])

  return {
    token,
    tokensList,
    onSelectToken,
    searchString,
    setSearchString,
  }
}
