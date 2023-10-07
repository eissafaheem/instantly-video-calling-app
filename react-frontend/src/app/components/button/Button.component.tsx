import React from 'react'
import ButtonStyles from './Button.module.css'

type ButtonProps = {
    text: string,
    type: "primary" | "secondary"
    onClick: ()=>void
}

function ButtonComponent(props: ButtonProps) {
    const { text, type, onClick } = props;
    return (
        <button className={`${ButtonStyles['button']} ${ButtonStyles[type+'-button']}`}>
            {text}
        </button>
    )
}

export default ButtonComponent
