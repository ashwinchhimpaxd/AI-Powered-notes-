import React from 'react'
import Editor2 from '../Component/Editor/Editor2'
import AIPanel from '../Component/AI login/AILogic';
function Editorpage() {
    const [editorInstance, seteditorInstance] = React.useState(null);
    return (
        <div className='flex flex-col md:flex-row w-full h-full'>

            <Editor2 onEditorReady={seteditorInstance} />

            {/* <AIPanel editor={editorInstance}  /> */}

        </div>
    )
}

export default Editorpage