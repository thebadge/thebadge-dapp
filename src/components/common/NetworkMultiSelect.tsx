import { useState } from 'react'

import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  Select as MUISelect,
  MenuItem,
  OutlinedInput,
  styled,
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select/SelectInput'

import { ChainName, Chains } from '@/src/config/web3'
import { capitalizeFirstLetter } from '@/src/utils/strings'
import { ChainsValues } from '@/types/chains'
import { CallbackFunction } from '@/types/utils'

const StyledSelect = styled(MUISelect<ChainsValues[]>)(() => ({
  fontSize: '1rem',
  width: 'auto',
  '& .MuiInputBase-input': {
    fontSize: '1rem',
    padding: '12px 12px',
  },
  '& > fieldset > legend': {
    fontSize: '2em',
  },
}))
const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: '1rem !important',
}))

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export default function NetworkMultiSelect({
  initialValue = [],
  onChange,
}: {
  initialValue: ChainsValues[]
  onChange: CallbackFunction<ChainsValues[]>
}) {
  const [chainIds, setChainIds] = useState<ChainsValues[]>(initialValue)

  const handleChange = (event: SelectChangeEvent<typeof chainIds>) => {
    const {
      target: { value },
    } = event
    const newValue =
      typeof value === 'string' ? value.split(',').map((v) => Number(v) as ChainsValues) : value
    setChainIds(
      // On autofill we get a stringified value.
      newValue,
    )
    onChange(newValue)
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="multiple-checkbox-label">Networks</InputLabel>
        <StyledSelect
          MenuProps={MenuProps}
          id="multiple-checkbox-chains"
          input={<OutlinedInput label="Tag" />}
          labelId="multiple-checkbox-label"
          multiple
          onChange={handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((id) => (
                <Chip key={id} label={capitalizeFirstLetter(ChainName[id])} size="small" />
              ))}
            </Box>
          )}
          value={chainIds}
        >
          {Object.values(Chains).map((id) => (
            <StyledMenuItem key={id} value={id}>
              <Checkbox checked={chainIds.indexOf(id) > -1} sx={{ padding: '0px 6px' }} />
              <ListItemText primary={capitalizeFirstLetter(ChainName[id])} />
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </div>
  )
}
