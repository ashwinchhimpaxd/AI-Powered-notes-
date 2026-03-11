// import {service} from "../../../AppWrite/Setgetuserdatas/config.js";

const DataSave = async (editor, slug) => {
    console.log("save data", editor.getHTML());
    console.log(slug, "slug")
    // TODO: Replace with actual Appwrite save request
    await new Promise(resolve => setTimeout(resolve, 4000)); // Simulate network request delay so "Saving..." is visible
}

export default DataSave