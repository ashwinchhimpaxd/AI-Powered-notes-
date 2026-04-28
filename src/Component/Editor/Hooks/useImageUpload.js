import { useState } from "react";
import StorageService from "../../../AppWrite/Setgetuserdatas/StorageImages/ImageUpload";
import { useSelector } from "react-redux";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const userData = useSelector((state) => state.UserAuthantication.UserData);

  const handleImageUpload = async (editor, file) => {
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setIsUploading(true);

    try {
      // Get the correct user ID reference for setting database permissions
      const userId =
        userData?.userdetaild?.userId ||
        userData?.userdetaild?.$id ||
        userData?.userId ||
        userData?.$id ||
        "anonymous";

      // 1. Upload to Appwrite Storage with secure file role permissions
      const response = await StorageService.uploadImage(file, userId);
      console.log(response)
      if (!response) {
        console.log("response is not comming from the storage service")
      }
      const fileId = response.$id;
      console.log(fileId, "this ID use to get the image from the appwrite")
      // 2. Add to pending images in localStorage locally to prevent orphans on page reload
      const pendingImages = JSON.parse(localStorage.getItem("pending_appwrite_images") || "[]");
      pendingImages.push(fileId);
      localStorage.setItem("pending_appwrite_images", JSON.stringify(pendingImages));

      // 3. Get Preview URL
      const previewUrl = StorageService.getImagePreview(fileId);
      console.log(previewUrl.toString())
      // 4. Insert into Tiptap
      editor.chain().focus().setImage({
        src: previewUrl.toString(),
        "data-file-id": fileId
      }).run();

    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, handleImageUpload };
}
