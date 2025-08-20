import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es" 
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import './Calendar.css';

export const Calendar = ({ citations=null, back=null }) => {

      const [events, setEvents] = useState([]);
      
    
      const handleEventClick = (info) => {
        alert(info.event.extendedProps);
      }
    
      useEffect(() => {
        const mapped = citations.map((c) => ({
          id: c.id,
          title: `${c.lawyer.name} (${c.lawyer.profession})`,
          start: c.starts_at.replace(" ", "T"),
          end: c.ends_at.replace(" ", "T"),
          extendedProps: {
            lawyerId: c.lawyer.id,
            phone: c.lawyer.phone,
            email: c.lawyer.email,
            image: c.lawyer.image,
          },
    
        }));
        setEvents(mapped);
      
        return () => false
      }, [])
      
  return (
    <>
      {citations ? (
        <div className="px-4 py-8 mx-auto font-bold tracking-normal  text-[13px]">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            headerToolbar={{
                center: "prev,next today",
                left: "title",
                right: "",
            }}
            slotMinTime="09:00:00"
            slotMaxTime="18:00:00"
            weekends={false}
            events={events}
            height="auto"
            locale={esLocale}
            slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
               
                hour12: true,      // use 12-hour clock
              }}
            // Add custom class to events
            eventClassNames={() =>
                "transition-all duration-300 hover:bg-red hover:cursor-pointer"
            }
            // Handle click on event
            eventClick={(info) => {
                handleEventClick(info);
                info.jsEvent.preventDefault();
                addEventHere(info.event); // your callback
            }}
            />
          {back && (
            <button onClick={back} className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700">
            Back
          </button>
          )}
        </div>
      ) : (
        <p>No citations available</p> 
      )}
    </>
  );
}
