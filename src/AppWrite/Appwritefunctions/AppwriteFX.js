import { Client, Functions } from "appwrite";
import AppwriteConf from '@/appwriteConfigrationKeys/ConfigrationofAppwrite'

export async function FXexecute() {

    const client = new Client();

    client
        .setEndpoint(AppwriteConf.appwriteUrl)
        .setProject(AppwriteConf.appwriteProjectId);

    const functions = new Functions(client);

    const response = await functions.createExecution(
        "6a3058c20033131cd96b"
    );

    console.log(response);
}

