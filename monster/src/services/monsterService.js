import { getFunctions, httpsCallable } from 'firebase/functions';

export const generateMonsterImage = async (monsterData) => {
  try {
    console.log('Calling generateMonsterImage with data:', monsterData);
    const functions = getFunctions();
    const generateMonsterImage = httpsCallable(functions, 'generateMonsterImage');
    
    // Send the monster description and creator name to the Cloud Function
    const result = await generateMonsterImage({
      monsterDescription: monsterData.monsterDescription,
      creatorName: monsterData.creatorName
    });
    
    console.log('Received result:', result);
    
    if (!result.data || !result.data.success) {
      throw new Error('Failed to generate monster image: ' + (result.data?.error || 'Unknown error'));
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
    console.error('Error in generateMonsterImage:', error);
    console.error('Error details:', error);
    throw new Error('Error: Failed to generate monster image: ' + error.message);
  }
};