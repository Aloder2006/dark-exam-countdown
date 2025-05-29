
import React, { useState } from 'react';
import ExamCard from '../components/ExamCard';
import CountdownTimer from '../components/CountdownTimer';
import NotificationSystem from '../components/NotificationSystem';
import { BookOpen, Clock } from 'lucide-react';

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  day: string;
}

const Index = () => {
  const [exams] = useState<Exam[]>([
    {
      id: 1,
      subject: "قضايا مجتمعية",
      date: "2025-05-22",
      time: "01:15",
      day: "الخميس"
    },
    {
      id: 2,
      subject: "برمجة الحاسب - ١",
      date: "2025-05-24",
      time: "02:00",
      day: "السبت"
    },
    {
      id: 3,
      subject: "ميكانيكا الكهرومغناطيسية",
      date: "2025-05-31",
      time: "02:00",
      day: "السبت"
    },
    {
      id: 4,
      subject: "احصاء و احتمالات",
      date: "2025-06-01",
      time: "09:30",
      day: "الأحد"
    },
    {
      id: 5,
      subject: "التصميم المنطقي",
      date: "2025-06-17",
      time: "09:30",
      day: "الثلاثاء"
    },
    {
      id: 6,
      subject: "نظرية الأعداد التطبيقية و نظرية المجال",
      date: "2025-06-19",
      time: "02:00",
      day: "الخميس"
    },
    {
      id: 7,
      subject: "رياضيات - ٢",
      date: "2025-06-21",
      time: "11:45",
      day: "السبت"
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
      <header className="bg-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">جدول الامتحانات</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Countdown Section */}
        {nextExam && (
          <div className="mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white mb-2">الامتحان القادم</h2>
                <p className="text-blue-400 text-lg">{nextExam.subject}</p>
                <p className="text-gray-300">{nextExam.day} - {nextExam.date} - {nextExam.time}</p>
              </div>
              <CountdownTimer targetDate={`${nextExam.date}T${nextExam.time}`} />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">الامتحانات المتبقية</p>
            <p className="text-2xl font-bold text-blue-400">
              {exams.filter(exam => new Date(`${exam.date}T${exam.time}`) > new Date()).length}
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">إجمالي الامتحانات</p>
            <p className="text-2xl font-bold text-green-400">{exams.length}</p>
          </div>
        </div>

        {/* Exams List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">جميع الامتحانات</h2>
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </main>

      {/* Notification System */}
      <NotificationSystem exams={exams} />
    </div>
  );
};

export default Index;
