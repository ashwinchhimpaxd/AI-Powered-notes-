import React from 'react'
import Editor2 from '../Component/Editor/Editor2'
import { useEffect, useState } from 'react';

function Editorpage() {
    const [editorInstance, seteditorInstance] = useState(null);

    useEffect(() => {
        if (editorInstance) {
            // console.log(editorInstance)
            // console.log("hello")
        }
    }, [editorInstance])


    return (
        <div className='flex flex-col w-full h-[100vh]'>

            <div className='w-full h-full flex flex-col'>


                <Editor2 onEditorReady={seteditorInstance} />

            </div>


        </div>
    )
}
export default Editorpage