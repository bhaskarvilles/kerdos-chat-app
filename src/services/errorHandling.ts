export class ErrorHandler {
  static async handleNetworkError(_error: Error, retry: () => Promise<void>) {
    console.log('Attempting to retry failed network request...');
    try {
      await retry();
      console.log('Retry successful');
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      throw new Error('Network request failed after retry');
    }
  }
} 