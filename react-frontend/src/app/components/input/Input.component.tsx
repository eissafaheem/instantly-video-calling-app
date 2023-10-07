import React from 'react'
import InputStyles from './Input.module.css'

type InputProps = {
    placeholder: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    type: "text" | "password"
}

function InputComponent(props: InputProps) {

    const { placeholder, setValue, type } = props;
    return (
        <input className={InputStyles['input-styles']} type={type} placeholder={placeholder} onChange={(event) => { setValue(event.target.value) }} />
    )
}

export default InputComponent
