import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  updateDoc,
  serverTimestamp,
  writeBatch 
} from 'firebase/firestore';


const PROJECTS_COLLECTION = 'projects';
const QUERIES_COLLECTION = 'queries';

/**
 * Fetches all projects from Firestore.
 * Phase 1 Cost Guardrail: Uses one-time fetch (getDocs) instead of onSnapshot.
 * @param {boolean} includeDisabled - Whether to include disabled/soft-deleted projects.
 * @returns {Promise<Array>} List of project objects.
 */
export const getProjects = async (includeDisabled = false) => {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION));
    const querySnapshot = await getDocs(q);
    let projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // In-memory sort to avoid Firestore index requirements for small collections
    projects.sort((a, b) => {
      const orderA = a.displayOrder ?? 9999999999999;
      const orderB = b.displayOrder ?? 9999999999999;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // Secondary sort: Latest arrival first
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });

    if (!includeDisabled) {
      return projects.filter(p => !p.isDisabled);
    }
    return projects;
  } catch (error) {
    console.error('Project Service Error (getProjects):', error);
    throw error;
  }
};

/**
 * Fetches a single project by ID.
 * @param {string} projectId 
 * @returns {Promise<Object>} Project details.
 */
export const getProject = async (projectId) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Project not found');
    }
  } catch (error) {
    console.error('Project Service Error (getProject):', error);
    throw error;
  }
};


/**
 * Adds a new project to Firestore.
 * @param {Object} projectData 
 * @returns {Promise<string>} Created doc ID.
 */
export const addProject = async (projectData) => {
  try {
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...projectData,
      isDisabled: false, // Default to visible
      displayOrder: Date.now(), // Default order for new projects
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Project Service Error (addProject):', error);
    throw error;
  }
};

/**
 * Permentantly deletes a project.
 * Phase 1 Safety Control: Confirmation required (handled in UI).
 * @param {string} projectId 
 */
export const deleteProject = async (projectId) => {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
  } catch (error) {
    console.error('Project Service Error (deleteProject):', error);
    throw error;
  }
};

/**
 * Toggles project visibility (Soft Delete/Disable).
 * Phase 1 Admin Safety Control.
 * @param {string} projectId 
 * @param {boolean} isDisabled 
 */
export const toggleProjectStatus = async (projectId, isDisabled) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, { isDisabled });
  } catch (error) {
    console.error('Project Service Error (toggleProjectStatus):', error);
    throw error;
  }
};

/**
 * Updates an existing project's details.
 * @param {string} projectId 
 * @param {Object} projectData 
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, {
      ...projectData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Project Service Error (updateProject):', error);
    throw error;
  }
};

/**
 * Updates the display order of multiple projects using a batch write.
 * @param {Array} projects - Array of {id, displayOrder} objects
 */
export const updateProjectOrder = async (orderUpdates) => {
  try {
    const batch = writeBatch(db);
    orderUpdates.forEach(update => {
      const projectRef = doc(db, PROJECTS_COLLECTION, update.id);
      batch.update(projectRef, { displayOrder: update.displayOrder });
    });
    await batch.commit();
  } catch (error) {
    console.error('Project Service Error (updateProjectOrder):', error);
    throw error;
  }
};

/**
 * Stores a contact form submission in the queries collection.
 * @param {Object} queryData 
 * @returns {Promise<string>} Created doc ID.
 */
export const addQuery = async (queryData) => {
  try {
    const docRef = await addDoc(collection(db, QUERIES_COLLECTION), {
      ...queryData,
      isSeen: false, // Default status for new inquiries
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Project Service Error (addQuery):', error);
    throw error;
  }
};

/**
 * Fetches all contact inquiries from Firestore.
 * @returns {Promise<Array>} List of inquiry objects.
 */
export const getQueries = async () => {
  try {
    const q = query(
      collection(db, QUERIES_COLLECTION), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        isSeen: false, // Default for older messages missing this field
        ...data
      };
    });
  } catch (error) {
    console.error('Project Service Error (getQueries):', error);
    throw error;
  }
};

/**
 * Marks a single inquiry as seen/read.
 * @param {string} queryId 
 */
export const markQueryAsSeen = async (queryId) => {
  try {
    const queryRef = doc(db, QUERIES_COLLECTION, queryId);
    await updateDoc(queryRef, { isSeen: true });
  } catch (error) {
    console.error('Project Service Error (markQueryAsSeen):', error);
    throw error;
  }
};

/**
 * Marks all provided inquiries as seen using a batch update.
 * @param {Array<string>} queryIds 
 */
export const markAllQueriesAsSeen = async (queryIds) => {
  try {
    const batch = writeBatch(db);
    queryIds.forEach(id => {
      const queryRef = doc(db, QUERIES_COLLECTION, id);
      batch.update(queryRef, { isSeen: true });
    });
    await batch.commit();
  } catch (error) {
    console.error('Project Service Error (markAllQueriesAsSeen):', error);
    throw error;
  }
};

/**
 * Permanently deletes an inquiry.
 * @param {string} queryId 
 */
export const deleteQuery = async (queryId) => {
  try {
    await deleteDoc(doc(db, QUERIES_COLLECTION, queryId));
  } catch (error) {
    console.error('Project Service Error (deleteQuery):', error);
    throw error;
  }
};
