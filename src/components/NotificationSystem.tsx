
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();

      exams.forEach(exam => {
        const [startTime] = exam.time.split(' - ');
        const examDateTime = new Date(`${exam.date}T${startTime}`);
        const timeDiff = examDateTime.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        // إشعار قبل 3 أيام
        if (daysDiff === 3) {
          const notificationKey = `${exam.id}-3days`;
          const hasShown = localStorage.getItem(notificationKey);
          
          if (!hasShown) {
            toast({
              title: "تذكير امتحان",
              description: `امتحان ${exam.subject} خلال 3 أيام - ${exam.day}`,
            });
            localStorage.setItem(notificationKey, 'true');
          }
        }

        // إشعار قبل يوم واحد
        if (daysDiff === 1) {
          const notificationKey = `${exam.id}-1day`;
          const hasShown = localStorage.getItem(notificationKey);
          
          if (!hasShown) {
            toast({
              title: "تذكير امتحان",
              description: `امتحان ${exam.subject} غداً - ${startTime}`,
            });
            localStorage.setItem(notificationKey, 'true');
          }
        }
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [exams, toast]);

  return null;
};

export default NotificationSystem;
