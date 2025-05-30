
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
    if (isPast) return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
    if (isUpcoming && getTimeUntilExam() <= 1) return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
    return <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />;
  };

  return (
    <div className={`relative group transition-all duration-500 transform hover:scale-[1.01] hover:-translate-y-0.5 ${
      isPast ? 'opacity-70' : ''
    }`}>
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor()} rounded-xl blur-lg opacity-15 group-hover:opacity-30 transition-all duration-500`}></div>
      
      <div className={`relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 border transition-all duration-500 ${
        isPast ? 'border-gray-700/50' : 
        isUpcoming ? 'border-blue-500/30 group-hover:border-blue-400/50' : 'border-gray-600/50'
      } shadow-xl`}>
        
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white leading-tight flex-1 ml-3">{exam.subject}</h3>
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r ${getStatusColor()} text-white shadow-lg`}>
            {getStatusIcon()}
            {isPast ? 'منتهي' : isUpcoming ? 'قادم' : 'اليوم'}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg ml-3">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base">{exam.day}</span>
              <span className="text-gray-400 text-xs">{exam.date}</span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg ml-3">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base">من {startTime} إلى {endTime}</span>
              <span className="text-gray-400 text-xs">مدة الامتحان: ساعتان</span>
            </div>
          </div>
        </div>

        {isUpcoming && (
          <div className="mt-4 pt-3 border-t border-gray-700/50">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r ${getStatusColor()} text-white shadow-lg`}>
              <AlertCircle className="h-3 w-3" />
              {getTimeUntilExam() === 1 ? 'غداً' : getTimeUntilExam() === 0 ? 'اليوم' : `${getTimeUntilExam()} يوم متبقي`}
            </div>
          </div>
        )}

        {isPast && (
          <div className="mt-4 pt-3 border-t border-gray-700/50">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg">
              <CheckCircle className="h-3 w-3" />
              انتهى الامتحان
            </div>
          </div>
        )}

        {/* Decorative corner elements */}
        <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default ExamCard;
