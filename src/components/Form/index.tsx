import InnerForm from './Form'
import Item from './FormItem'

type InnerFormType = typeof InnerForm

interface FormInterface extends InnerFormType {
  Item: typeof Item
}

const Form = InnerForm as FormInterface

Form.Item = Item

export default Form
