import React from 'react'

function Button({ classNameSting, text, onclick }) {
    return (
        <button onClick={onclick} className={`${classNameSting}   rounded-full cursor-pointer text-center `}   > {text}</button >
    )
}

export default Button