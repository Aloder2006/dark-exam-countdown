
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
    { value: timeRemaining.days, label: 'يوم' },
    { value: timeRemaining.hours, label: 'ساعة' },
    { value: timeRemaining.minutes, label: 'دقيقة' },
    { value: timeRemaining.seconds, label: 'ثانية' }
  ];

  return (
    <div className="flex justify-center items-center gap-0">
      {timeUnits.map((unit, index) => (
        <div key={index} className="text-center">
          <div className={`bg-gray-700 p-4 min-w-[70px] border border-gray-600 ${
            index === 0 ? 'rounded-r-xl' : ''
          } ${index === timeUnits.length - 1 ? 'rounded-l-xl' : ''}`}>
            <div className="text-2xl font-bold text-white">
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {unit.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
