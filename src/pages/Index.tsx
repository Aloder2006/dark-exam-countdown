
import React, { useState, useEffect } from 'react';
import ExamCard from '../components/ExamCard';
import CountdownTimer from '../components/CountdownTimer';
import NotificationSystem from '../components/NotificationSystem';
import { Toaster } from '../components/ui/toaster';
import { Button } from '../components/ui/button';
import { Bell, BellOff, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

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
            setNotificationSettings(prev => ({ ...prev, enabled: true }));
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

  const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white font-arabic flex items-center justify-center" dir="rtl">
        <div className="text-2xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white font-arabic" dir="rtl">
      <main className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            جدول الامتحانات
          </h1>
          
          <div className="flex justify-center items-center gap-4 mb-6">
            <Button
              onClick={toggleNotifications}
              variant={notificationSettings.enabled ? "default" : "outline"}
              disabled={isLoading}
              className={`flex items-center gap-3 px-6 py-3 text-lg rounded-xl transition-all duration-300 ${
                notificationSettings.enabled 
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg shadow-green-600/25' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600'
              }`}
            >
              {notificationSettings.enabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
              {isLoading ? "جاري التحميل..." : (notificationSettings.enabled ? "الإشعارات مفعلة" : "تفعيل الإشعارات")}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl border-gray-600 hover:bg-gray-700">
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-center">إعدادات الإشعارات</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="oneDayBefore" className="text-base">إشعار قبل يوم واحد</Label>
                    <Switch
                      id="oneDayBefore"
                      checked={notificationSettings.oneDayBefore}
                      onCheckedChange={(checked) => updateNotificationSetting('oneDayBefore', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="oneHourBefore" className="text-base">إشعار قبل ساعة واحدة</Label>
                    <Switch
                      id="oneHourBefore"
                      checked={notificationSettings.oneHourBefore}
                      onCheckedChange={(checked) => updateNotificationSetting('oneHourBefore', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="thirtyMinBefore" className="text-base">إشعار قبل 30 دقيقة</Label>
                    <Switch
                      id="thirtyMinBefore"
                      checked={notificationSettings.thirtyMinBefore}
                      onCheckedChange={(checked) => updateNotificationSetting('thirtyMinBefore', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound" className="text-base">تشغيل الصوت</Label>
                    <Switch
                      id="sound"
                      checked={notificationSettings.sound}
                      onCheckedChange={(checked) => updateNotificationSetting('sound', checked)}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {nextExam && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-gray-800 to-blue-800 rounded-2xl p-8 text-center border border-gray-700 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-2">الامتحان القادم</h2>
              <p className="text-blue-300 text-2xl mb-2 font-semibold">{nextExam.subject}</p>
              <p className="text-gray-300 mb-6 text-lg">{nextExam.day} - {nextExam.date}</p>
              <CountdownTimer targetDate={`${nextExam.date}T${nextExam.time.split(' - ')[0]}`} />
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white text-center mb-8">جميع الامتحانات</h2>
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </main>

      {notificationSettings.enabled && <NotificationSystem exams={exams} settings={notificationSettings} />}
      <Toaster />
    </div>
  );
};

export default Index;
