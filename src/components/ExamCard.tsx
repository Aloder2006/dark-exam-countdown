
import React from 'react';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  location: string;
  type: string;
  duration: string;
}

interface ExamCardProps {
  exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const examDate = new Date(`${exam.date}T${exam.time}`);
  const now = new Date();
  const isUpcoming = examDate > now;
  const isPassed = examDate <= now;

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border transition-all duration-300 hover:scale-105 ${
      isUpcoming ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 
      isPassed ? 'border-gray-600 opacity-75' : 'border-gray-700'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{exam.subject}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            exam.type === 'امتحان نهائي' ? 'bg-red-900 text-red-200' :
            exam.type === 'امتحان عملي' ? 'bg-green-900 text-green-200' :
            'bg-blue-900 text-blue-200'
          }`}>
            {exam.type}
          </span>
        </div>
        <div className={`w-4 h-4 rounded-full ${
          isUpcoming ? 'bg-green-500' : 'bg-gray-500'
        }`}></div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-300">
          <Calendar className="h-4 w-4 mr-3 text-blue-400" />
          <span>{new Date(exam.date).toLocaleDateString('ar-SA')}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Clock className="h-4 w-4 mr-3 text-green-400" />
          <span>{exam.time} - المدة: {exam.duration}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <MapPin className="h-4 w-4 mr-3 text-purple-400" />
          <span>{exam.location}</span>
        </div>
      </div>

      {isUpcoming && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-blue-400">
            {Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} يوم متبقي
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCard;
