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
    const logRows = sortedLogs.map((log) => {
        const formattedStartTime = formatTimestamp(log.startTimestamp);
        let statusComponent;

        switch (log.status.toLowerCase()) {
            case 'starting':
                statusComponent = (
                    <Tooltip title="Ongoing" placement="bottom" arrow>
                        <AccessTimeIcon sx={{color: 'grey'}}/>
                    </Tooltip>
                );
                break;
            case 'closed':
                statusComponent = (
                    <Tooltip title="Closed" placement="bottom" arrow>
                        <CheckCircleRoundedIcon sx={{color: 'green'}}/>
                    </Tooltip>
                );
                break;
            default:
                statusComponent = (
                    <Tooltip title="Closed" placement="bottom" arrow>
                        <CheckCircleRoundedIcon sx={{color: 'green'}}/>
                    </Tooltip>
                );
        }

        return {
            info: (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    Start Time: {formattedStartTime}
                </MDTypography>
            ),
            status: statusComponent,
        };
    });

    return {
        columns: [
            {Header: "Session Info", accessor: "info", width: "45%", align: "left"},
            {Header: "Status", accessor: "status", align: "right"},
        ],
        rows: logRows,
    };
}
