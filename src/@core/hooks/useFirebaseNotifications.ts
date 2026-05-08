import { useEffect } from "react";
import { messaging, getToken, onMessage } from "src/@core/utils/firebase";

export const useFirebaseNotifications = () => {
  useEffect(() => {
    if (!messaging) return;

    if(Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted" && messaging) {
            getToken(messaging, {vapidKey: process.env.NEXT_PUBLIC_VAP_ID})
              .then((currentToken) => {
                if (currentToken) {
                  console.log("FCM Token:", currentToken);
                  // ✅ send this token to your backend
                } else {
                  console.log("No registration token available.");
                }
              })
              .catch((err) => {
                console.log("An error occurred while retrieving token. ", err);
              });
          }
        });
    } else {
      if(messaging) {
        getToken(messaging, {vapidKey: process.env.NEXT_PUBLIC_VAP_ID})
          .then((currentToken) => {
            if (currentToken) {
              console.log("FCM Token:", currentToken);
              // ✅ send this token to your backend
            } else {
              console.log("No registration token available.");
            }
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
          });
      }
    }

    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // 🎉 show custom toast or alert
    });
  }, []);
};
