// lib/api-debug.ts - Create this file to test API connectivity
export async function testApiConnection() {
  const API_BASE_URL = "https://heavenly-backend-6y7j.onrender.com/api/v1";

  console.log("Testing API connection...");
  console.log("API URL:", API_BASE_URL);

  try {
    // Test basic connectivity
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@test.com",
        password: "test123",
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    const data = await response.json();
    console.log("Response data:", data);

    return { success: true, status: response.status, data };
  } catch (error) {
    console.error("API test failed:", error);

    // Check if it's a network error
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("Network error - Possible causes:");
      console.error("1. CORS issue - Backend needs to allow your domain");
      console.error("2. API server is down");
      console.error("3. Network connectivity issue");
      console.error("4. Wrong API URL");
    }

    return { success: false, error };
  }
}
