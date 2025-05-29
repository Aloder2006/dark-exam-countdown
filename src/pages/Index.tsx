
import React, { useState, useEffect } from 'react';
import ExamCard from '../components/ExamCard';
import CountdownTimer from '../components/CountdownTimer';
import NotificationSystem from '../components/NotificationSystem';
import { Calendar, Clock, BookOpen } from 'lucide-react';

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  location: string;
  type: string;
  duration: string;
}

const Index = () => {
  const [exams] = useState<Exam[]>([
    {
      id: 1,
      subject: "الرياضيات المتقدمة",
      date: "2025-06-15",
      time: "09:00",
      location: "القاعة الرئيسية - مبنى العلوم",
      type: "امتحان نهائي",
      duration: "3 ساعات"
    },
    {
      id: 2,
      subject: "الفيزياء العامة",
      date: "2025-06-18",
      time: "10:30",
      location: "مختبر الفيزياء - الطابق الثاني",
      type: "امتحان نهائي",
      duration: "2.5 ساعة"
    },
    {
      id: 3,
      subject: "البرمجة المتقدمة",
      date: "2025-06-22",
      time: "14:00",
      location: "مختبر الحاسوب - مبنى التكنولوجيا",
      type: "امتحان عملي",
      duration: "4 ساعات"
    },
    {
      id: 4,
      subject: "الكيمياء التحليلية",
      date: "2025-06-25",
      time: "08:30",
      location: "مختبر الكيمياء - الطابق الأول",
      type: "امتحان نهائي",
      duration: "3 ساعات"
    }
  ]);

  const getNextExam = () => {
    const now = new Date();
    const upcomingExams = exams.filter(exam => {
      const examDateTime = new Date(`${exam.date}T${exam.time}`);
      return examDateTime > now;
    });
    
    return upcomingExams.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })[0];
  };

  const nextExam = getNextExam();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">نظام إدارة الامتحانات</h1>
            </div>
            <div className="flex items-center space-x-4 text-gray-300">
              <Calendar className="h-5 w-5" />
              <span>{new Date().toLocaleDateString('ar-SA')}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Countdown Section */}
        {nextExam && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 shadow-xl">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">الامتحان القادم</h2>
                <p className="text-blue-200 text-lg">{nextExam.subject}</p>
                <p className="text-gray-300">{nextExam.date} - {nextExam.time}</p>
              </div>
              <CountdownTimer targetDate={`${nextExam.date}T${nextExam.time}`} />
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">إجمالي الامتحانات</p>
                <p className="text-3xl font-bold text-white">{exams.length}</p>
              </div>
              <BookOpen className="h-12 w-12 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">الامتحانات المتبقية</p>
                <p className="text-3xl font-bold text-green-400">
                  {exams.filter(exam => new Date(`${exam.date}T${exam.time}`) > new Date()).length}
                </p>
              </div>
              <Clock className="h-12 w-12 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">الامتحانات المكتملة</p>
                <p className="text-3xl font-bold text-purple-400">
                  {exams.filter(exam => new Date(`${exam.date}T${exam.time}`) <= new Date()).length}
                </p>
              </div>
              <Calendar className="h-12 w-12 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Exams List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">جدول الامتحانات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </div>
      </main>

      {/* Notification System */}
      <NotificationSystem exams={exams} />
    </div>
  );
};

export default Index;
