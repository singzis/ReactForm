import React, { useContext, useEffect } from 'react'
import FormContext from './formContext'

interface FormItemProps {
  name: string
  children: React.ReactNode
}

const FormItem = ({ name, children }: FormItemProps) => {
  const { values, onValueChange, validateRegister } = useContext(FormContext)

  const handleChange = (value: any) => {
    onValueChange?.(name, value)
  }

  useEffect(() => {
    validateRegister?.(name, () => {
      if (!values[name]) {
        return 'Field is required'
      }
    })
  }, [name, values])

  return (
    <div>
      {children}
    </div>
  )
}

export default FormItem