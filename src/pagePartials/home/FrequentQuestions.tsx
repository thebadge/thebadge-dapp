import AddIcon from '@mui/icons-material/Add'
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import { DOCS_URL } from '@/src/constants/common'
import { useSectionReferences } from '@/src/providers/referencesProvider'

const options = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5']

export default function FrequentQuestions() {
  const { frequentQuestionsSection } = useSectionReferences()
  const { t } = useTranslation()

  return (
    <Box
      alignItems={'center'}
      display={'flex'}
      flex={1}
      flexDirection={'column'}
      paddingY={6}
      ref={frequentQuestionsSection}
    >
      <Typography color={colors.pink} fontSize={'20px !important'} lineHeight={'26px'}>
        {t(`home.faqs.title`)}
      </Typography>
      {options.map((data, i) => {
        return (
          <Accordion
            key={data}
            sx={{
              width: '70%',
              background: 'transparent',
              boxShadow: 'none',
              borderTop: `${i === 0 ? 'none' : '1px solid #828282'}`,
            }}
          >
            <AccordionSummary expandIcon={<AddIcon />} sx={{ padding: '0' }}>
              <Typography fontSize={'15px !important'} fontWeight={500} lineHeight={'30px'}>
                {t(`home.faqs.${data}.title`)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingLeft: '0' }}>
              <Typography fontSize={'14px !important'} fontWeight={400} lineHeight={'16px'}>
                {t(`home.faqs.${data}.description`)}
                <a
                  href={`${DOCS_URL}/${t(`home.faqs.${data}.documentation`)}`}
                  rel="noreferrer"
                  style={{ textDecoration: 'underline' }}
                  target="_blank"
                >
                  {t(`home.faqs.moreInfo`)}
                </a>
              </Typography>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Box>
  )
}
