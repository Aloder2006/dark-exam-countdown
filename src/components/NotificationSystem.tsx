
import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  location: string;
  type: string;
  duration: string;
}

interface NotificationSystemProps {
  exams: Exam[];
}

interface Notification {
  id: string;
  message: string;
  exam: Exam;
  type: 'reminder' | 'urgent';
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ exams }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const newNotifications: Notification[] = [];

      exams.forEach(exam => {
        const examDateTime = new Date(`${exam.date}T${exam.time}`);
        const timeDiff = examDateTime.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60));

        // إشعار قبل 3 أيام
        if (daysDiff === 3) {
          const notificationId = `${exam.id}-3days`;
          if (!notifications.find(n => n.id === notificationId)) {
            newNotifications.push({
              id: notificationId,
              message: `تذكير: امتحان ${exam.subject} خلال 3 أيام`,
              exam,
              type: 'reminder'
            });
          }
        }

        // إشعار قبل يوم واحد
        if (daysDiff === 1) {
          const notificationId = `${exam.id}-1day`;
          if (!notifications.find(n => n.id === notificationId)) {
            newNotifications.push({
              id: notificationId,
              message: `تنبيه مهم: امتحان ${exam.subject} غداً في ${exam.time}`,
              exam,
              type: 'urgent'
            });
          }
        }

        // إشعار قبل 3 ساعات
        if (hoursDiff <= 3 && hoursDiff > 0) {
          const notificationId = `${exam.id}-3hours`;
          if (!notifications.find(n => n.id === notificationId)) {
            newNotifications.push({
              id: notificationId,
              message: `عاجل: امتحان ${exam.subject} خلال ${hoursDiff} ساعة`,
              exam,
              type: 'urgent'
            });
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...prev, ...newNotifications]);
        
        // إظهار toast للإشعارات الجديدة
        newNotifications.forEach(notification => {
          toast({
            title: notification.type === 'urgent' ? '🚨 تنبيه عاجل' : '🔔 تذكير',
            description: notification.message,
            duration: 5000,
          });
        });
      }
    };

    // فحص الإشعارات كل دقيقة
    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, [exams, notifications]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.length;

  return (
    <>
      {/* Notification Bell */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-20 right-6 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">الإشعارات</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                لا توجد إشعارات جديدة
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-700 ${
                    notification.type === 'urgent' ? 'bg-red-900/20' : 'bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {notification.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {notification.exam.location}
                      </p>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="text-gray-400 hover:text-white ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSystem;
