// services/googleSheets.ts

const webhookUrl = process.env.WEBHOOK_URL;

if (!webhookUrl) {
  throw new Error("WEBHOOK_URL is not defined in environment variables");
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  source: string;
}

export const submitToGoogleSheets = async (data: ContactFormData) => {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // IMPORTANT: check actual response
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
    return { success: false, error };
  }
};
