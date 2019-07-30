import admin from 'firebase-admin'
import functions from  'firebase-functions'


admin.initializeApp(functions.config().firebase);

export default db = admin.firestore();