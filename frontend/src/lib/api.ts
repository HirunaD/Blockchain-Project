// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Log submission to backend
export const logSubmission = async (data: {
  student: string;
  assignmentId: string;
  txHash: string;
}): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/log-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to log submission');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Don't throw - logging is optional, blockchain is the source of truth
    return { success: false };
  }
};
