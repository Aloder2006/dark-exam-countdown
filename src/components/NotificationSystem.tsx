
import React, { useEffect } from 'react';

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  day: string;
}

interface NotificationSettings {
  enabled: boolean;
  oneDayBefore: boolean;
  oneHourBefore: boolean;
  thirtyMinBefore: boolean;
  sound: boolean;
}

interface NotificationSystemProps {
  exams: Exam[];
  settings: NotificationSettings;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ exams, settings }) => {
  useEffect(() => {
    if (!settings.enabled) {
      return;
    }

    const checkNotifications = () => {
      if (!("Notification" in window) || Notification.permission !== "granted") {
        return;
      }

      const now = new Date();

      exams.forEach(exam => {
        try {
          const [startTime] = exam.time.split(' - ');
          const examDateTime = new Date(`${exam.date}T${startTime}`);
          const timeDiff = examDateTime.getTime() - now.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          const hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60));
          const minutesDiff = Math.ceil(timeDiff / (1000 * 60));

          // إشعار قبل يوم واحد
          if (settings.oneDayBefore && daysDiff === 1 && hoursDiff <= 25) {
            const notificationKey = `${exam.id}-1day`;
            const hasShown = localStorage.getItem(notificationKey);
            
            if (!hasShown) {
              new Notification("تذكير امتحان", {
                body: `امتحان ${exam.subject} غداً الساعة ${startTime}`,
                icon: "/favicon.ico",
                tag: notificationKey,
                silent: !settings.sound
              });
              localStorage.setItem(notificationKey, 'true');
            }
          }

          // إشعار قبل ساعة واحدة
          if (settings.oneHourBefore && hoursDiff === 1 && minutesDiff <= 70) {
            const notificationKey = `${exam.id}-1hour`;
            const hasShown = localStorage.getItem(notificationKey);
            
            if (!hasShown) {
              new Notification("تذكير امتحان", {
                body: `امتحان ${exam.subject} خلال ساعة واحدة!`,
                icon: "/favicon.ico",
                tag: notificationKey,
                silent: !settings.sound
              });
              localStorage.setItem(notificationKey, 'true');
            }
          }

          // إشعار قبل 30 دقيقة
          if (settings.thirtyMinBefore && minutesDiff === 30) {
            const notificationKey = `${exam.id}-30min`;
            const hasShown = localStorage.getItem(notificationKey);
            
            if (!hasShown) {
              new Notification("تذكير امتحان", {
                body: `امتحان ${exam.subject} خلال 30 دقيقة! استعد الآن`,
                icon: "/favicon.ico",
                tag: notificationKey,
                silent: !settings.sound
              });
              localStorage.setItem(notificationKey, 'true');
            }
          }
        } catch (error) {
          console.error('Error processing notification for exam:', exam.id, error);
        }
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60000); // فحص كل دقيقة

    return () => clearInterval(interval);
  }, [exams, settings]);

  return null;
};

export default NotificationSystem;
