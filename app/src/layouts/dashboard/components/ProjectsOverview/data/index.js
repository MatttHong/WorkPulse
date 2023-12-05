import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Helper function to format the date and time
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString(); // This will format the date and time according to the locale
}

function calculateIdleTime(logEntries) {
    return logEntries.reduce((totalIdleTime, entry) => {
        if (entry.status === "Idle") {
            const start = new Date(entry.start);
            const end = new Date(entry.end);
            const idleDuration = (end - start) / 1000 / 60; // Convert to minutes
            return totalIdleTime + idleDuration;
        }
        return totalIdleTime;
    }, 0);
}


export default function data(userLogs) {
    // If userLogs is null or undefined, return default structure with no rows
    if (!userLogs) {
        return {
            columns: [
                {Header: "Session Info", accessor: "info", width: "45%", align: "left"},
                {Header: "Status", accessor: "status", align: "left"},
            ],
            rows: [],
        };
    }

    // Sort userLogs by 'starting' status first, then by timestamp
    const sortedLogs = userLogs.sort((a, b) => {
        // Compare by status first
        if (a.status.toLowerCase() === 'starting' && b.status.toLowerCase() !== 'starting') {
            return -1;
        } else if (a.status.toLowerCase() !== 'starting' && b.status.toLowerCase() === 'starting') {
            return 1;
        } else {
            // If statuses are the same, compare by timestamp
            const dateA = new Date(a.startTimestamp).getTime();
            const dateB = new Date(b.startTimestamp).getTime();
            return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
        }
    });



    // Map sortedLogs to rows
    const logRows = userLogs.map((logEntry) => {
        // Check if logEntry.log and logEntry.log.status exist
        const log = logEntry.log;
        const status = log && log.status ? log.status.toLowerCase() : 'unknown';
        const formattedStartTime = log ? formatTimestamp(log.startTimestamp) : 'Unknown Time';

        let statusComponent;

        switch (status) {
            case 'finished':
                statusComponent = (
                    <Tooltip title="Finished" placement="bottom" arrow>
                        <CheckCircleRoundedIcon sx={{color: 'green'}}/>
                    </Tooltip>
                );
                break;
            case 'unknown':
                statusComponent = (
                    <Tooltip title="Unknown Status" placement="bottom" arrow>
                        <AccessTimeIcon sx={{color: 'orange'}}/>
                    </Tooltip>
                );
                break;
            default:
                statusComponent = (
                    <Tooltip title="Active" placement="bottom" arrow>
                        <AccessTimeIcon sx={{color: 'grey'}}/>
                    </Tooltip>
                );
        }

        const totalIdleTime = logEntry.log && Array.isArray(logEntry.log.log)
            ? calculateIdleTime(logEntry.log.log)
            : 0;

        return {
            info: (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    Start Time: {formattedStartTime}
                </MDTypography>
            ),
            status: statusComponent,
            idleTime: (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    {totalIdleTime} mins
                </MDTypography>
            ),
        };
    });

    return {
        columns: [
            {Header: "Session Info", accessor: "info", width: "45%", align: "left"},
            {Header: "Idle Time (mins)", accessor: "idleTime", align: "right"},
            {Header: "Status", accessor: "status", align: "right"}
        ],
        rows: logRows,
    };
}
