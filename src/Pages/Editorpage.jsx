import React from 'react'
import Editor2 from '../Component/Editor/Editor2'
import AIPanel from '../Component/AI login/AILogic';

function Editorpage() {
    const [editorInstance, seteditorInstance] = React.useState(null);
    if (editorInstance) {
        console.log(editorInstance.getJSON())
    }
    return (
        <div className='flex flex-col w-full h-[100vh]'>

            <div className='w-full h-full flex flex-col'>
                {/* upper div for note name and save button */}


                <Editor2 onEditorReady={seteditorInstance} />
                {/* <div className="w-full h-full">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et quis alias aperiam consequatur non soluta porro, reiciendis corrupti dicta mollitia perferendis exercitationem explicabo nesciunt commodi. A illo necessitatibus sed perferendis.
                </div> */}
            </div>
            {/* <AIPanel editor={editorInstance}  /> */}

        </div>
    )
}
export default Editorpage