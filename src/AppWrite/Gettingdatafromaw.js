import { Client, Databases } from "appwrite";

const client = new Client().setEndpoint('https://fra.cloud.appwrite.io/v1').setProject("684c753a0010c13e616f");
const databases = new Databases(client);


const getBlogData = async () => {
    try {
        const response = await databases.listDocuments(
            '684c77450029ce971346',
            '688f36a300286033f591'
        );
        console.log(response)
        // Yahan aapko poora data milega
    } catch (error) {
        console.error(error);
    }
};

export default getBlogData