const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const folder = String(import.meta.env.VITE_CLOUDINARY_FOLDER || "").replace(/^\/+/, "");

export const uploadImageToCloudinary = async (file) => {
  if (!file) {
    throw new Error("Image file is required.");
  }
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary settings are missing.");
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed.");
  }

  const secureUrl = data?.secure_url || data?.url;
  if (!secureUrl) {
    throw new Error("Cloudinary did not return an image URL.");
  }
  return secureUrl;
};

export default uploadImageToCloudinary;
