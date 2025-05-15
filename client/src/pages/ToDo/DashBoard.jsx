import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import ToDoServices from "../../services/ToDoServices";
import { getUserDetails } from "../../util/GetUser";
import Navbarr from '../../component/Navbarr';
import './dashboard.css';
import { message } from "antd";

export default function Dashboard() {

  const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"];

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    tasksCompletedToday: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getUserDetails();
        console.log("User for dashboard", user);
        console.log("User ID:", user?.userId);  // Debug log

        if (!user?.userId) {
          message.error("User ID not Found");
          return;
        }

        const response = await ToDoServices.dashBoard(user.userId);
        console.table("dash board", response.data);
        setStats(response.data);

      } catch (error) {
        message.error("Error fetching dashboard data")
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // Data for the bar chart
  const chartData = [
    { name: "Total Tasks", value: stats.totalTasks },
    { name: "Completed", value: stats.completedTasks },
    { name: "Pending", value: stats.pendingTasks },
    { name: "Completed Today", value: stats.tasksCompletedToday },
  ];

  return (
    <>
      <Navbarr />
      <div className="container-fluid p-4">
        {/* Jumbotron */}
        <div className="jumbotron jumbotron-fluid rounded bg-white border-0 shadow-sm px-2 pb-2">
          <div className="container">
            <h1 className="display-4 mb-2 text-">DashBoard</h1>
            <p className="lead text-muted">Admin Dashboard to Visualize.</p>
          </div>

          {/* Task Summary Section */}
          <section className="row g-4 mt-3">
            {[
              { icon: "bi bi-list-task", text: "Total Tasks", value: stats.totalTasks },
              { icon: "bi bi-check-circle", text: "Completed Tasks", value: stats.completedTasks },
              { icon: "bi bi-x-circle", text: "Incomplete Tasks", value: stats.pendingTasks },
              { icon: "bi bi-calendar-check", text: "Today’s Completed", value: stats.tasksCompletedToday }
            ].map((item, index) => (

              <div key={index} className="col-6 col-md-3" >
                <article className="p-4 rounded shadow-sm border-left text-center bg-white" >
                  <a href="#" className="d-flex flex-column align-items-center text-decoration-none text-dark">
                    <span className={`${item.icon} h4 text-primary`}></span>
                    <h5 className="mt-2">{item.text}</h5>
                    <h3 className="display-6 fw-bold mt-1">{item.value}</h3>
                  </a>
                </article>
              </div>

            ))}
          </section>
        </div>

        {/* Task Overview Chart */}
        <div className="mt-5 bg-white p-4 rounded shadow-sm w-100">
          <h2 className="text-lg font-bold text-gray-800 mb-3">📊 Task Overview</h2>

          <ResponsiveContainer width="90%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }} />
              <YAxis tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }} />
              <Tooltip />

              <defs>
                <linearGradient id="colorTask" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={1} />
                </linearGradient>
              </defs>

              <Bar dataKey="value" fill="url(#colorTask)" radius={[6, 6, 0, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-5 bg-white p-4 rounded shadow-sm w-100">
          <h2 className="text-lg font-bold text-gray-800 mb-3">📊 Task Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </>
  );
} 