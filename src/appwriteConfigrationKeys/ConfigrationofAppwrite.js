const AppwriteConf = {

    appwriteUrl: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDataBaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    nvidiaApiKey: String(import.meta.env.VITE_NVIDIA_API_KEY),
    nvidiaBaseUrl: String(import.meta.env.VITE_NVIDIA_BASE_URL),
    ocrkey: String(import.meta.env.VITE_OCR_KEY),
    ocrendpoint: String(import.meta.env.VITE_OCR_ENDPOINT),
    appwriteAiFunctionId: String(import.meta.env.VITE_APPWRITE_AI_FUNCTION_ID || '6a417832003108691f78'),
}

export default AppwriteConf