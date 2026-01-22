import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Utility function to get public URL for product images
export const getProductImageUrl = (imagePath) => {
  if (!imagePath)
    return "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081";

  // If it's already a full URL, return as is (but replace broken placeholders)
  if (imagePath.startsWith("http")) {
    // Replace broken via.placeholder.com URLs with working placeholder
    if (imagePath.includes("via.placeholder.com")) {
      return "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081";
    }
    return imagePath;
  }

  // Otherwise, get the public URL from Supabase Storage
  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(imagePath);

  return data.publicUrl;
};

// Utility function to upload an image to the bucket
export const uploadProductImage = async (file, fileName) => {
  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file);

  if (error) throw error;

  // Return the path for storing in the database
  return data.path;
};

export default supabase;
