import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Slider, Tooltip, Typography, styled } from '@mui/material'
import { gradients } from '@thebadge/ui-library'
import { FieldError } from 'react-hook-form'

import { getDefaultConfigs } from '@/src/components/form/formFields/SeveritySelector/utilts'
import { TextFieldStatus } from '@/src/components/form/formFields/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { FormStatus } from '@/src/components/form/helpers/FormStatus'
import { DEFAULT_COURT_ID } from '@/src/constants/common'
import { useJurorFee } from '@/src/hooks/kleros/useJurorFee'
import { Severity, Severity_Keys } from '@/types/utils'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  width: '60%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

const CustomSlider = styled(Slider)({
  height: '5px',
  '& .MuiSlider-track': {
    background: gradients.gradientHeader,
    border: 'none',
  },
  '& .MuiSlider-rail': {
    background: 'grey',
  },
})

const marks = [
  {
    value: 1,
    label: Severity_Keys[0],
  },
  {
    value: 3,
    label: Severity_Keys[1],
  },
  {
    value: 5,
    label: Severity_Keys[2],
  },
]

type Props = {
  error?: FieldError & { amountOfJurors?: FieldError; challengeBounty?: FieldError }
  label?: string
  onChange: (value: any) => void
  placeholder?: string
  optionSelected: number
  onOptionSelectedChange: (value: number) => void
}

export default function SimpleView({
  error,
  label,
  onChange,
  onOptionSelectedChange,
  optionSelected,
  placeholder,
}: Props) {
  /**
   * Default Kleros court to use when creating a new badge model.
   * TODO: we should set a default court in the short-circuit to the Kleros's  general court.
   * TODO: Maybe use and env var?
   * In advance mode the user should be able to select the court.
   */
  const feeForJuror = useJurorFee(DEFAULT_COURT_ID)

  const hasInternalError = error?.amountOfJurors || error?.challengeBounty

  const handleChange = (e: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) {
      onOptionSelectedChange(newValue)
      onChange(getDefaultConfigs(newValue, feeForJuror.data))
    }
  }

  function valuetext(value: number) {
    return Severity[value]
  }

  function valueLabelFormat(value: number) {
    return Severity[value]
  }

  return (
    <Wrapper sx={{ px: 2 }}>
      <FormField
        formControl={
          <Box display="flex" flex={1} flexDirection="column" width="100%">
            <CustomSlider
              aria-label="Severity-court"
              color="secondary"
              defaultValue={30}
              getAriaValueText={valuetext}
              marks={marks}
              max={5}
              min={1}
              onChange={handleChange}
              step={2}
              sx={{
                minWidth: '200px',
              }}
              value={optionSelected}
              valueLabelDisplay="auto"
              valueLabelFormat={valueLabelFormat}
            />
          </Box>
        }
        label={
          <Typography color="text.disabled" ml={-2}>
            {label}
            {placeholder && (
              <Tooltip arrow title={placeholder}>
                <InfoOutlinedIcon sx={{ ml: 1 }} />
              </Tooltip>
            )}
          </Typography>
        }
        labelPosition={'top-left'}
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.message}
      />
      {hasInternalError && (
        <FormStatus status={TextFieldStatus.error}>{hasInternalError?.message}</FormStatus>
      )}
    </Wrapper>
  )
}
