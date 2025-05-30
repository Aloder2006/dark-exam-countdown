
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
    <div className="flex justify-center items-center gap-4">
      {timeUnits.map((unit, index) => (
        <div key={index} className="text-center group">
          <div className={`relative bg-gradient-to-br ${unit.color} p-6 min-w-[90px] min-h-[90px] rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-300 border border-white/10`}>
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${unit.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className="text-3xl font-black text-white mb-1 drop-shadow-lg">
                {unit.value.toString().padStart(2, '0')}
              </div>
              <div className="text-white/90 text-sm font-bold uppercase tracking-wider">
                {unit.label}
              </div>
            </div>
            
            {/* Corner decorations */}
            <div className="absolute top-2 right-2 w-1 h-1 bg-white/50 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
