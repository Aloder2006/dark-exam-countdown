
import React, { useState, useEffect } from 'react';
import ExamCard from '../components/ExamCard';
import CountdownTimer from '../components/CountdownTimer';
import NotificationSystem from '../components/NotificationSystem';
import { Toaster } from '../components/ui/toaster';
import { Button } from '../components/ui/button';
import { Bell, BellOff, Calendar, Clock, Star } from 'lucide-react';

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

const Index = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: false,
    oneDayBefore: true,
    oneHourBefore: true,
    thirtyMinBefore: true,
    sound: true
  });

  const [isLoading, setIsLoading] = useState(false);
  
  const [exams] = useState<Exam[]>([
    {
      id: 1,
      subject: "قضايا مجتمعية",
      date: "2025-05-22",
      time: "01:15 - 02:15",
      day: "الخميس"
    },
    {
      id: 2,
      subject: "برمجة الحاسب - ١",
      date: "2025-05-24",
      time: "02:00 - 04:00",
      day: "السبت"
    },
    {
      id: 3,
      subject: "ميكانيكا الكهرومغناطيسية",
      date: "2025-05-31",
      time: "02:00 - 04:00",
      day: "السبت"
    },
    {
      id: 4,
      subject: "احصاء و احتمالات",
      date: "2025-06-01",
      time: "09:30 - 11:30",
      day: "الأحد"
    },
    {
      id: 5,
      subject: "التصميم المنطقي",
      date: "2025-06-17",
      time: "09:30 - 11:30",
      day: "الثلاثاء"
    },
    {
      id: 6,
      subject: "نظرية الأعداد التطبيقية و نظرية المجال",
      date: "2025-06-19",
      time: "02:00 - 04:00",
      day: "الخميس"
    },
    {
      id: 7,
      subject: "رياضيات - ٢",
      date: "2025-06-21",
      time: "11:45 - 01:45",
      day: "السبت"
    }
  ]);

  // تحميل الإعدادات من localStorage عند التحميل الأول
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setNotificationSettings(parsed);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }, []);

  // حفظ الإعدادات في localStorage عند التغيير
  useEffect(() => {
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }, [notificationSettings]);

  const getNextExam = () => {
    const now = new Date();
    const upcomingExams = exams.filter(exam => {
      const [startTime] = exam.time.split(' - ');
      const examDateTime = new Date(`${exam.date}T${startTime}`);
      return examDateTime > now;
    });
    
    return upcomingExams.sort((a, b) => {
      const [startTimeA] = a.time.split(' - ');
      const [startTimeB] = b.time.split(' - ');
      const dateA = new Date(`${a.date}T${startTimeA}`);
      const dateB = new Date(`${b.date}T${startTimeB}`);
      return dateA.getTime() - dateB.getTime();
    })[0];
  };

  const nextExam = getNextExam();

  const toggleNotifications = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (!notificationSettings.enabled) {
        if ("Notification" in window) {
          console.log('Requesting notification permission...');
          const permission = await Notification.requestPermission();
          console.log('Permission result:', permission);
          
          if (permission === "granted") {
            setNotificationSettings(prev => ({ 
              ...prev, 
              enabled: true,
              oneDayBefore: true,
              oneHourBefore: true,
              thirtyMinBefore: true,
              sound: true
            }));
          } else {
            alert("يجب السماح بالإشعارات لتفعيل هذه الميزة");
          }
        } else {
          alert("متصفحك لا يدعم الإشعارات");
        }
      } else {
        setNotificationSettings(prev => ({ ...prev, enabled: false }));
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      alert("حدث خطأ أثناء تفعيل الإشعارات");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-arabic flex items-center justify-center" dir="rtl">
        <div className="text-2xl animate-pulse">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-arabic relative overflow-hidden" dir="rtl">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <main className="relative z-10 max-w-5xl mx-auto p-3 sm:p-4">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              جدول الامتحانات
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">نظام ذكي لتنظيم امتحاناتك وإدارة وقتك بكفاءة</p>
          
          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <Button
              onClick={toggleNotifications}
              variant={notificationSettings.enabled ? "default" : "outline"}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl transition-all duration-500 transform hover:scale-105 ${
                notificationSettings.enabled 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-2xl shadow-green-500/25' 
                  : 'bg-gray-900/50 hover:bg-gray-800/80 text-gray-300 border-gray-700 backdrop-blur-sm'
              }`}
            >
              {notificationSettings.enabled ? <Bell className="h-4 w-4 sm:h-5 sm:w-5" /> : <BellOff className="h-4 w-4 sm:h-5 sm:w-5" />}
              {isLoading ? "جاري التحميل..." : (notificationSettings.enabled ? "الإشعارات مفعلة" : "تفعيل الإشعارات")}
            </Button>
          </div>
        </div>

        {nextExam && (
          <div className="mb-8 sm:mb-10">
            <div className="relative group">
              {/* Enhanced Next Exam Card */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                    <span className="text-amber-400 font-bold text-sm sm:text-base">الامتحان القادم</span>
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                  </div>
                </div>
                
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-2xl font-black text-white mb-3 leading-tight">
                    {nextExam.subject}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 mb-3 sm:mb-4 text-gray-300">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg backdrop-blur-sm">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                      <span className="font-semibold text-xs sm:text-sm">{nextExam.day}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg backdrop-blur-sm">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                      <span className="font-semibold text-xs sm:text-sm">{nextExam.time}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm sm:text-lg text-gray-300 mb-4 sm:mb-6 font-medium">
                    {nextExam.date}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-center mb-2">
                    <span className="text-gray-400 text-xs sm:text-sm font-medium">باقي على بداية الامتحان</span>
                  </div>
                  <CountdownTimer targetDate={`${nextExam.date}T${nextExam.time.split(' - ')[0]}`} />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                جميع الامتحانات
              </span>
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid gap-3 sm:gap-4">
            {exams.map((exam, index) => (
              <div key={exam.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <ExamCard exam={exam} />
              </div>
            ))}
          </div>
        </div>
      </main>

      {notificationSettings.enabled && <NotificationSystem exams={exams} settings={notificationSettings} />}
      <Toaster />
    </div>
  );
};

export default Index;
