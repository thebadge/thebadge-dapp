import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { Box, Divider, IconButton, Tooltip, Typography, styled } from '@mui/material'
import { colors } from 'thebadge-ui-library'

const Wrapper = styled(Box)(() => ({
  gap: 1,
  display: 'flex',
  flexDirection: 'row',
  minWidth: '100%',
  maxWidth: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
}))

type DisplayFileProps = {
  label?: string
  placeholder?: string
  value: { data_url: string }
}

export function DisplayFile({ label, placeholder, value }: DisplayFileProps) {
  console.log(value)
  function openTabWithFile() {
    const openedTab = window.open('about:blank')

    setTimeout(function () {
      if (openedTab) {
        //FireFox seems to require a setTimeout for this to work.
        const frame = openedTab.document.createElement('iframe')
        openedTab.document.body.appendChild(frame).src = `${value.data_url}`
        frame.setAttribute('style', 'height: 100%; width: 100%')
      }
    }, 0)
  }
  return (
    <>
      <Wrapper>
        <Typography>
          {label}
          {placeholder && (
            <Tooltip arrow title={placeholder}>
              <InfoOutlinedIcon sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </Typography>
        <IconButton onClick={openTabWithFile}>
          <OpenInNewOutlinedIcon />
        </IconButton>
      </Wrapper>
      <Divider color={colors.white} />
    </>
  )
}
