// src/AppWrite/config.js
import { Client, Databases, Query } from "appwrite"; // Yaha pe aapka keys ka path
import { ID } from "appwrite";
import AppwriteConf from "@/appwriteConfigrationKeys/ConfigrationofAppwrite";
export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(AppwriteConf.appwriteUrl) // Your API Endpoint
            .setProject(AppwriteConf.appwriteProjectId); // Your project ID

        this.databases = new Databases(this.client);
    }

    // CREATE DOCUMENT
    async createNote({ Notes_title, slug, Notes_contents, Notes_Images_urls, Is_note_important, User_Unique_ID }) {
        try {
            return await this.databases.createDocument(
                AppwriteConf.appwriteDatabaseId,
                AppwriteConf.appwriteCollectionId,
                slug, // Document ID (Unique identifier for the note)
                {
                    Notes_title,
                    Notes_contents,
                    Notes_Images_urls,
                    Is_note_important,
                    User_Unique_ID,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createNote :: error", error);
        }
    }

    // UPDATE DOCUMENT
    async updateNote(slug, { Notes_title, Notes_contents, Notes_Images_urls, Is_note_important }) {
        let documentId = slug + ID.unique();
        try {
            return await this.databases.updateDocument(
                AppwriteConf.appwriteDataBaseId,
                AppwriteConf.appwriteCollectionId,
                documentId, // Document ID
                {
                    Notes_title,
                    Notes_contents,
                    Notes_Images_urls,
                    Is_note_important,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updateNote :: error", error);
        }
    }

    // DELETE DOCUMENT
    async deleteNote(slug) {
        try {
            await this.databases.deleteDocument(
                AppwriteConf.appwriteDataBaseId,
                AppwriteConf.appwriteCollectionId,
                slug
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteNote :: error", error);
            return false;
        }
    }

    // GET SINGLE DOCUMENT
    async getNote(slug) {
        try {
            return await this.databases.getDocument(
                AppwriteConf.appwriteDataBaseId,
                AppwriteConf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: getNote :: error", error);
            return false;
        }
    }

    // GET ALL DOCUMENTS
    async getNotes(queries = []) {
        try {
            return await this.databases.listDocuments(
                AppwriteConf.appwriteDataBaseId,
                AppwriteConf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite service :: getNotes :: error", error);
            return false;
        }
    }
}

const service = new Service();
export default service;
