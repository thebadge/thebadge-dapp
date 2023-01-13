import { ReactElement, useReducer } from 'react'

import { Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { RegisterFormData } from './types'
import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/BaseLayout'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { TheBadge__factory } from '@/types/generated/typechain'

const Register: NextPageWithLayout = () => {
  const { isAppConnected } = useWeb3Connection()
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

  const [formData, setFormData] = useReducer(
    (data: RegisterFormData, partialData: Partial<RegisterFormData>) => ({
      ...data,
      ...partialData,
    }),
    {
      hash: '',
    },
  )

  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.white} variant="h3">
        Please fulfill the form
      </Typography>
    </>
  )
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Register
