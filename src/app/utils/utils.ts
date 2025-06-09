export function generateDate(): string {
    const now = new Date();

    const yyyy = now.getFullYear().toString();
    const mm = (now.getMonth() + 1).toString().padStart(2, '0'); // Mes (0-11) +1
    const dd = now.getDate().toString().padStart(2, '0');
    const hh = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');
    const ss = now.getSeconds().toString().padStart(2, '0');
    return `${yyyy}${mm}${dd}${hh}${min}${ss}`;
}
