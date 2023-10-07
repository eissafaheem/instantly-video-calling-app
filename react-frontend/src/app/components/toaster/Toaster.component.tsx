import React from 'react'
import ToasterStyles from './Toaster.module.css';
import ReactDOM from 'react-dom';
import closeIcon from '../../../assets/close.svg'

type ToasterProps = {
    message: string;
    setIsToasterVisible: React.Dispatch<React.SetStateAction<boolean>>
}

function ToasterComponent(props: ToasterProps) {

    const { message, setIsToasterVisible } = props;
    const modalElement = document.getElementById('modal');

    return modalElement ?
        ReactDOM.createPortal(
            <div className={ToasterStyles['toaster-container']}>
                {message}
                <div>
                    <img src={closeIcon} alt="Close"
                        className={ToasterStyles['close-icon']}
                        onClick={() => { setIsToasterVisible(false) }}
                    />
                </div>
            </div>,
            modalElement
        ) :
        <></>;
}

export default ToasterComponent
