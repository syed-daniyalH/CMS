//@ts-nocheck
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCC8HJPxZJUjfvXRaIBt7zufoiSuyHvT1w",
  authDomain: "indraaj-1729c.firebaseapp.com",
  projectId: "indraaj-1729c",
  messagingSenderId: "239583489416",
  appId: "1:239583489416:web:28a707f4361c5454431e3d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
