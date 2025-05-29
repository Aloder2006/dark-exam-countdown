
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
  const examDate = new Date(`${exam.date}T${exam.time}`);
  const now = new Date();
  const isUpcoming = examDate > now;

  return (
    <div className={`bg-gray-800 rounded-lg p-4 border transition-all duration-200 ${
      isUpcoming ? 'border-blue-500' : 'border-gray-600 opacity-70'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">{exam.subject}</h3>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-300">
              <Calendar className="h-4 w-4 mr-2 text-blue-400" />
              <span>{exam.day} - {exam.date}</span>
            </div>
            
            <div className="flex items-center text-gray-300">
              <Clock className="h-4 w-4 mr-2 text-green-400" />
              <span>{exam.time}</span>
            </div>
          </div>
        </div>

        <div className={`w-3 h-3 rounded-full ${
          isUpcoming ? 'bg-green-500' : 'bg-gray-500'
        }`}></div>
      </div>

      {isUpcoming && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-sm text-blue-400">
            {Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} يوم متبقي
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCard;
