import React, { useState, useContext } from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  VictoryPie,
  VictoryBar,
  VictoryAxis,
  VictoryLabel,
  VictoryChart,
} from 'victory-native';
import { LogBox } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ThemeContext } from '../../../hooks/theme'; // cập nhật path phù hợp dự án bạn
import { getTaskCounts } from '@/Service/TaskService';

LogBox.ignoreLogs([
  'Warning: VictoryPie: Support for defaultProps',
  'Warning: VictoryBar: Support for defaultProps',
  'Warning: VictoryAxis: Support for defaultProps',
  'Warning: VictoryChart: Support for defaultProps',
  'Warning: WrappedComponent: Support for defaultProps',
]);

const PieChartExample = () => {
    const dispatch = useDispatch();
    const ProjectDetail = useSelector((state: RootState) => state.project.project);
  const [chartType, setChartType] = useState('pie');
  const { theme } = useContext(ThemeContext);
  const [overdue,setoverdue] =useState(0)
  const [notOverdue,setnotOverdue] =useState(0)
  const [completed,setcompleted] =useState(0)
  const isDarkMode = theme === 'dark';
  const fetchAndLogOverdueTasks = async () => {
    const overdueTasks = await getTaskCounts(ProjectDetail?.projectId||"");
    setoverdue(overdueTasks.overdue)
    setnotOverdue(overdueTasks.notOverdue)
    setcompleted(overdueTasks.completed)
  };
  fetchAndLogOverdueTasks()
  const data = [
    { x: 'Hoàn thành', y: completed },
    { x: 'Quá hạn', y: overdue },
    { x: 'Chưa làm', y: notOverdue },
  ];

  // Màu sáng & tối lightColors darkColors
  const darkColors = ['#4e79a7', '#f28e2b', '#e15759']; // xanh dương - cam - đỏ
  const lightColors = ['#a1cfff', '#ffbe7b', '#ff8c94'];  // pastel sáng hơn
  const colors = isDarkMode ? darkColors : lightColors;

  const styles = getStyles(isDarkMode);

 const PieChart = ({ data, colorScale }) => {
  // Kết hợp data và colorScale theo index, sau đó lọc ra các item có y !== 0
  const filteredDataWithColor = data
    .map((item:any, index:any) => ({ ...item, color: colorScale[index] }))
    .filter(item => item.y !== 0);

  const filteredData = filteredDataWithColor.map(item => ({ x: item.x, y: item.y }));
  const filteredColors = filteredDataWithColor.map(item => item.color);

  return (
    <View style={styles.chartContainer}>
  <VictoryPie
    data={filteredData}
    colorScale={filteredColors}
    innerRadius={50}
    labelRadius={70}
    style={{
      labels: {
        fill: isDarkMode ? '#fff' : 'black',
        fontSize: 16,
        fontWeight: 'bold',
      },
    }}
    labels={({ datum }) => `${datum.x}: ${datum.y}`}
  />

  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View style={styles.legendContainer}>
      {filteredDataWithColor.map((item: any, index: number) => (
        <View style={styles.legendItem} key={index}>
          <View
            style={[
              styles.legendColorBox,
              { backgroundColor: item.color },
            ]}
          />
          <Text style={styles.legendText}>{item.x}</Text>
        </View>
      ))}
    </View>
  </ScrollView>

  {/* Chú thích màu sắc cố định */}
  <View style={styles.explanationContainer}>
    <View style={styles.legendItem}>
      <View style={[styles.legendColorBox, { backgroundColor: colorScale[0] }]} />
      <Text style={styles.legendText}>Hoàn thành</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendColorBox, { backgroundColor: colorScale[1] }]} />
      <Text style={styles.legendText}>Quá hạn</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendColorBox, { backgroundColor: colorScale[2] }]} />
      <Text style={styles.legendText}>Chưa làm</Text>
    </View>
  </View>
</View>
  );
};

  const BarChart = ({ data }) => (
    <View style={styles.chartContainerBar}>
      <VictoryChart domainPadding={20}>
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: isDarkMode ? '#fff' : '#000' },
            tickLabels: {
              fill: isDarkMode ? '#fff' : '#000',
              fontSize: 14,
              fontWeight: 'bold',
              padding: 5,
            },
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: isDarkMode ? '#fff' : '#000' },
            tickLabels: {
              fill: isDarkMode ? '#fff' : '#000',
              fontSize: 14,
              fontWeight: 'bold',
              padding: 10,
            },
          }}
        />
        <VictoryBar
          data={data}
          x="x"
          y="y"
          barWidth={30}
          style={{
            data: { fill: ({ index }) => colors[index] },
          }}
          labels={({ datum }) => datum.y}
          labelComponent={
            <VictoryLabel
              dy={-10}
              style={{ fill: isDarkMode ? '#fff' : '#000', fontWeight: 'bold' }}
            />
          }
        />
      </VictoryChart>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View style={styles.legendItem} key={index}>
              <View
                style={[
                  styles.legendColorBox,
                  { backgroundColor: colors[index] },
                ]}
              />
              <Text style={styles.legendText}>{item.x}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Biểu đồ Task dự án</Text>

      {chartType === 'pie' ? (
        <PieChart data={data} colorScale={colors} />
      ) : (
        <BarChart data={data} />
      )}

      <View style={{ marginTop: 40 }}>
        <Button
          title={`Chuyển sang ${chartType === 'pie' ? 'Bar Chart' : 'Pie Chart'}`}
          onPress={() => setChartType(chartType === 'pie' ? 'bar' : 'pie')}
          color={isDarkMode ? '#81c784' : '#ff6347'}
        />
      </View>
    </SafeAreaView>
  );
};

export default PieChartExample;

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#333',
      marginBottom: 20,
    },
    chartContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      width: 350,
      height: 450,
      borderRadius: 15,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 3,
      elevation: 5,
    },
    chartContainerBar:{
        justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      width: 350,
      height: 450,
      borderRadius: 15,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 3,
      elevation: 5,
    },
    legendContainer: {
      marginTop: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
      marginBottom: 8,
    },
    legendColorBox: {
      width: 15,
      height: 15,
      marginRight: 5,
    },
    legendText: {
      fontSize: 12,
      color: isDarkMode ? '#fff' : '#333',
    },
    explanationContainer: {
        marginTop: -5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },
  });
