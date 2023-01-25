import { ReactElement, useCallback, useState } from 'react'

import { Typography } from '@mui/material'
import update from 'immutability-helper'
import { colors } from 'thebadge-ui-library'

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/BaseLayout'
import FormFieldCreator from '@/src/pagePartials/badgeTypes/FormFieldCreator'
import { MetadataColumn } from '@/src/utils/kleros/types'

const Create: NextPageWithLayout = () => {
  const [fields, setFields] = useState<MetadataColumn[]>([])

  function addFieldsHandler(data: MetadataColumn) {
    setFields((prev) => [...prev, data])
  }

  const moveField = useCallback((dragIndex: number, hoverIndex: number) => {
    setFields((prevFields: MetadataColumn[]) =>
      update(prevFields, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevFields[dragIndex] as MetadataColumn],
        ],
      }),
    )
  }, [])

  const removeField = useCallback((removeIndex: number) => {
    setFields((prevFields: MetadataColumn[]) =>
      update(prevFields, {
        $splice: [[removeIndex, 1]],
      }),
    )
  }, [])

  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.white} variant="h3">
        Please fulfill the form
      </Typography>

      <FormFieldCreator
        addField={addFieldsHandler}
        fields={fields}
        moveField={moveField}
        removeField={removeField}
      />
    </>
  )
}

Create.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Create
