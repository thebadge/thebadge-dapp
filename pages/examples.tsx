/* eslint-disable @next/next/no-img-element */
import { ReactElement } from 'react'

import type { NextPageWithLayout } from '@/pages/_app'

const LeftSidebarLayout: NextPageWithLayout = () => {
  return <>Example</>
}

LeftSidebarLayout.getLayout = function getLayout(page: ReactElement) {
  return <div>{page}</div>
}

export default LeftSidebarLayout
