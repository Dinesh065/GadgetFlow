// RentalCalendar.jsx (Improved with Right-Side Overdue Button & Calendar Controls)
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaExclamationTriangle } from "react-icons/fa";
import OverdueManager from "../components/OverdueManager";
import { API_BASE_URL } from "../config";

const localizer = momentLocalizer(moment);

export default function RentalCalendar() {
    const [includePast, setIncludePast] = useState(false);
    const [view, setView] = useState("month");
    const [currentDate, setCurrentDate] = useState(new Date());

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [alerts, setAlerts] = useState([]);
    const [showOverdueDialog, setShowOverdueDialog] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/rentals/fetchCalendarData?includePast=${includePast}`
                );
                const data = await response.json();

                const today = moment().startOf("day");

                const formattedEvents = data.map(item => {
                    const start = moment(item.rented_start);
                    const end = moment(item.rented_end);

                    let status = "";
                    if (end.isBefore(today)) status = "overdue";
                    else if (end.isSame(today)) status = "due";
                    else status = "booked";

                    return {
                        title: `${item.name} - ${item.renterName}`,
                        start: start.toDate(),
                        end: end.toDate(),
                        allDay: true,
                        status,
                        details: item
                    };
                });

                setEvents(formattedEvents);
                setFilteredEvents(formattedEvents);

                const overdueAlerts = formattedEvents.filter(e => e.status === "overdue").map(e => ({
                    item: e.details.name,
                    renter: e.details.renterName,
                    contact: e.details.renterContact,
                    returnDate: moment(e.end).format("LL")
                }));
                setAlerts(overdueAlerts);

            } catch (error) {
                console.error("Error fetching rental data:", error);
            }
        };

        fetchData();
    }, [includePast]);


    useEffect(() => {
        const filtered = events.filter(event => {
            const matchesStatus = statusFilter ? event.status === statusFilter : true;
            const matchesDate = dateFilter
                ? moment(event.start).isSame(moment(dateFilter), "day")
                : true;
            return matchesStatus && matchesDate;
        });
        setFilteredEvents(filtered);
    }, [statusFilter, dateFilter, events]);

    const eventStyleGetter = event => {
        let backgroundColor = "#28a745";
        if (event.status === "booked") backgroundColor = "#dc3545";
        else if (event.status === "due") backgroundColor = "#fd7e14";
        else if (event.status === "overdue") backgroundColor = "#6c757d";

        return {
            style: {
                backgroundColor,
                borderRadius: "5px",
                color: "white",
                border: "none",
                padding: "2px 4px"
            }
        };
    };

    return (
        <div className="bg-gray-50 pt-20">
            <div className="p-6 relative">
                <h2 className="text-2xl font-bold mb-4">Rental Calendar</h2>

                {/* Right Side Overdue Button */}
                <div className="absolute top-6 right-6">
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setShowOverdueDialog(true)}
                    >
                        Overdues ({alerts.length})
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-4">
                    <select
                        className="border rounded px-3 py-1"
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="booked">Booked</option>
                        <option value="due">Due Today</option>
                        <option value="overdue">Overdue</option>
                    </select>

                    <input
                        type="date"
                        className="border rounded px-3 py-1"
                        onChange={e => setDateFilter(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="includePast"
                        checked={includePast}
                        onChange={(e) => setIncludePast(e.target.checked)}
                    />
                    <label htmlFor="includePast" className="text-sm">
                        Show Past Rentals
                    </label>
                </div>


                <div style={{ height: 600 }}>
                    <Calendar
                        localizer={localizer}
                        events={filteredEvents}
                        startAccessor="start"
                        endAccessor="end"
                        eventPropGetter={eventStyleGetter}
                        onSelectEvent={event => setSelectedEvent(event)}
                        onSelectSlot={(slotInfo) => alert(`No rentals on ${moment(slotInfo.start).format("LL")}`)}
                        selectable
                        views={['month', 'week', 'day', 'agenda']}
                        view={view}
                        onView={(newView) => setView(newView)}
                        date={currentDate}
                        onNavigate={(newDate) => setCurrentDate(newDate)}
                        defaultView="month"
                    />

                </div>

                {selectedEvent && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
                            <h3 className="text-xl font-bold mb-2">{selectedEvent.title}</h3>
                            <p><strong>From:</strong> {moment(selectedEvent.start).format("LL")}</p>
                            <p><strong>To:</strong> {moment(selectedEvent.end).format("LL")}</p>
                            <p><strong>Status:</strong> {selectedEvent.status}</p>
                            <p><strong>Item:</strong> {selectedEvent.details.name}</p>
                            <p><strong>Renter:</strong> {selectedEvent.details.renterName}</p>
                            <p><strong>Contact:</strong> {selectedEvent.details.renterContact}</p>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                    onClick={() => alert("Contacting renter...")}
                                >
                                    Contact Renter
                                </button>
                                <button
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                    onClick={() => setSelectedEvent(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showOverdueDialog && (
                    <OverdueManager
                        overdueItems={alerts}
                        onClose={() => setShowOverdueDialog(false)}
                    />
                )}

            </div>
        </div>
    );
}
