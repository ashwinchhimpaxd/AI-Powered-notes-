import React from 'react'

function Button({ classNameSting, text }) {
    return (
        <button className={`${classNameSting} w-fit  rounded-xl`} > {text}</button >
    )
}

export default Button