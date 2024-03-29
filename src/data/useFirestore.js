import { useState, useEffect } from 'react';
import firebase from './firebase';

const useFirestore = (collection, uid, limit = 5, page = 1) => {
    const [documents, setDocuments] = useState([]);
    const firestoreRef = firebase.firestore().collection(collection);

    useEffect(() => {
        firestoreRef
        .where("userID", "==", uid)
        .orderBy("date", "desc")
        .get()
        .then(data => {
            let dbCollections = [];
            data.forEach(item => {
                dbCollections.push(item.data());
            });
            setDocuments(dbCollections);
        })
        return () => firestoreRef;
    },[collection , uid, firestoreRef, limit]);
    
    return { documents };
}
export default useFirestore;