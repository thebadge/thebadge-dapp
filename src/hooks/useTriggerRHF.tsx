import { useCallback } from 'react'

import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

type TriggerValidationFn = (stepName: string | string[] | undefined) => Promise<boolean>
/**
 * Hook that receives all the methods returned by useFormContext, to isolate and
 * allow to trigger of a specific field validation. Returns true or false if
 * the valid or not
 * @param methods
 */
export function useTriggerRHF<
  TFieldValues extends FieldValues = Record<string, any>,
  TContext = any,
>(methods: UseFormReturn<TFieldValues, TContext>) {
  return useCallback<TriggerValidationFn>(
    async (stepName) => {
      return methods.trigger(stepName as Path<TFieldValues> | Path<TFieldValues>[])
    },
    [methods],
  )
}
