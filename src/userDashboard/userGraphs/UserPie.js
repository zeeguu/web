import { ResponsivePie } from '@nivo/pie'

const UserInfo = ({ userData }) => {

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date().toLocaleDateString("en-UK", options);

    return(
        <div style={{marginLeft: '0.8rem'}}>
            <h1>Maria</h1>
            <h3>{date}</h3>
            <h4>User since</h4>
            <h4>Total minutes on platform: 100</h4>
            <h4>Learning: Spanish</h4>
        </div>
    )
}

export default function UserPie ({ data, userData }) {

    return(
        <div style={{height: 500}}>
            <UserInfo userData={userData}/>
            <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: 'nivo' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextColor="#333333"
            radialLabelsLinkColor={{ from: 'color' }}
            sliceLabelsSkipAngle={10}
            sliceLabelsTextColor="#333333"
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'articles'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'total_words'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'words'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'minutes'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'exercises'
                    },
                    id: 'lines'
                }
            ]}
            legends={[
                {
                    anchor: 'left',
                    direction: 'column',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
        />
        </div>
    )

}
