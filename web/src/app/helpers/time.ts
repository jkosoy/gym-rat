export function formatTime(seconds:number):string {
    const sec = seconds % 60;
    const min = Math.floor(seconds / 60) % 60;
    const hrs = Math.floor(seconds / 3600);
  
    const formattedSec = sec.toString().padStart(2, '0');
    const formattedMin = min.toString().padStart(2, '0');
    const formattedHrs = hrs > 0 ? hrs.toString().padStart(1, '0') + ':' : '';
  
    return `${formattedHrs}${formattedMin}:${formattedSec}`;
  }