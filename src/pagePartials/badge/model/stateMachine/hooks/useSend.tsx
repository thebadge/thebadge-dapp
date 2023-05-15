import { useContext } from 'react'

import { CreateModelMachineContext } from '../context/createModelContext'

export default function useSend() {
  const service = useContext(CreateModelMachineContext)
  // Get `send()` method from a service
  const { send } = service.createService

  return send
}
