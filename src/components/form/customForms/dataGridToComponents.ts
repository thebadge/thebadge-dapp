import AvatarInput from '@/src/components/form/AvatarInput'
import CheckBox from '@/src/components/form/CheckBox'
import DescriptionInputField from '@/src/components/form/DescriptionInputField'
import DropdownSelect from '@/src/components/form/DropdownSelect'
import ExpirationField from '@/src/components/form/ExpirationField'
import FileInput from '@/src/components/form/FileInput'
import ImageInput from '@/src/components/form/ImageInput'
import NumberField from '@/src/components/form/NumberField'
import SeveritySelector from '@/src/components/form/SeveritySelector'
import TextArea from '@/src/components/form/TextArea'
import TextField from '@/src/components/form/TextField'
import TokenInput from '@/src/components/form/TokenInput'
import { DataGridMapping } from '@/src/components/form/customForms/type'
import KlerosDynamicFieldsCreator from '@/src/components/form/klerosDynamicFormField/FormFieldCreator'

export const mappingDataGridForComponents: DataGridMapping[] = [
  [{ i: 'TextField', x: 0, y: 0, w: 3, h: 1 }, TextField],
  [{ i: 'CheckBox', x: 0, y: 0, w: 1, h: 1 }, CheckBox],
  [{ i: 'NumberField', x: 0, y: 0, w: 3, h: 1 }, NumberField],
  [{ i: 'TextArea', x: 0, y: 0, w: 3, h: 3 }, TextArea],
  [{ i: 'DescriptionInputField', x: 0, y: 1, w: 3, h: 3 }, DescriptionInputField],
  [{ i: 'ImageInput', x: 0, y: 0, w: 3, h: 3 }, ImageInput],
  [{ i: 'AvatarInput', x: 0, y: 0, w: 3, h: 3 }, AvatarInput],
  [{ i: 'FileInput', x: 0, y: 0, w: 3, h: 1 }, FileInput],
  [{ i: 'TokenInput', x: 0, y: 0, w: 3, h: 1 }, TokenInput],
  [{ i: 'DropdownSelect', x: 0, y: 0, w: 3, h: 1 }, DropdownSelect],
  [{ i: 'KlerosDynamicFieldsCreator', x: 0, y: 0, w: 4, h: 4 }, KlerosDynamicFieldsCreator],
  [{ i: 'SeveritySelector', x: 0, y: 0, w: 3, h: 1 }, SeveritySelector],
  [{ i: 'ExpirationField', x: 0, y: 0, w: 3, h: 1 }, ExpirationField],
]
