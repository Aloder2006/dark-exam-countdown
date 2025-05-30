
import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  day: string;
}

interface ExamCardProps {
  exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const [startTime, endTime] = exam.time.split(' - ');
  const examDate = new Date(`${exam.date}T${startTime}`);
  const now = new Date();
  const isUpcoming = examDate > now;
  const isPast = examDate < now;

  const getTimeUntilExam = () => {
    const diffTime = examDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = () => {
    if (isPast) return 'from-gray-600 to-gray-700';
    if (isUpcoming) {
      const daysLeft = getTimeUntilExam();
      if (daysLeft <= 1) return 'from-red-500 to-pink-500';
      if (daysLeft <= 3) return 'from-orange-500 to-amber-500';
      return 'from-blue-500 to-cyan-500';
    }
    return 'from-yellow-500 to-orange-500';
  };

  const getStatusIcon = () => {
    if (isPast) return <CheckCircle className="h-5 w-5" />;
    if (isUpcoming && getTimeUntilExam() <= 1) return <AlertCircle className="h-5 w-5" />;
    return <Calendar className="h-5 w-5" />;
  };

  return (
    <div className={`relative group transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 ${
      isPast ? 'opacity-70' : ''
    }`}>
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor()} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500`}></div>
      
      <div className={`relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-500 ${
        isPast ? 'border-gray-700/50' : 
        isUpcoming ? 'border-blue-500/30 group-hover:border-blue-400/50' : 'border-gray-600/50'
      } shadow-2xl`}>
        
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-white leading-tight flex-1 ml-4">{exam.subject}</h3>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${getStatusColor()} text-white shadow-lg`}>
            {getStatusIcon()}
            {isPast ? 'منتهي' : isUpcoming ? 'قادم' : 'اليوم'}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-xl ml-4">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">{exam.day}</span>
              <span className="text-gray-400 text-sm">{exam.date}</span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
            <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-xl ml-4">
              <Clock className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">من {startTime} إلى {endTime}</span>
              <span className="text-gray-400 text-sm">مدة الامتحان: ساعتان</span>
            </div>
          </div>
        </div>

        {isUpcoming && (
          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${getStatusColor()} text-white shadow-lg`}>
              <AlertCircle className="h-4 w-4" />
              {getTimeUntilExam() === 1 ? 'غداً' : getTimeUntilExam() === 0 ? 'اليوم' : `${getTimeUntilExam()} يوم متبقي`}
            </div>
          </div>
        )}

        {isPast && (
          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg">
              <CheckCircle className="h-4 w-4" />
              انتهى الامتحان
            </div>
          </div>
        )}

        {/* Decorative corner elements */}
        <div className="absolute top-3 right-3 w-2 h-2 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-3 left-3 w-2 h-2 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default ExamCard;
