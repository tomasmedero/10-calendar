import { useDispatch, useSelector } from 'react-redux'
import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvent,
  onSetActiveEvent,
  onUpdateEvent,
} from '../store'
import calendarAPI from '../api/calendarAPI'
import { convertToDateEvent } from '../helpers'
import Swal from 'sweetalert2'

export const useCalendarStore = () => {
  const { events, activeEvent } = useSelector((state) => state.calendar)
  const { user } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent))
  }

  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent.id) {
        // Actualizando
        await calendarAPI.put(`/events/${calendarEvent.id}`, calendarEvent)
        dispatch(onUpdateEvent({ ...calendarEvent, user }))
        return
      }

      // Creando
      const { data } = await calendarAPI.post('/events', calendarEvent)
      dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }))
    } catch (error) {
      console.log(error)
      Swal.fire('Error al guardar', error.response.data.msg, 'error')
    }
  }

  const startDeletingEvent = async () => {
    try {
      // Borrar
      await calendarAPI.delete(`/events/${activeEvent.id}`)
      dispatch(onDeleteEvent())
    } catch (error) {
      console.log(error)
      Swal.fire('Error al borrar', error.response.data.msg, 'error')
    }
  }

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarAPI.get('/events')
      const events = convertToDateEvent(data.eventos)
      dispatch(onLoadEvent(events))
    } catch (error) {
      console.log('Error cargando eventos')
      console.log(error)
    }
  }

  return {
    //Propiedades
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    //Metodos
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents,
  }
}
