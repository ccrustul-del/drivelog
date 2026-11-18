const BASE='https://www.gstatic.com/firebasejs/13.3.0';
export async function connectFirebaseSync(config,{onTrips=()=>{},onVehicles=()=>{}}={}){
  const [appSdk,storeSdk]=await Promise.all([import(`${BASE}/firebase-app.js`),import(`${BASE}/firebase-firestore.js`)]);
  const app=appSdk.initializeApp(config,`drivelog-${config.projectId}`);
  const db=storeSdk.initializeFirestore(app,{localCache:storeSdk.persistentLocalCache({tabManager:storeSdk.persistentMultipleTabManager()})});
  const tripsRef=storeSdk.collection(db,'trips'),vehiclesRef=storeSdk.collection(db,'vehicles');
  const unsubTrips=storeSdk.onSnapshot(tripsRef,s=>onTrips(s.docs.map(d=>d.data())),e=>console.error('Firebase trips sync:',e));
  const unsubVehicles=storeSdk.onSnapshot(vehiclesRef,s=>onVehicles(s.docs.map(d=>d.data())),e=>console.error('Firebase vehicles sync:',e));
  return {publishTrip:t=>storeSdk.setDoc(storeSdk.doc(db,'trips',t.id),t),publishVehicle:v=>storeSdk.setDoc(storeSdk.doc(db,'vehicles',v.id),v),deleteTrip:id=>storeSdk.deleteDoc(storeSdk.doc(db,'trips',id)),deleteVehicle:id=>storeSdk.deleteDoc(storeSdk.doc(db,'vehicles',id)),close(){unsubTrips();unsubVehicles()}};
}
