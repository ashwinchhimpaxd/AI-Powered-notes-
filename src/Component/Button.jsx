import React from 'react'

function Button({ classNameSting, text, onclick, type = "button" }) {
    return (
        <button type={type} onClick={onclick} className={`${classNameSting}   rounded-full cursor-pointer text-center `}   > {text}</button >
    )
}

export default Button