import AddIcon from '@mui/icons-material/Add'
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import { useSectionReferences } from '@/src/providers/referencesProvider'

const options = ['FAQ1', 'FAQ2', 'FAQ3', 'FAQ4', 'FAQ5']

export default function FrequentQuestions() {
  const { frecuentQuestionsSection } = useSectionReferences()
  const { t } = useTranslation()

  return (
    <Box
      alignItems={'center'}
      display={'flex'}
      flex={1}
      flexDirection={'column'}
      paddingY={6}
      ref={frecuentQuestionsSection}
    >
      <Typography color={colors.pink} fontSize={'20px !important'} lineHeight={'26px'}>
        FAQs
      </Typography>
      {options.map((data) => {
        return (
          <Accordion
            key={data}
            style={{ width: '70%', background: 'transparent', boxShadow: 'none' }}
          >
            <AccordionSummary expandIcon={<AddIcon />}>
              <Typography fontSize={'15px !important'} fontWeight={500} lineHeight={'20px'}>
                {t(`home.FAQs.${data}.title`)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography fontSize={'14px !important'} fontWeight={400} lineHeight={'16px'}>
                {t(`home.FAQs.${data}.description`)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Box>
  )
}
