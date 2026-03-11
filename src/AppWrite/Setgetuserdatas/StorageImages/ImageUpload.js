// src/AppWrite/storageService.js
import { Client, Storage, ID } from "appwrite";
import AppwriteConf from '../appwriteConfigrationKeys/ConfigrationofAppwrite'

class StorageService {

    constructor() {
        this.client = new Client()
            .setEndpoint(AppwriteConf.appwriteUrl)
            .setProject(AppwriteConf.appwriteProjectId)

        this.storage = new Storage(this.client)
    }

    async uploadImage(file) {

        const response = await this.storage.createFile(
            AppwriteConf.appwriteBucketId,
            ID.unique(),
            file
        )

        return this.getFilePreview(response.$id)
    }

    getFilePreview(fileId) {
        return this.storage.getFileView(
            AppwriteConf.appwriteBucketId,
            fileId
        )
    }

}

export default new StorageService()