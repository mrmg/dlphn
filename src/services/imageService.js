import { getFunctions, httpsCallable } from 'firebase/functions';

export const generateMemoryImage = async (memories) => {
  try {
    console.log('Calling generateImage with memories:', memories);
    const functions = getFunctions();
    const generateImage = httpsCallable(functions, 'generateImage');
    
    // Send the memories directly to the Cloud Function
    const result = await generateImage({
      peMemory: memories.peMemory,
      swimmingMemory: memories.swimmingMemory,
      homeworkMemory: memories.homeworkMemory
    });
    
    console.log('Received result:', result);
    
    if (!result.data || !result.data.success) {
      throw new Error('Failed to generate image: ' + (result.data?.error || 'Unknown error'));
    }
    
    // Return the image data with metadata
    return {
      imageData: result.data.imageData,
      imageUrl: result.data.imageUrl,
      queryId: result.data.queryId,
      method: result.data.method,
      contentType: result.data.contentType || 'image/png'
    };
  } catch (error) {
    console.error('Error in generateMemoryImage:', error);
    console.error('Error details:', error);
    throw new Error('Error: Failed to generate image: ' + error.message);
  }
}; 