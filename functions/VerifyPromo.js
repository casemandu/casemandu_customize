export async function verifyPromo(data) {
  const url = process.env.NEXT_PUBLIC_API_URL || "https://casemandu-api.casemandu.com.np";
  
  if (!url) {
    console.error("NEXT_PUBLIC_BACKEND environment variable is not set");
    return false;
  }
  
  try {
    const response = await fetch(url + "/api/promocodes", {
      method: "GET",
    });
    
    if (!response.ok) {
      console.error("Failed to fetch promocodes:", response.status);
      return false;
    }
    
    const result = await response.json();
    if (result.length === 0) return false;
    const verify = result.filter((promo) => promo.code === data);

    if (verify.length > 0) {
      return verify[0];
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error verifying promo:", error);
    return false;
  }
}
