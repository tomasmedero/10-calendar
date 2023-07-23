import { addHours } from 'date-fns'
import { useCalendarStore, useUistore } from '../../hooks'

export const FabAddNew = () => {
  const { openDateModal } = useUistore()

  const { setActiveEvent } = useCalendarStore()

  const handleClickNew = () => {
    setActiveEvent({
      title: '',
      notes: '',
      start: new Date(),
      end: addHours(new Date(), 2),
      bgColor: '#fafafa',
      user: {
        id: '123',
        name: 'Tomas',
      },
    })

    openDateModal()
  }

  return (
    <>
      <button className='btn btn-primary fab' onClick={handleClickNew}>
        <i className='fas fa-plus'></i>
      </button>
    </>
  )
}
