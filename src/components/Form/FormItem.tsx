import React, { useContext, useEffect, useState } from 'react'
import Schema from 'async-validator'
import clsx from 'clsx'
import FormContext from './FormContext'

interface FormItemProps {
  name?: string
  className?: string
  style?: React.CSSProperties
  label?: React.ReactNode
  valuePropName?: string
  rules?: Record<string, any>[]
  children?: React.ReactElement
}

const getValueFromEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { target } = e
  return target.type === 'checkbox' ? target.checked : target.value
}

const FormItem = ({
  name,
  children,
  className,
  style,
  valuePropName,
  rules,
  label,
}: FormItemProps) => {
  if (!name) {
    return children
  }

  const [value, setValue] = useState<string | number | boolean>()
  const [error, setError] = useState('')

  const { values, onValueChange, validateRegister } = useContext(FormContext)

  const handleValidate = (value: any) => {
    let errorMsg: string | null = null
    if (Array.isArray(rules) && rules.length) {
      const validator = new Schema({
        [name]: rules.map(rule => {
          return {
            type: 'string',
            ...rule,
          }
        }),
      })
      validator.validate({ [name]: value }, errors => {
        if (errors && errors.length) {
          errorMsg = errors[0].message!
          setError(errors[0].message!)
          return
        }
        setError('')
        errorMsg = null
      })
    }

    return errorMsg
  }

  useEffect(() => {
    if (value !== values?.[name]) {
      setValue(values?.[name])
    }
  }, [values, JSON.stringify(values?.[name])])

  useEffect(() => {
    validateRegister?.(name, () => handleValidate(value))
  }, [value])

  const propsName: Record<string, any> = {
    [valuePropName || 'value']: value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = getValueFromEvent(e)
      setValue(value)
      onValueChange?.(name, value)
      handleValidate(value)
    },
  }

  const childEle =
    React.Children.toArray(children).length > 1
      ? children
      : React.cloneElement(children!, propsName)

  const classes = clsx('form-item', className)

  return (
    <div className={classes} style={style}>
      <div>{label && <label>{label}</label>}</div>
      <div>
        {childEle}
        {error && (
          <div className="error" style={{ color: 'red' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default FormItem
