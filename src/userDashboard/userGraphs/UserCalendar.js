import { ResponsiveCalendar } from '@nivo/calendar'

export default function UserCalendar ({ data }) {

    const startDate = data[0].day;
    const endDate = data[data.length -1].day;

    return (
        <>
        <h2 style={{marginLeft: '0.8rem'}}>Number of translated words / date</h2>
        <ResponsiveCalendar
            data={data}
            from={startDate}
            to={endDate}
            emptyColor="#eeeeee"
            colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            yearSpacing={40}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'row',
                    translateY: 36,
                    itemCount: 4,
                    itemWidth: 42,
                    itemHeight: 36,
                    itemsSpacing: 14,
                    itemDirection: 'right-to-left'
                }
            ]}
        />
        </>
    )
}
