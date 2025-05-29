
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { value: timeRemaining.days, label: 'يوم', color: 'from-red-500 to-red-600' },
    { value: timeRemaining.hours, label: 'ساعة', color: 'from-orange-500 to-orange-600' },
    { value: timeRemaining.minutes, label: 'دقيقة', color: 'from-yellow-500 to-yellow-600' },
    { value: timeRemaining.seconds, label: 'ثانية', color: 'from-green-500 to-green-600' }
  ];

  return (
    <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse">
      {timeUnits.map((unit, index) => (
        <div key={index} className="text-center">
          <div className={`bg-gradient-to-br ${unit.color} rounded-lg p-4 min-w-[80px] shadow-lg transform hover:scale-105 transition-transform duration-200`}>
            <div className="text-3xl font-bold text-white">
              {unit.value.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-gray-300 text-sm mt-2 font-medium">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
