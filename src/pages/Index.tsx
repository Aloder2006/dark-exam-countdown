
import React, { useState } from 'react';
import ExamCard from '../components/ExamCard';
import CountdownTimer from '../components/CountdownTimer';
import NotificationSystem from '../components/NotificationSystem';
import { Toaster } from '../components/ui/toaster';
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
  const remainingExams = exams.filter(exam => {
    const [startTime] = exam.time.split(' - ');
    const examDateTime = new Date(`${exam.date}T${startTime}`);
    return examDateTime > new Date();
  }).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">جدول الامتحانات</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {nextExam && (
          <div className="mb-8">
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">الامتحان القادم</h2>
              <p className="text-blue-400 text-xl mb-2">{nextExam.subject}</p>
              <p className="text-gray-300 mb-6">{nextExam.day} - {nextExam.date}</p>
              <CountdownTimer targetDate={`${nextExam.date}T${nextExam.time.split(' - ')[0]}`} />
            </div>
          </div>
        )}

        <div className="mb-8 text-center">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-center space-x-4">
              <Clock className="h-6 w-6 text-blue-400" />
              <span className="text-xl text-gray-300">الامتحانات المتبقية:</span>
              <span className="text-2xl font-bold text-blue-400">{remainingExams}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">جميع الامتحانات</h2>
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </main>

      <NotificationSystem exams={exams} />
      <Toaster />
    </div>
  );
};

export default Index;
