
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
    { value: timeRemaining.days, label: 'يوم', color: 'from-red-500 to-pink-500' },
    { value: timeRemaining.hours, label: 'ساعة', color: 'from-orange-500 to-amber-500' },
    { value: timeRemaining.minutes, label: 'دقيقة', color: 'from-green-500 to-emerald-500' },
    { value: timeRemaining.seconds, label: 'ثانية', color: 'from-blue-500 to-cyan-500' }
  ];

  return (
    <div className="flex justify-center items-center gap-1.5 sm:gap-3 px-2">
      {timeUnits.map((unit, index) => (
        <div key={index} className="text-center group flex-1 max-w-[60px] sm:max-w-[70px]">
          <div className={`relative bg-gradient-to-br ${unit.color} p-2 sm:p-3 min-w-[55px] sm:min-w-[65px] min-h-[55px] sm:min-h-[65px] rounded-lg sm:rounded-xl shadow-xl transform group-hover:scale-105 transition-all duration-300 border border-white/10`}>
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${unit.color} rounded-lg sm:rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="text-lg sm:text-2xl font-black text-white mb-0.5 drop-shadow-lg">
                {unit.value.toString().padStart(2, '0')}
              </div>
              <div className="text-white/90 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                {unit.label}
              </div>
            </div>
            
            {/* Corner decorations */}
            <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-white/50 rounded-full"></div>
            <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-white/50 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
