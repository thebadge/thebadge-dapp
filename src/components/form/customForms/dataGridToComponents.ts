import { DataGridMapping } from '@/src/components/form/customForms/type'
import CheckBoxWithTSForm from '@/src/components/form/formFields/tsFormFields/CheckBox'
import FileInputWithTSForm from '@/src/components/form/formFields/tsFormFields/FileInput'
import ImageInputWithTSForm from '@/src/components/form/formFields/tsFormFields/ImageInput'
import NumberFieldWithTSForm from '@/src/components/form/formFields/tsFormFields/NumberField'
import { TextAreaWithTSForm } from '@/src/components/form/formFields/tsFormFields/TextArea'
import { TextFieldWithTSForm } from '@/src/components/form/formFields/tsFormFields/TextField'

/**
 * Create the mapping btw each React component to a Position, this mapping is used
 * with @ts-react/form on CustomFormFromSchema. We MUST map just the KlerosSchema Types (KLEROS_LIST_TYPES)
 */
export const mappingDataGridForComponents: DataGridMapping[] = [
  [{ i: 'TextField', x: 0, y: 0, w: 3, h: 1 }, TextFieldWithTSForm],
  [{ i: 'CheckBox', x: 0, y: 0, w: 1, h: 1 }, CheckBoxWithTSForm],
  [{ i: 'NumberField', x: 0, y: 0, w: 3, h: 1 }, NumberFieldWithTSForm],
  [{ i: 'TextArea', x: 0, y: 0, w: 3, h: 3 }, TextAreaWithTSForm],
  [{ i: 'ImageInput', x: 0, y: 0, w: 3, h: 4 }, ImageInputWithTSForm],
  [{ i: 'FileInput', x: 0, y: 0, w: 3, h: 1 }, FileInputWithTSForm],
]
