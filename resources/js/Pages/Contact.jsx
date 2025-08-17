import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";

const Contact = ({ citations }) => {
  const [events, setEvents] = useState([]);

  const handleEventClick = (info) => {
    console.log(info.event.extendedProps);
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
    <section className="md:max-w-[600px] px-4 py-8 mx-auto font-raleway">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]} // 👈 only timeGrid & interaction
        initialView="timeGridDay" // 👈 show a single day
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "" // 👈 no extra buttons (only day view)
        }}
        slotMinTime="09:00:00"  // 👈 start of the visible time
        slotMaxTime="18:00:00"  // 👈 end of the visible tim
        weekends={false} 
        events={events}         // 👈 your lawyer availability
        height="auto"
      />
      
    </section>
  )
}

export default Contact
