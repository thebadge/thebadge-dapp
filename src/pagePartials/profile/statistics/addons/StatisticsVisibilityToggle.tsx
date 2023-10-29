import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import { Checkbox, Menu, MenuItem, MenuList, Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'

import { StatisticVisibility } from '@/src/hooks/nextjs/useStatisticsVisibility'
export const StatisticVisibilityToggle = ({
  anchorEl,
  onClose,
  toggleVisibility,
  visibility,
}: {
  anchorEl: Element | null
  onClose: VoidFunction
  visibility: StatisticVisibility
  toggleVisibility: (category: string) => void
}) => {
  const { t } = useTranslation()

  return (
    <Menu
      anchorEl={anchorEl}
      onClose={onClose}
      open={!!anchorEl}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            maxHeight: 230,
            overflow: 'visible',
            overflowY: 'scroll',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
          },
        },
      }}
      sx={{ maxWidth: 'none' }}
    >
      <MenuList dense sx={{ p: 0 }}>
        {Object.keys(visibility).map((columnName) => {
          return (
            <MenuItem key={columnName} onClick={() => toggleVisibility(columnName)}>
              <Checkbox
                checked={visibility[columnName]}
                checkedIcon={<PushPinIcon />}
                icon={<PushPinOutlinedIcon />}
                onClick={() => toggleVisibility(columnName)}
              />
              <Typography sx={{ width: '100%' }} variant="body2">
                {t(`profile.statistics.visibility.${columnName}`)}
              </Typography>
            </MenuItem>
          )
        })}
      </MenuList>
    </Menu>
  )
}
