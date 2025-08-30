import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es" 
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import axios from 'axios';
import './Calendar.css';

export const Calendar = ({ citations=null, back=null, citationId=null, onSuccess=null }) => {

      const [events, setEvents] = useState([]);
      const [selectedSlot, setSelectedSlot] = useState(null);
      const [isConfirming, setIsConfirming] = useState(false);
      const [tempSelectedSlot, setTempSelectedSlot] = useState(null);
      
      const handleDateSelect = (selectInfo) => {
        const start = selectInfo.start;
        const end = selectInfo.end;
        
        // Check if the selected slot conflicts with existing events
        const hasConflict = events.some(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return (start < eventEnd && end > eventStart);
        });

        if (hasConflict) {
          alert('Este horario no está disponible. Por favor seleccione otro horario.');
          return;
        }

        const newSelectedSlot = {
          start: start,
          end: end,
          startString: start.toLocaleString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          endString: end.toLocaleString('es-CO', {
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        setSelectedSlot(newSelectedSlot);

        // Add golden highlighting event
        const highlightEvent = {
          id: 'temp-selection',
          title: 'Horario Seleccionado',
          start: start.toISOString(),
          end: end.toISOString(),
          backgroundColor: '#d4af37', // Golden color
          borderColor: '#b8941f',
          textColor: '#ffffff',
          classNames: ['selected-slot'],
        };

        setTempSelectedSlot(highlightEvent);
        setEvents(prev => [...prev.filter(e => e.id !== 'temp-selection'), highlightEvent]);

        // Scroll to confirmation section
        setTimeout(() => {
          const confirmationElement = document.getElementById('confirmation-section');
          if (confirmationElement) {
            confirmationElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start' 
            });
          }
        }, 100);
      };

      const confirmReservation = async () => {
        if (!selectedSlot || !citationId) return;

        setIsConfirming(true);
        
        try {
          const response = await axios.post('/contacto/complete-reservation', {
            citation_id: citationId,
            starts_at: selectedSlot.start.toISOString(),
            ends_at: selectedSlot.end.toISOString(),
          });

          if (response.data.success) {
            console.log("Reservation completed:", response.data);
            if (onSuccess) {
              onSuccess();
            }
          }
        } catch (error) {
          console.error("Error completing reservation:", error);
          alert('Error al completar la reserva. Por favor intente nuevamente.');
        } finally {
          setIsConfirming(false);
        }
      };

      const cancelSelection = () => {
        setSelectedSlot(null);
        setTempSelectedSlot(null);
        // Remove the golden highlighting
        setEvents(prev => prev.filter(e => e.id !== 'temp-selection'));
      };
    
      useEffect(() => {
        if (citations) {
          // Filter out citations without dates (partial records)
          const validCitations = citations.filter(c => c.starts_at && c.ends_at);
          
          const mapped = validCitations.map((c) => ({
            id: c.id,
            title: `${c.lawyer ? c.lawyer.name : 'Cualquiera'} - Ocupado`,
            start: c.starts_at.replace(" ", "T"),
            end: c.ends_at.replace(" ", "T"),
            backgroundColor: '#000000',
            borderColor: '#000000',
            classNames: ['occupied-slot'],
            textColor: '#ffffff',
            extendedProps: {
              lawyerId: c.lawyer ? c.lawyer.id : null,
              phone: c.lawyer ? c.lawyer.phone : null,
              email: c.lawyer ? c.lawyer.email : null,
              image: c.lawyer ? c.lawyer.image : null,
            },
          }));
          setEvents(mapped);
        }
      
        return () => false
      }, [citations])
      
  return (
    <>
      {citations ? (
        <div className="mx-auto font-bold tracking-normal text-[13px]">
          {/* Instructions */}
          <div className="p-4 mb-6 border bg-golden/10 border-golden">
            <h3 className="mb-2 font-medium text-darki font-dmsans">Instrucciones:</h3>
            <p className="text-sm text-greyki font-dmsans">
              Haga clic y arrastre en el calendario para seleccionar su horario preferido. 
              Los espacios en rojo están ocupados.
            </p>
          </div>

          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
                center: "prev,next today",
                left: "title",
                right: "timeGridWeek,timeGridDay",
            }}
            slotMinTime="09:00:00"
            slotMaxTime="18:00:00"
            weekends={false}
            events={events}
            height="auto"
            locale={esLocale}
            selectable={true}
            selectMirror={true}
            select={handleDateSelect}
            slotDuration="00:30:00"
            slotLabelInterval="00:30:00"
            allDaySlot={false}
            slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
              startTime: '09:00',
              endTime: '18:00',
            }}
            selectConstraint="businessHours"
            // Style for available slots
            dayCellClassNames={() => "available-slot"}
            // Prevent selection on occupied events
            selectOverlap={false}
            eventOverlap={false}
            />

          {/* Selected Slot Confirmation */}
          {selectedSlot && (
            <div  className="p-6 mt-6 bg-white border shadow-lg border-softGrey">
              <h3 id="confirmation-section" className="mb-4 text-lg font-medium text-darki font-dmsans">
                Confirmar Reserva
              </h3>
              <div className="mb-4">
                <p className="text-greyki font-dmsans">
                  <strong>Fecha y hora seleccionada:</strong>
                </p>
                <p className="text-lg text-darki font-dmsans">
                  {selectedSlot.startString}
                </p>
                <p className="text-greyki font-dmsans">
                  <strong>Hasta:</strong> {selectedSlot.endString}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={confirmReservation}
                  disabled={isConfirming}
                  className="px-6 py-3 font-medium transition-colors duration-300 bg-golden text-whiteki hover:bg-darki disabled:bg-graykiSecondary font-dmsans"
                >
                  {isConfirming ? 'Confirmando...' : 'Confirmar Reserva'}
                </button>
                <button
                  onClick={cancelSelection}
                  disabled={isConfirming}
                  className="px-6 py-3 font-medium transition-colors duration-300 border border-graykiSecondary text-darki hover:bg-softGrey font-dmsans"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Back Button */}
          {back && (
            <div className="mt-6">
              <button 
                onClick={back} 
                className="px-6 py-3 font-medium transition-colors duration-300 border border-graykiSecondary text-darki hover:bg-softGrey font-dmsans"
              >
                Volver
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="py-8 text-center text-greyki font-dmsans">No hay citas disponibles</p> 
      )}
    </>
  );
}
