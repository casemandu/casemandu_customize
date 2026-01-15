export async function GetAllPhone(){
    const url = process.env.NEXT_PUBLIC_API_URL || "https://casemandu-api.onrender.com";
    
    if (!url) {
        console.error("NEXT_PUBLIC_API_URL environment variable is not set");
        return [];
    }
    
    const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
  
    try {
        const res = await fetch(url+"/api/phones/brands", requestOptions);
        if (!res.ok) {
            console.error("Failed to fetch brands:", res.status);
            return [];
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching brands:", error);
        return [];
    }
}

export async function GetBrandModels(brandId){
    const url = process.env.NEXT_PUBLIC_API_URL || "https://casemandu-api.onrender.com";
    
    if (!url) {
        console.error("NEXT_PUBLIC_API_URL environment variable is not set");
        return [];
    }
    
    if (!brandId) {
        console.error("Brand ID is required");
        return [];
    }
    
    const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
  
    try {
        const res = await fetch(url+`/api/phones/brands/${brandId}`, requestOptions);
        if (!res.ok) {
            console.error("Failed to fetch models:", res.status);
            return [];
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching models:", error);
        return [];
    }
}

export async function GetCaseTypes(caseTypeIds){
    const url = process.env.NEXT_PUBLIC_API_URL || "https://casemandu-api.onrender.com";
    
    if (!url) {
        console.error("NEXT_PUBLIC_API_URL environment variable is not set");
        return [];
    }
    
    if (!caseTypeIds || !Array.isArray(caseTypeIds) || caseTypeIds.length === 0) {
        return [];
    }
    
    const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
  
    try {
        // Try different endpoint patterns
        const endpoints = [
            "/api/casetypes",
            "/api/case-types",
            "/api/phones/casetypes",
            "/api/phones/case-types"
        ];
        
        for (const endpoint of endpoints) {
            try {
                const res = await fetch(url + endpoint, requestOptions);
                if (res.ok) {
                    const data = await res.json();
                    // Filter by the provided IDs
                    const filtered = Array.isArray(data) 
                        ? data.filter(ct => caseTypeIds.includes(ct._id))
                        : [];
                    if (filtered.length > 0) {
                        return filtered;
                    }
                }
            } catch (err) {
                // Continue to next endpoint
                continue;
            }
        }
        
        console.error("Failed to fetch case types from any endpoint");
        return [];
    } catch (error) {
        console.error("Error fetching case types:", error);
        return [];
    }
}