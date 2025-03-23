const API_BASE_URL = 'http://localhost:8000';

export const mcpApi = {
  async uploadFragment(paragraph) {
    const response = await fetch(`${API_BASE_URL}/UploadFragment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paragraph }),
    });
    return response.json();
  },

  async queryFragment(prompt) {
    const response = await fetch(`${API_BASE_URL}/QueryFragment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    return response.json();
  },

  async calculateContribution(paper, fragmentList) {
    const response = await fetch(`${API_BASE_URL}/CalculateContribution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paper, fragmentList }),
    });
    return response.json();
  },
};
