import { ResponsiveBar } from '@nivo/bar'
import {BAR_GRAPH_KEYS} from '../dataFormat/ConstantsUserDashboard';
import { UserDashboardGraphTile } from '../UserDashboard.sc'
import { USER_DASHBOARD_TITLES, USER_DASHBOARD_TEXTS } from '../dataFormat/ConstantsUserDashboard'
import * as s from "../../components/TopMessage.sc";


export default function UserBarGraph ({ data }) {
    return(
        //parent container has to have height specified in order for the graph to be shown     
        <div style={{height: 500}}> 
            <UserDashboardGraphTile>{USER_DASHBOARD_TITLES.BAR_GRAPH_TITLE}</UserDashboardGraphTile>
            <s.TopMessage>{USER_DASHBOARD_TEXTS.BAR_GRAPH_HELPER_TEXT}</s.TopMessage>
            <ResponsiveBar
                data={data}
                keys={[ BAR_GRAPH_KEYS.READING, BAR_GRAPH_KEYS.EXERCISES ]}
                indexBy= {BAR_GRAPH_KEYS.INDEX_BY}
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#38bcb2',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#eed312',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: BAR_GRAPH_KEYS.READING
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: BAR_GRAPH_KEYS.EXERCISES
                        },
                        id: 'lines'
                    }
                ]}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: BAR_GRAPH_KEYS.LEGEND_BOTTOM,
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: BAR_GRAPH_KEYS.LEGEND_LEFT,
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
    />        </div>
    )
}

