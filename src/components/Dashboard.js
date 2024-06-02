import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlerts } from '../features/alerts/alertsSlice';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alerts.data);
  const alertStatus = useSelector((state) => state.alerts.status);
  const alertError = useSelector((state) => state.alerts.error);

  useEffect(() => {
    if (alertStatus === 'idle') {
      dispatch(fetchAlerts());
    }
  }, [dispatch, alertStatus]);

  useEffect(() => {
    console.log(alerts); // Debugging: check data structure
  }, [alerts]);

  if (alertStatus === 'loading') {
    return <div className="min-h-screen flex items-center justify-center  bg-gray-900 text-white p-5"><div role="status">
    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div></div>;
  }

  if (alertStatus === 'failed') {
    return <div className="min-h-screen bg-gray-900 text-white p-5">Failed to load data: {alertError}</div>;
  }

  const alertData = alerts.filter((alert) => alert.event_type === 'alert');

  const alertCategories = alertData.reduce((acc, alert) => {
    const category = alert.alert.category;
    if (!acc[category]) acc[category] = 0;
    acc[category]++;
    return acc;
  }, {});

  
  const barData = {
    labels: Object.keys(alertCategories),
    datasets: [
      {
        label: 'Alert Categories',
        data: Object.values(alertCategories),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)', // Red
          'rgba(54, 162, 235, 0.5)', // Blue
          'rgba(255, 206, 86, 0.5)', // Yellow
          'rgba(255, 255, 255)', // Green
          'rgba(153, 102, 255, 0.5)', // Purple
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'rgba(255,255,255,0.7)',
          },
        },
        x: {
          ticks: {
            color: 'rgba(255,255,255,0.7)',
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: 'rgba(255,255,255,0.7)',
          },
        },
      },
    },
  };
  
  const pieData = {
    labels: ['Allowed', 'Blocked'],
    datasets: [
      {
        data: [
        alertData.filter((alert) => alert.alert.action === 'allowed').length,
        alertData.filter((alert) => alert.alert.action === 'blocked').length,
        ],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const lineData = {
    labels: alertData.map((alert) => new Date(alert.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Alerts Over Time',
        data: alertData.map((alert) => alert.alert.severity),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const severityLevels = alertData.reduce((acc, alert) => {
    const severity = alert.alert.severity;
    if (!acc[severity]) acc[severity] = 0;
    acc[severity]++;
    return acc;
  }, {});

  const severityData = {
    labels: Object.keys(severityLevels).map(level => `Severity ${level}`),
    datasets: [
      {
        data: Object.values(severityLevels),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const sourceIPs = alertData.reduce((acc, alert) => {
    const src_ip = alert.src_ip;
    if (!acc[src_ip]) acc[src_ip] = 0;
    acc[src_ip]++;
    return acc;
  }, {});

  const topSourceIPs = Object.entries(sourceIPs).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const sourceIPData = {
    labels: topSourceIPs.map(([ip]) => ip),
    datasets: [
      {
        label: 'Top Source IPs',
        data: topSourceIPs.map(([, count]) => count),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const protocolCounts = alertData.reduce((acc, alert) => {
    const proto = alert.proto;
    if (!acc[proto]) acc[proto] = 0;
    acc[proto]++;
    return acc;
  }, {});

  const protocolData = {
    labels: Object.keys(protocolCounts),
    datasets: [
      {
        data: Object.values(protocolCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-2xl mb-5">Security Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-[100%] sm:w-[90%] lg:w-[100%]  mx-auto gap-5">
        <div className="bg-gray-800 p-5   rounded shadow">
          <h2 className="text-xl mb-3">Alert Categories</h2>
          <Bar data={barData}  />
        </div>
        <div className="bg-gray-800 p-5 rounded shadow">
          <h2 className="text-xl mb-3">Alert Actions</h2>
          <Pie data={pieData} />
        </div>
        <div className="bg-gray-800 p-5 rounded shadow">
          <h2 className="text-xl mb-3">Alerts Over Time</h2>
          <Line data={lineData} />
        </div>
        <div className="bg-gray-800 p-5 rounded shadow">
          <h2 className="text-xl mb-3">Alert Severity Distribution</h2>
          <Pie data={severityData} />
        </div>
        <div className="bg-gray-800 p-5 rounded shadow">
          <h2 className="text-xl mb-3">Top Source IPs</h2>
          <Bar data={sourceIPData} />
        </div>
        <div className="bg-gray-800 p-5 rounded shadow">
          <h2 className="text-xl mb-3">Protocol Usage</h2>
          <Doughnut data={protocolData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

