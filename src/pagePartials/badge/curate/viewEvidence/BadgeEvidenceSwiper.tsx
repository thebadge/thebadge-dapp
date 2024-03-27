'use client'
import React from 'react'

import { Box } from '@mui/material'

import DisplayEvidenceField from '@/src/components/displayEvidence/DisplayEvidenceField'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { getEvidenceValue } from '@/src/utils/kleros/getEvidenceValue'
import { BadgeEvidenceMetadata } from '@/types/badges/BadgeMetadata'
import { ChainsValues } from '@/types/chains'

/**
 *
 * @param badgeEvidence
 * @param networkId - Is required because we use this same component on /evidence that is rendered with SRR and no wallet
 * @constructor
 */
export default function BadgeEvidenceSwiper({
  badgeEvidence,
  networkId,
}: {
  badgeEvidence?: BadgeEvidenceMetadata
  networkId: ChainsValues
}) {
  return (
    <Box m={2}>
      <TBSwiper
        items={
          badgeEvidence?.columns.map((column, index) => (
            <Box
              key={'evidence-' + index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                marginTop: 4,
                marginBottom: 4,
                width: '100%',
                '> *': {
                  width: '90%',
                  display: 'flex',
                },
              }}
            >
              <SafeSuspense>
                <DisplayEvidenceField
                  columnItem={column}
                  networkId={networkId}
                  value={getEvidenceValue(
                    badgeEvidence?.values,
                    badgeEvidence?.columns,
                    column.label,
                    column.type,
                  )}
                />
              </SafeSuspense>
            </Box>
          )) || []
        }
        maxSlidesPerView={1}
        spaceBetween={8}
      />
    </Box>
  )
}
