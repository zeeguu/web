import * as s from './Input.sc'
import * as sc from '../Theme.sc'
import { zeeguuRed } from '../colors'

export const Input = ({ isPlainText, isEmail, title, placeholder, value, onChange, errorText, ...props }) => {
  return (
    <s.InputContainer>
      <sc.LabelWithError>
        <s.InputLabel>{title}</s.InputLabel>
        {errorText && <sc.errorText>{errorText}</sc.errorText>}
      </sc.LabelWithError>
      {(isEmail || isPlainText) &&
        <s.Input
          name={isEmail ? 'email' : 'name'}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          style={{ borderColor: errorText && zeeguuRed }}
        />
      }
    </s.InputContainer>
  )
}
