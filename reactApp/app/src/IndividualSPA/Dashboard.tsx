import React from 'react';
import './css/Dashboard.css';  // For the styles
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// Sample data
const weeklyData = [
    { name: 'Mon', hours: 5 },
    { name: 'Tue', hours: 6 },
    { name: 'Wed', hours: 7 },
    { name: 'Thu', hours: 10 },
    { name: 'Fri', hours: 3 },
    // ...rest of the days
];

const projects = [
    'Project A',
    'Project B',
    'Project C',
    // ... add more projects as needed
];

function WorkingStatus({ isWorking }: { isWorking: boolean }) {
    return (
        <div className="status-container">
            <div className={`status-indicator ${isWorking ? 'active' : ''}`}></div>
            <span>{isWorking ? 'Currently Working' : 'Not Working'}</span>
        </div>
    );
}


function DailyActivity({ dailyPercentage }: { dailyPercentage: number }) {
    return (
        <div className="activity-metrics">
            <div>Daily Activity: {dailyPercentage}%</div>
        </div>
    );
}

function WeeklyActivity({ weeklyPercentage }: { weeklyPercentage: number }) {
    return (
        <div className="activity-metrics">
            <div>Weekly Activity: {weeklyPercentage}%</div>
        </div>
    );
}

function WeeklyBarGraph() {
    return (
        <BarChart width={500} height={300} data={weeklyData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="#82ca9d" />
        </BarChart>
    );
}

function ProjectDropdown({ selectedProject, onProjectChange }: { selectedProject: string, onProjectChange: (project: string) => void }) {
    return (
        <div className="project-dropdown">
            <label>Project: </label>
            <select value={selectedProject} onChange={(e) => onProjectChange(e.target.value)}>
                {projects.map(project => (
                    <option key={project} value={project}>
                        {project}
                    </option>
                ))}
            </select>
        </div>
    );
}

function Dashboard() {
    const sessions = [
        { id: 1, start: "2023-10-07 09:00", end: "2023-10-07 17:00", duration: "8h" },
        //... more sessions
    ];

    const [selectedProject, setSelectedProject] = React.useState(projects[0]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-top">
                <WeeklyBarGraph />
                <div className="activity-metrics-container">
                    <ProjectDropdown selectedProject={selectedProject} onProjectChange={setSelectedProject} />
                    <WorkingStatus isWorking={true} />
                    <DailyActivity dailyPercentage={80} />
                    <WeeklyActivity weeklyPercentage={75} />
                </div>
            </div>

                <table className="session-table">
                <thead>
                <tr>
                    <th>Session ID</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Duration</th>
                </tr>
                </thead>
                <tbody>
                {sessions.map(session => (
                    <tr key={session.id}>
                        <td>{session.id}</td>
                        <td>{session.start}</td>
                        <td>{session.end}</td>
                        <td>{session.duration}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
