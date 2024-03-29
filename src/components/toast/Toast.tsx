import { Toast, ToastPosition, Toaster, toast } from 'react-hot-toast'

import { Failed as FailedIcon } from '@/src/components/assets/Failed'
import { Success as SuccessIcon } from '@/src/components/assets/Success'
import { Spinner } from '@/src/components/loading/Spinner'
import { ToastComponent } from '@/src/components/toast/ToastComponent'
import { ToastStates } from '@/types/toast'

type ToastComponentProps = {
  t: Toast
  explorerUrl?: string
  message?: string
  title?: string
}

type ToastTypes = {
  [ToastStates.waiting]: ({ explorerUrl, message, t }: ToastComponentProps) => JSX.Element
  [ToastStates.failed]: ({ explorerUrl, message, t }: ToastComponentProps) => JSX.Element
  [ToastStates.success]: ({ explorerUrl, message, t }: ToastComponentProps) => JSX.Element
  [ToastStates.info]: ({ explorerUrl, message, t }: ToastComponentProps) => JSX.Element
  [ToastStates.infoFailed]: ({ explorerUrl, message, t }: ToastComponentProps) => JSX.Element
}

const ToastTypes: ToastTypes = {
  [ToastStates.waiting]: ({ explorerUrl, message, t }: ToastComponentProps) => (
    <ToastComponent
      icon={<Spinner />}
      link={explorerUrl ? { url: explorerUrl, text: 'Click to verify on explorer' } : undefined}
      message={message ? message : undefined}
      t={t}
      title="Transaction Sent"
    />
  ),
  [ToastStates.failed]: ({ explorerUrl, message, t }: ToastComponentProps) => (
    <ToastComponent
      icon={<FailedIcon />}
      link={explorerUrl ? { url: explorerUrl, text: 'Click to see on explorer' } : undefined}
      message={message ? message : undefined}
      t={t}
      title="Transaction Failed"
    />
  ),
  [ToastStates.success]: ({ explorerUrl, message, t }: ToastComponentProps) => (
    <ToastComponent
      icon={<SuccessIcon />}
      link={explorerUrl ? { url: explorerUrl, text: 'Click to verify on explorer' } : undefined}
      message={message ? message : undefined}
      t={t}
      title="Transaction confirmed"
    />
  ),
  [ToastStates.info]: ({ message, t, title }: ToastComponentProps) => (
    <ToastComponent
      icon={<SuccessIcon />}
      message={message ? message : undefined}
      t={t}
      title={title}
    />
  ),
  [ToastStates.infoFailed]: ({ message, t, title }: ToastComponentProps) => (
    <ToastComponent
      icon={<FailedIcon />}
      message={message ? message : undefined}
      t={t}
      title={title}
    />
  ),
}

const notify = ({
  explorerUrl,
  id,
  message,
  position = 'bottom-right',
  title,
  type,
}: {
  explorerUrl?: string
  message?: string
  title?: string
  type: ToastStates
  id?: string | undefined
  position?: ToastPosition
}) =>
  toast.custom((t: Toast) => ToastTypes[type]({ t, explorerUrl, message, title }), { id, position })

const Toast = (props: { position?: ToastPosition }) => (
  <Toaster
    position={props.position || 'bottom-right'}
    toastOptions={{
      duration: 10000,
    }}
  />
)

export default Toast
export { notify }
