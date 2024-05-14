import { database } from "../firebase";
import { ref, child, get, onValue, off} from "firebase/database";
import { storage } from '../firebase';
import { ref as sRef } from 'firebase/storage';
import {
  listAll,
  getMetadata,
  getDownloadURL,
} from 'firebase/storage';

async function GetProjectData(projectId) {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, "projects/" + projectId));
    if (snapshot.exists()) {
      return snapshot.val(); // Resolve with the data
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    throw error; // Reject with the error
  }
}

function GetProjectTitle(projectId) {
  const dbRef = ref(database);
  return get(child(dbRef, "projects/" + projectId + "/title"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val(); // Resolve with the data
      } else {
        throw new Error("No data available");
      }
    })
    .catch((error) => {
      throw error; // Reject with the error
    });
}

function GetProjectDescription(projectId) {
  const dbRef = ref(database);
  return get(child(dbRef, "projects/" + projectId + "/description"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val(); // Resolve with the data
      } else {
        throw new Error("No data available");
      }
    })
    .catch((error) => {
      throw error; // Reject with the error
    });
}

function GetProjectThumbnailUrl(projectId) {
  const dbRef = ref(database);
  return get(child(dbRef, "projects/" + projectId + "/thumbnailurl"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val(); // Resolve with the data
      } else {
        throw new Error("No data available");
      }
    })
    .catch((error) => {
      throw error; // Reject with the error
    });
}


//Function calling GetProjectData
function GetAllProjectData() {
  return new Promise((resolve, reject) => {
    const dbRef = ref(database, "projects");
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const projectData = snapshot.val();
          const projectInfoArray = [];

          // Loop through each project and extract specific fields
          for (const projectId in projectData) {
            if (projectData.hasOwnProperty(projectId)) {
              const project = projectData[projectId];
              const projectInfo = {
                projectID: projectId,
                Owner: project.owner,
                Category: project.category,
                Hastags: project.hashtags,
                TechLang: project.techlang,
                title: project.title,
                thumbnailUrl: project.thumbnailurl,
              };
              projectInfoArray.push(projectInfo);
            }
          }

          resolve(projectInfoArray);
        } else {
          reject(new Error("No projects found"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
//Function Calling GetALLProjectData

async function GetAllProjectsDataUnderProfile(userEmailId) {
  try {
    const snapshot = await get(
      child(ref(database), "users/" + userEmailId + "/projects")
    );
    if (snapshot.exists()) {
      const projects = snapshot.val().split(',');
      let projectData = [];
      for (const projectId of projects) {
        const project = await GetProjectData(projectId);
        projectData.push(project);
      }
      return projectData;
    } else {
      return []; // Return an empty array if the user data doesn't exist
    }
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

async function GetUserName(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/Name"));

    if (snapshot.exists()) {
      const Name = snapshot.val();
      return Name; // Return the data
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    throw error; // Throw the error
  }
}

async function GetUserPhotoUrl(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/dpUrl"));

    if (snapshot.exists()) {
      const Dpurl = snapshot.val();
      return Dpurl; // Return the data
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    throw error; // Throw the error
  }
}

async function GetFollower(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/Follower"));

    if (snapshot.exists()) {
      const Follower = snapshot.val();
      return Follower; // Return the data
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    throw error; // Throw the error
  }
}

async function GetFollowing(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/Following"));

    if (snapshot.exists()) {
      const Following = snapshot.val();
      return Following; // Return the data
    } else {
      throw new Error("No data available");
    }
  } catch (error) {
    throw error; // Throw the error
  }
}
async function GetFollowingList(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/FollowingList"));

    if (snapshot.exists()) {
      const Following = snapshot.val();
      return Following; // Return the data
    } else {
      return "";
    }
  } catch (error) {
    throw error; // Throw the error
  }
}

async function GetLikes(projectId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "projects/" + projectId + "/Likes"));

    if (snapshot.exists()) {
      const Likes = snapshot.val();
      return Likes; // Return the data
    } else {
      return 0; // Return 0 as the default value
    }
  } catch (error) {
    throw error; // Throw the error
  }
}

async function GetLikedList(userEmailId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "users/" + userEmailId + "/LikedList"));

    if (snapshot.exists()) {
      const Liked = snapshot.val();
      return Liked; // Return the data
    } else {
      return ""; // Return an empty string as the default value
    }
  } catch (error) {
    throw error; // Throw the error
  }
}




let flg = false;

async function generateFolderData(storageRef, flg) {
  const listResult = await listAll(storageRef);
  const dataPromises = [];
  const items = [];

  for (const folderRef of listResult.prefixes) {
    dataPromises.push(generateFolderData(folderRef, true));
  }

  for (const itemRef of listResult.items) {
    dataPromises.push(handleItem(itemRef));
  }

  const resolvedData = await Promise.all(dataPromises);
  resolvedData.forEach((item) => {
    if (item.type === 'folder') {
      items.push(item);
    } else {
      const metadata = item.metadata;
      let newName = item.name;
      if (metadata && metadata.customMetadata) {
        if (item.name.endsWith('.txt') && metadata.customMetadata.extension) {
          newName = item.name.replace('.txt', metadata.customMetadata.extension);
        }
      }
      items.push({
        id: item.id,
        label: newName,
        type: 'file',
      });
    }
  });

  let data = {
    id: storageRef.fullPath,
    label: flg ? storageRef.name : 'Project Folder',
    type: 'folder',
    children: items,
  };

  return data;
}

async function handleItem(itemRef) {
  const metadata = await getMetadata(sRef(storage, itemRef.fullPath));
  return { id: itemRef.fullPath, name: itemRef.name, type: 'file', metadata };
}

async function getCodeContent(itemPath) {
  const metadata = await getMetadata(sRef(storage, itemPath));
  let langdetect = '';

  if (metadata.customMetadata && metadata.customMetadata.extension) {
    if (metadata.customMetadata.extension === '.c') {
      langdetect = 'c';
    } else if (metadata.customMetadata.extension === '.cpp') {
      langdetect = 'cpp';
    } else if (metadata.customMetadata.extension === '.py') {
      langdetect = 'python';
    } else if (metadata.customMetadata.extension === '.java') {
      langdetect = 'java';
    } else if (metadata.customMetadata.extension === '.js') {
      langdetect = 'javascript';
    } else if (metadata.customMetadata.extension === '.css') {
      langdetect = 'css';
    } else if (metadata.customMetadata.extension === '.html') {
      langdetect = 'html';
    }
  }

  const downloadURL = await getDownloadURL(sRef(storage, itemPath));
  const response = await fetch(downloadURL);

  if (!langdetect) {
    langdetect = 'plaintext';
  }

  let codeContent = await response.text();

  if (!codeContent) {
    codeContent = `This File is not viewable. Click [here](${downloadURL}) to download.`;
  }

  return { langdetect, codeContent };
}


function getAllMessages(email, email2, callback) {
  const messagesRef1 = ref(database, `messages/${email}-${email2}`);
  const messagesRef2 = ref(database, `messages/${email2}-${email}`);

  const handleSnapshot = (snapshot) => {
    if (snapshot.exists()) {
      let messages = [];

      snapshot.forEach((childSnapshot) => {
        const messageData = {
          Sender: childSnapshot.child('Sender').val(),
          Message: childSnapshot.child('message').val(),
          Time: childSnapshot.child('time').val(),
        };
        messages.push(messageData);
      });

      callback(messages);
    } else {
      callback([]);
    }
  };

  const handleError = (error) => {
    console.error('Error getting all messages: ' + error);
    // You might want to handle the error in your application, e.g., show an error message to the user
  };

  // Set up a listener for real-time updates
  onValue(messagesRef1, handleSnapshot, { error: handleError });
  onValue(messagesRef2, handleSnapshot, { error: handleError });

  // Return a function to remove the listeners when they are no longer needed
  return () => {
    off(messagesRef1, 'value', handleSnapshot);
    off(messagesRef2, 'value', handleSnapshot);
  };
}

async function getAllMessagesInitially(email, email2) {
  const messagesRef1 = ref(database, `messages/${email}-${email2}`);
  const messagesRef2 = ref(database, `messages/${email2}-${email}`);

  try {
    const snapshot1 = await get(messagesRef1);
    const snapshot2 = await get(messagesRef2);

    const messages1 = snapshot1.exists() ? parseSnapshot(snapshot1) : [];
    const messages2 = snapshot2.exists() ? parseSnapshot(snapshot2) : [];

    // Determine which array of messages to return based on existence and emptiness
    if (snapshot1.exists() && messages1.length > 0) {
      return messages1;
    } else if (snapshot2.exists() && messages2.length > 0) {
      return messages2;
    } else {
      // Handle the case where both snapshots are empty or don't exist
      return [];
    }
  } catch (error) {
    console.error('Error getting all messages initially: ' + error);
    // Handle the error in your application (e.g., show an error message to the user)
    return [];
  }
}

function parseSnapshot(snapshot) {
  let messages = [];

  snapshot.forEach((childSnapshot) => {
    const messageData = {
      Sender: childSnapshot.child('Sender').val(),
      Message: childSnapshot.child('message').val(),
      Time: childSnapshot.child('time').val(),
    };
    messages.push(messageData);
  });

  return messages;
}



async function getMessagedUsers(email) {
  const messagesRef = ref(database, `users/${email}/messages`);

  try {
    const snapshot = await get(messagesRef);

    if (snapshot.exists()) {
      // Get the string value from the snapshot
      const usersString = snapshot.val() || '';

      // Split the string into an array using commas as separators
      const usersArray = usersString.split(',');

      // Filter out empty strings from the array
      const filteredUsersArray = usersArray.filter((user) => user.trim() !== '');

      return filteredUsersArray;
    } else {
      // If the reference doesn't exist, return an empty array or handle it as needed
      return [];
    }
  } catch (error) {
    console.error('Error getting message users: ' + error);
    throw error;
  }
}


export {
  GetProjectData,
  GetAllProjectData, getMessagedUsers, getAllMessagesInitially,
  GetAllProjectsDataUnderProfile, getAllMessages,
  GetUserName, generateFolderData, getCodeContent, GetLikes, GetLikedList,
  GetUserPhotoUrl, GetFollower, GetFollowing, GetFollowingList, GetProjectThumbnailUrl, GetProjectTitle, GetProjectDescription
};