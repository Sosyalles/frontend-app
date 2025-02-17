interface ErrorResponse {
  status?: string | number;
  message?: string;
  stack?: string;
}

export const getErrorMessage = (error: ErrorResponse | any): string => {
  // Check if error is an axios error with response data
  if (error.response) {
    // Prioritize response data message
    if (error.response.data?.message) {
      return error.response.data.message;
    }
    
    // Fallback to generic network error
    return 'Sunucuyla iletişimde bir sorun oluştu';
  }

  // Check if error is a network error
  if (error.message) {
    // Remove technical prefixes
    const networkErrorMessages: { [key: string]: string } = {
      'Network Error': 'İnternet bağlantısı hatası',
      'Request failed': 'İstek gönderilemedi',
    };

    for (const [key, value] of Object.entries(networkErrorMessages)) {
      if (error.message.includes(key)) {
        return value;
      }
    }

    // Generic fallback
    return 'Bir hata oluştu';
  }

  // Check if error is a string
  if (typeof error === 'string') {
    return error;
  }

  // Absolute fallback
  return 'Bilinmeyen bir hata oluştu';
};

export const handleError = (error: any, setErrorCallback?: (message: string) => void) => {
  const errorMessage = getErrorMessage(error);
  
  // If a callback is provided, use it
  if (setErrorCallback) {
    setErrorCallback(errorMessage);
  }

  // Log full error for debugging, but only in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Handled Error:', error);
  }

  return errorMessage;
}; 