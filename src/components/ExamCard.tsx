
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

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

  return (
    <div className={`bg-gray-800 rounded-xl p-6 border transition-all duration-300 ${
      isPast ? 'border-gray-700 opacity-60' : 
      isUpcoming ? 'border-blue-500 hover:border-blue-400' : 'border-gray-600'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{exam.subject}</h3>
        <div className={`w-3 h-3 rounded-full ${
          isPast ? 'bg-gray-500' :
          isUpcoming ? 'bg-green-500' : 'bg-yellow-500'
        }`}></div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-300">
          <Calendar className="h-5 w-5 ml-3 text-blue-400" />
          <span className="font-medium">{exam.day}</span>
          <span className="mx-2">•</span>
          <span>{exam.date}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Clock className="h-5 w-5 ml-3 text-green-400" />
          <div className="flex flex-col">
            <span>من {startTime} إلى {endTime}</span>
            <span className="text-sm text-gray-400">مدة الامتحان: ساعتان</span>
          </div>
        </div>
      </div>

      {isUpcoming && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-blue-400 font-medium">
            {getTimeUntilExam() === 1 ? 'غداً' : `${getTimeUntilExam()} يوم متبقي`}
          </div>
        </div>
      )}

      {isPast && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-500 font-medium">
            انتهى الامتحان
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCard;
