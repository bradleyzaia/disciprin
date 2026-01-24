
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";

const currentDate = new Date("2026-01-31T12:00:00"); // Jan 2026

console.log("Testing Month View for:", currentDate.toString());

const start = startOfMonth(currentDate);
const end = endOfMonth(currentDate);

console.log("Start:", start.toString());
console.log("End:", end.toString());

const days = eachDayOfInterval({ start, end });
const columns = days.map(date => ({
    label: format(date, 'd'),
    sub: format(date, 'EEE'),
    id: format(date, 'yyyy-MM-dd'),
    type: 'day' as const
}));

console.log("Columns Length:", columns.length);
console.log("Last Column:", columns[columns.length - 1]);

const gridTemplateColumns = `240px repeat(${columns.length}, minmax(40px, 1fr))`;
console.log("Template:", gridTemplateColumns);
