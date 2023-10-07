import React from 'react'
import ButtonStyles from './Button.module.css'

type ButtonProps = {
    text: string,
    type: "primary" | "secondary"
    onClick?: (event: React.FormEvent)=>void
}

function ButtonComponent(props: ButtonProps) {
    const { text, type, onClick } = props;
    return (
        <button className={`${ButtonStyles['button']} ${ButtonStyles[type+'-button']}`} type='submit' onClick={onClick}>
            {text}
        </button>
    )
}

export default ButtonComponent
