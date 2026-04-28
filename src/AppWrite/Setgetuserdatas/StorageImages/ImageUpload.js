// src/AppWrite/storageService.js
import { Client, Storage, ID, Permission, Role } from "appwrite";
import AppwriteConf from "@/appwriteConfigrationKeys/ConfigrationofAppwrite";

class StorageService {

    constructor() {
        this.client = new Client()
            .setEndpoint(AppwriteConf.appwriteUrl)
            .setProject(AppwriteConf.appwriteProjectId)

        this.storage = new Storage(this.client)
    }

    async uploadImage(file, userId = null) {

        try {

            const response = await this.storage.createFile(
                AppwriteConf.appwriteBucketId,
                ID.unique(),
                file,
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.user(userId)),
                    Permission.delete(Role.user(userId))
                ]
            )
            return response;
        } catch (error) {
            console.log("Appwrite service :: uploadImage :: error", error);
            throw error;
        }

        // return this.getFilePreview(response.$id)
    }

    getImagePreview(fileId) {
        try {
            return this.storage.getFileView(
                AppwriteConf.appwriteBucketId,
                fileId,
            );
        } catch (error) {
            console.log("Appwrite service :: getImagePreview :: error", error);
            throw error;
        }
    }

    async deleteImage(fileId) {
        try {
            await this.storage.deleteFile(
                AppwriteConf.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteImage :: error", error);
            throw error;
        }
    }
}

export default new StorageService()