import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarComponent({ selectedDate, setSelectedDate }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                locale="en-US"
            />
        </div>
    );
}

export default CalendarComponent;