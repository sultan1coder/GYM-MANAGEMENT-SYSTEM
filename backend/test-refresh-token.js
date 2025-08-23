const axios = require("axios");

const BASE_URL = "http://localhost:4000/api";

async function testRefreshTokenSystem() {
  try {
    console.log("🔄 Testing Refresh Token System...\n");

    // Step 1: Login to get access and refresh tokens
    console.log("1️⃣ Logging in...");
    const loginResponse = await axios.post(
      `${BASE_URL}/auth/login`,
      {
        email: "admin@gym.com",
        password: "admin123",
      },
      {
        withCredentials: true, // Important for cookies
      }
    );

    console.log("✅ Login successful");
    console.log(
      "📱 Access Token:",
      loginResponse.data.accessToken.substring(0, 20) + "..."
    );
    console.log(
      "🍪 Refresh Token Cookie Set:",
      !!loginResponse.headers["set-cookie"]
    );
    console.log("");

    // Step 2: Use access token to access protected route
    console.log("2️⃣ Testing protected route with access token...");
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${loginResponse.data.accessToken}`,
      },
    });

    console.log("✅ Protected route accessed successfully");
    console.log("👤 User info:", meResponse.data.user);
    console.log("");

    // Step 3: Test refresh token endpoint
    console.log("3️⃣ Testing refresh token endpoint...");
    const refreshResponse = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      {
        withCredentials: true,
      }
    );

    console.log("✅ Token refreshed successfully");
    console.log(
      "🆕 New Access Token:",
      refreshResponse.data.accessToken.substring(0, 20) + "..."
    );
    console.log("👤 User info from refresh:", refreshResponse.data.user);
    console.log("");

    // Step 4: Test new access token
    console.log("4️⃣ Testing new access token...");
    const newMeResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${refreshResponse.data.accessToken}`,
      },
    });

    console.log("✅ New token works successfully");
    console.log("👤 User info with new token:", newMeResponse.data.user);
    console.log("");

    // Step 5: Test logout
    console.log("5️⃣ Testing logout...");
    const logoutResponse = await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshResponse.data.accessToken}`,
        },
        withCredentials: true,
      }
    );

    console.log("✅ Logout successful");
    console.log("📝 Logout message:", logoutResponse.data.message);
    console.log("");

    console.log(
      "🎉 All tests passed! Refresh token system is working correctly."
    );
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Run the test
testRefreshTokenSystem();
