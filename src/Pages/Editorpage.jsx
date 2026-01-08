import React from 'react'
import Editor2 from '../Component/Editor/Editor2'
import AIPanel from '../Component/AI login/AILogic';

function Editorpage() {
    const [editorInstance, seteditorInstance] = React.useState(null);
    if (editorInstance) {
        console.log(editorInstance.getJSON())
    }
    return (
        <div className='flex flex-col md:flex-row w-full h-full px-3 py-4 '>

            <div className='w-full md:w-3/4 h-full'>
                {/* upper div for note name and save button */}


                <Editor2 onEditorReady={seteditorInstance} />

            </div>
            {/* <AIPanel editor={editorInstance}  /> */}

        </div>
    )
}
<button class="inline-flex h-12 items-center justify-center rounded-md bg-neutral-950 px-6 font-medium text-neutral-50 shadow-lg shadow-neutral-500/20 transition active:scale-95">Click me</button>

export default Editorpage