import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit as firestoreLimit,
  serverTimestamp,
  where,
  updateDoc,
  getDoc,
  doc
} from 'firebase/firestore';

const SCORES_COLLECTION = 'scores';

export const saveScore = async (scoreData) => {
  try {
    console.log('Saving score to Firestore:', scoreData);
    
    // Validate score data
    if (!scoreData || typeof scoreData.score !== 'number' || !scoreData.name) {
      throw new Error('Invalid score data');
    }

    // Get the scores collection reference
    const scoresCollection = collection(db, SCORES_COLLECTION);
    console.log('Collection reference created');

    // Check for existing score with the same initials
    const existingScoreQuery = query(
      scoresCollection,
      where('name', '==', scoreData.name)
    );
    
    const existingScores = await getDocs(existingScoreQuery);
    console.log('Checking for existing scores with initials:', scoreData.name);

    if (!existingScores.empty) {
      // Get the first (and should be only) document with these initials
      const existingScoreDoc = existingScores.docs[0];
      const existingScore = existingScoreDoc.data();
      
      console.log('Found existing score:', existingScore);

      // Only update if the new score is higher
      if (scoreData.score > existingScore.score) {
        console.log('Updating existing score with higher score');
        await updateDoc(doc(db, SCORES_COLLECTION, existingScoreDoc.id), {
          score: scoreData.score,
          timestamp: serverTimestamp()
        });
        console.log('Score updated successfully');
        return existingScoreDoc.id;
      } else {
        console.log('New score is not higher than existing score, not updating');
        return existingScoreDoc.id;
      }
    }

    // If no existing score found, create new score
    console.log('No existing score found, creating new score');
    const docData = {
      score: scoreData.score,
      name: scoreData.name,
      timestamp: serverTimestamp()
    };

    console.log('Document data to save:', docData);
    
    const docRef = await addDoc(scoresCollection, docData);
    console.log('New score saved with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving score:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

export const getHighScores = async (limitCount = 10) => {
  try {
    console.log('Getting high scores...');
    const scoresCollection = collection(db, SCORES_COLLECTION);
    console.log('Collection reference created');
    
    const scoresQuery = query(
      scoresCollection,
      orderBy('score', 'desc'),
      firestoreLimit(limitCount)
    );
    console.log('Query created');
    
    const querySnapshot = await getDocs(scoresQuery);
    console.log('Query executed, got snapshot');
    
    const scores = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Scores processed:', scores);
    
    return scores;
  } catch (error) {
    console.error('Error getting high scores:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
}; 