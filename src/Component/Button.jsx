import React from 'react'

function Button({ classNameSting, text }) {
    return (
        <button className={`${classNameSting}  rounded-xl cursor-pointer text-center `} > {text}</button >
    )
}

export default Button