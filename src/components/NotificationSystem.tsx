
import React, { useEffect } from 'react';

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  day: string;
}

interface NotificationSystemProps {
  exams: Exam[];
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ exams }) => {
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();

      exams.forEach(exam => {
        const [startTime] = exam.time.split(' - ');
        const examDateTime = new Date(`${exam.date}T${startTime}`);
        const timeDiff = examDateTime.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        // إشعار قبل يوم واحد فقط
        if (daysDiff === 1) {
          const notificationKey = `${exam.id}-1day`;
          const hasShown = localStorage.getItem(notificationKey);
          
          if (!hasShown && "Notification" in window && Notification.permission === "granted") {
            new Notification("تذكير امتحان", {
              body: `امتحان ${exam.subject} غداً - ${startTime}`,
              icon: "/favicon.ico"
            });
            localStorage.setItem(notificationKey, 'true');
          }
        }
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [exams]);

  return null;
};

export default NotificationSystem;
