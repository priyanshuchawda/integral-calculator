import { Chart, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);
