import React from 'react'

function Button({ classNameSting, text }) {
    return (
        <button className={`${classNameSting} w-fit  rounded-xl cursor-pointer`} > {text}</button >
    )
}

export default Button