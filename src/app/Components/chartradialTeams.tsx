import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { TitleComponent, LegendComponent } from 'echarts/components';
import { RadarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { color } from 'echarts';

echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer]);

interface Attack {
    Standard_Gls: number,
    Standard_Sh: number,
    Standard_SoT: number,
    Expected_xG: number,
    Standard_FK: number,
    Standard_PK: number;
}

const RadarChartTeams = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const myChart = echarts.init(chartRef.current);

            



            const values = [4, 5, 6, 8, 9, 1];

            const option = {
                legend: {
                    data: ['Allocated Budget', 'Actual Spending']
                  },
                radar: {
                    indicator: [
                        { name: 'Gls', max: 7 },
                        { name: 'Shots', max: 15 },
                        { name: 'Shots on Target', max: 15 },
                        { name: 'xG', max: 7 },
                        { name: 'Free Kicks', max: 10 },
                        { name: 'Penalty Shots', max: 5 }
                    ],
                    axisName: {
                        color: '#000000'
                    },
                    splitArea: {
                        areaStyle: {
                            color: '#FFF5E0',
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#9C9C9C'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#9C9C9C'
                            }
                        }
                    },
                },
                series: [
                    {
                        name: 'Attack Stats',
                        type: 'radar',
                        data: [
                            {
                                value: values,
                                name: 'Player Stats',
                                itemStyle: {
                                    color: '#CE1124'
                                },
                            },

                            {
                                value: [5, 9, 1, 2, 8, 4],
                                name: 'Defense',
                                itemStyle: {
                                    color: '#9747FF'
                                },
                            },

                            {
                                value: [4, 6, 5, 2, 0, 7],
                                name: 'Passes',
                                itemStyle: {
                                    color: '#00A3FF'
                                },
                            },
                        ],
                        areaStyle: {
                            opacity: 0.1
                        },
                        label: {
                            show: true,
                            formatter: function (params: any) {
                                return params.value as string;
                            }
                        }
                    }
                ]
            };

            myChart.setOption(option);

            return () => {
                myChart.dispose();
            };
        }
    }, []);

    return <div ref={chartRef} style={{ width: '100%', height: '450px' }} />;
};

export default RadarChartTeams;
