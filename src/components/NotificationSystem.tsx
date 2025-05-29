
import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

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

interface Notification {
  id: string;
  message: string;
  exam: Exam;
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

        // إشعار قبل 3 أيام
        if (daysDiff === 3) {
          const notificationId = `${exam.id}-3days`;
          if (!notifications.find(n => n.id === notificationId)) {
            newNotifications.push({
              id: notificationId,
              message: `امتحان ${exam.subject} خلال 3 أيام`,
              exam
            });
          }
        }

        // إشعار قبل يوم واحد
        if (daysDiff === 1) {
          const notificationId = `${exam.id}-1day`;
          if (!notifications.find(n => n.id === notificationId)) {
            newNotifications.push({
              id: notificationId,
              message: `امتحان ${exam.subject} غداً`,
              exam
            });
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...prev, ...newNotifications]);
      }
    };

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
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed bottom-20 left-6 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">الإشعارات</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                لا توجد إشعارات
              </div>
            ) : (
              notifications.map(notification => (
                <div key={notification.id} className="p-4 border-b border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {notification.exam.day} - {notification.exam.time}
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
