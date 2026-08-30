export function formatTime(seconds:number):string {
    const sec = seconds % 60;
    const min = Math.floor(seconds / 60) % 60;
    const hrs = Math.floor(seconds / 3600);
  
    const formattedSec = sec.toString().padStart(2, '0');
    const formattedMin = min.toString().padStart(2, '0');
    const formattedHrs = hrs > 0 ? hrs.toString().padStart(1, '0') + ':' : '';
  
    return `${formattedHrs}${formattedMin}:${formattedSec}`;
  }

export function formatDuration(seconds:number):string {
    const totalSeconds = Math.max(0, Math.round(seconds));

    const sec = totalSeconds % 60;
    const min = Math.floor(totalSeconds / 60) % 60;
    const hrs = Math.floor(totalSeconds / 3600);

    const formattedSec = sec.toString().padStart(2, '0');
    const formattedMin = min.toString().padStart(2, '0');
    const formattedHrs = hrs.toString().padStart(2, '0');

    return `${formattedHrs}:${formattedMin}:${formattedSec}`;
}
