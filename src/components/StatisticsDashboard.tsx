import React, { useState, useEffect } from 'react';
import {
  Modal,
  Card,
  Row,
  Col,
  Button,
  DatePicker,
  Space,
  Statistic,
  Table,
  message,
  Spin,
  Empty,
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  BuildOutlined,
  TrophyOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { hopeCloudService } from '../service';

const { RangePicker } = DatePicker;

interface StatsData {
  time: string;
  kwh: number;
  kwhUnit: string;
  earnings: number;
  earningsUnit: string;
}

interface StatisticsDashboardProps {
  visible: boolean;
  onClose: () => void;
  stationId?: string;
  equipmentSn?: string;
  title?: string;
}

const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({
  visible,
  onClose,
  stationId,
  equipmentSn,
  title = 'Statistics Dashboard'
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [loading, setLoading] = useState(false);
  const [stationData, setStationData] = useState<StatsData[]>([]);
  const [equipmentData, setEquipmentData] = useState<StatsData[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs('2025-07-15'),
    dayjs('2025-08-10')
  ]);

  // Extract data from different API response structures
  const extractStatsData = (response: any, apiType: 'station' | 'equipment'): StatsData[] => {
    if (!response || !response.data) return [];

    if (apiType === 'equipment') {
      // Equipment APIs: daily/monthly have nested result, yearly is direct array  
      if (response.data.result && Array.isArray(response.data.result)) {
        return response.data.result; // Daily/Monthly
      } else if (Array.isArray(response.data)) {
        return response.data; // Yearly
      }
      return [];
    } else {
      // Station APIs: check if it's nested or direct array
      if (response.data.result && Array.isArray(response.data.result)) {
        return response.data.result; // Nested structure
      } else if (Array.isArray(response.data)) {
        return response.data; // Direct array
      }
      return [];
    }
  };

  // Format date range based on timeframe
  const getDateParams = (timeframe: string, range: [dayjs.Dayjs, dayjs.Dayjs]) => {
    const [start, end] = range;
    
    switch (timeframe) {
      case 'daily':
        return {
          startTime: start.format('YYYY-MM-DD'),
          endTime: end.format('YYYY-MM-DD')
        };
      case 'monthly':
        return {
          startTime: start.format('YYYY-MM'),
          endTime: end.format('YYYY-MM')
        };
      case 'yearly':
        return {
          startTime: start.format('YYYY'),
          endTime: end.format('YYYY')
        };
      default:
        return {
          startTime: start.format('YYYY-MM-DD'),
          endTime: end.format('YYYY-MM-DD')
        };
    }
  };


  // Fetch statistics data
  const fetchStats = async () => {
    if (!stationId && !equipmentSn) return;

    setLoading(true);
    const dateParams = getDateParams(activeTab, dateRange);

    try {
      const promises = [];

      // Fetch station data if stationId is provided
      if (stationId) {
        let stationPromise;
        switch (activeTab) {
          case 'daily':
            stationPromise = hopeCloudService.getStationDailyStats(stationId, dateParams);
            break;
          case 'monthly':
            stationPromise = hopeCloudService.getStationMonthlyStats(stationId, dateParams);
            break;
          case 'yearly':
            stationPromise = hopeCloudService.getStationYearlyStats(stationId, dateParams);
            break;
        }
        promises.push(stationPromise);
      }

      // Fetch equipment data if equipmentSn is provided
      if (equipmentSn) {
        let equipmentPromise;
        const equipmentParams = { ...dateParams, type: 'sn' as const };
        switch (activeTab) {
          case 'daily':
            equipmentPromise = hopeCloudService.getEquipmentDailyStats(equipmentSn, equipmentParams);
            break;
          case 'monthly':
            equipmentPromise = hopeCloudService.getEquipmentMonthlyStats(equipmentSn, equipmentParams);
            break;
          case 'yearly':
            equipmentPromise = hopeCloudService.getEquipmentYearlyStats(equipmentSn, equipmentParams);
            break;
        }
        promises.push(equipmentPromise);
      }

      const results = await Promise.allSettled(promises);
      
      let stationIndex = 0;
      let equipmentIndex = stationId ? 1 : 0;

      // Process station results
      if (stationId && results[stationIndex]) {
        const stationResult = results[stationIndex];
        if (stationResult.status === 'fulfilled') {
          const data = extractStatsData(stationResult.value, 'station');
          setStationData(data);
        } else {
          console.error('Station data fetch failed:', stationResult.reason);
          setStationData([]);
        }
      }

      // Process equipment results
      if (equipmentSn && results[equipmentIndex]) {
        const equipmentResult = results[equipmentIndex];
        if (equipmentResult.status === 'fulfilled') {
          const data = extractStatsData(equipmentResult.value, 'equipment');
          setEquipmentData(data);
        } else {
          console.error('Equipment data fetch failed:', equipmentResult.reason);
          setEquipmentData([]);
        }
      }

    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      message.error('Failed to load statistics data');
      setStationData([]);
      setEquipmentData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab changes and auto-adjust date ranges
  const handleTabChange = (newTab: 'daily' | 'monthly' | 'yearly') => {
    setActiveTab(newTab);
    
    // Use 2025 dates where equipment has active data
    switch (newTab) {
      case 'daily':
        setDateRange([dayjs('2025-07-15'), dayjs('2025-08-10')]); // Recent daily data
        break;
      case 'monthly':
        setDateRange([dayjs('2025-01-01'), dayjs('2025-08-31')]); // 2025 monthly data
        break;
      case 'yearly':
        setDateRange([dayjs('2024'), dayjs('2025')]); // 2024-2025
        break;
    }
  };

  // Fetch data when tab or date range changes
  useEffect(() => {
    if (visible) {
      fetchStats();
    }
  }, [activeTab, dateRange, visible, stationId, equipmentSn]);

  // Calculate totals and statistics
  const calculateStats = (data: StatsData[]) => {
    if (!data.length) return { total: 0, average: 0, peak: 0, peakTime: '' };

    const total = data.reduce((sum, item) => sum + item.kwh, 0);
    const average = total / data.length;
    const peakItem = data.reduce((max, item) => item.kwh > max.kwh ? item : max, data[0]);

    return {
      total,
      average,
      peak: peakItem.kwh,
      peakTime: peakItem.time
    };
  };

  const stationStats = calculateStats(stationData);
  const equipmentStats = calculateStats(equipmentData);


  // Prepare chart data
  const chartData = stationData.map((stationItem, index) => {
    const equipmentItem = equipmentData[index];
    let timeFormat = 'MM-DD';
    
    if (activeTab === 'yearly') {
      timeFormat = 'YYYY';
    } else if (activeTab === 'monthly') {
      timeFormat = 'MMM YYYY';
    } else if (activeTab === 'daily') {
      timeFormat = 'MM-DD HH:mm';
    }
    
    return {
      time: dayjs(stationItem.time).format(timeFormat),
      station: stationItem.kwh,
      equipment: equipmentItem ? equipmentItem.kwh : 0
    };
  });

  // If only equipment data exists, use equipment data for chart
  const finalChartData = chartData.length > 0 ? chartData : 
    equipmentData.map(item => {
      let timeFormat = 'MM-DD';
      
      if (activeTab === 'yearly') {
        timeFormat = 'YYYY';
      } else if (activeTab === 'monthly') {
        timeFormat = 'MMM YYYY';
      } else if (activeTab === 'daily') {
        timeFormat = 'MM-DD HH:mm';
      }
      
      const chartItem = {
        time: dayjs(item.time).format(timeFormat),
        station: 0,
        equipment: item.kwh
      };
      
      return chartItem;
    });



  // Table columns for detailed view
  const tableColumns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time: string) => {
        if (activeTab === 'yearly') return dayjs(time).format('YYYY');
        if (activeTab === 'monthly') return dayjs(time).format('MMM YYYY');
        
        return dayjs(time).format('MM-DD HH:mm');
      }
    },
    ...(stationId ? [{
      title: 'Station (kWh)',
      dataIndex: 'stationKwh',
      key: 'stationKwh',
      render: (value: number) => value?.toFixed(2) || '0.00'
    }] : []),
    ...(equipmentSn ? [{
      title: 'Equipment (kWh)',
      dataIndex: 'equipmentKwh',
      key: 'equipmentKwh',
      render: (value: number) => value?.toFixed(2) || '0.00'
    }] : []),
    {
      title: 'Earnings',
      dataIndex: 'earnings',
      key: 'earnings',
      render: (value: number, record: any) => `${value?.toFixed(2) || '0.00'} ${record.earningsUnit || 'CNY'}`
    }
  ];

  // Table data source
  const tableData = stationData.length > 0 ? 
    stationData.map((stationItem, index) => {
      const equipmentItem = equipmentData[index];
      return {
        key: index,
        time: stationItem.time,
        stationKwh: stationItem.kwh,
        equipmentKwh: equipmentItem ? equipmentItem.kwh : 0,
        earnings: stationItem.earnings || (equipmentItem ? equipmentItem.earnings : 0),
        earningsUnit: stationItem.earningsUnit || (equipmentItem ? equipmentItem.earningsUnit : 'CNY')
      };
    }) :
    equipmentData.map((equipmentItem, index) => ({
      key: index,
      time: equipmentItem.time,
      stationKwh: 0,
      equipmentKwh: equipmentItem.kwh,
      earnings: equipmentItem.earnings,
      earningsUnit: equipmentItem.earningsUnit
    }));

  return (
    <Modal
      title={<><BarChartOutlined /> {title}</>}
      open={visible}
      onCancel={onClose}
      width={1400}
      style={{ top: 20 }}
      footer={[
        <Button key="close" icon={<CloseOutlined />} onClick={onClose}>
          Close
        </Button>
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Controls */}
        <Row gutter={16} align="middle">
          <Col>
            <Space.Compact>
              <Button 
                type={activeTab === 'daily' ? 'primary' : 'default'}
                icon={<CalendarOutlined />}
                onClick={() => handleTabChange('daily')}
              >
                Daily
              </Button>
              <Button 
                type={activeTab === 'monthly' ? 'primary' : 'default'}
                icon={<BarChartOutlined />}
                onClick={() => handleTabChange('monthly')}
              >
                Monthly
              </Button>
              <Button 
                type={activeTab === 'yearly' ? 'primary' : 'default'}
                icon={<LineChartOutlined />}
                onClick={() => handleTabChange('yearly')}
              >
                Yearly
              </Button>
            </Space.Compact>
          </Col>
          <Col>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange([dates[0]!, dates[1]!])}
              picker={activeTab === 'yearly' ? 'year' : activeTab === 'monthly' ? 'month' : 'date'}
            />
          </Col>
          <Col>
            <Button icon={<BarChartOutlined />} onClick={fetchStats} loading={loading}>
              Refresh
            </Button>
          </Col>
        </Row>


        {/* Statistics Overview Cards */}
        <Row gutter={16}>
          {stationId && (
            <>
              <Col span={stationId && equipmentSn ? 6 : 8}>
                <Card size="small" style={{ background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)' }}>
                  <Statistic
                    title="Station Total"
                    value={stationStats.total}
                    suffix="kWh"
                    precision={2}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<ThunderboltOutlined />}
                  />
                </Card>
              </Col>
              <Col span={stationId && equipmentSn ? 6 : 8}>
                <Card size="small" style={{ background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)' }}>
                  <Statistic
                    title="Station Average"
                    value={stationStats.average}
                    suffix={`kWh/${activeTab}`}
                    precision={2}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<BarChartOutlined />}
                  />
                </Card>
              </Col>
              <Col span={stationId && equipmentSn ? 6 : 8}>
                <Card size="small" style={{ background: 'linear-gradient(135deg, #fff2e6 0%, #ffd591 100%)' }}>
                  <Statistic
                    title="Station Peak"
                    value={stationStats.peak}
                    suffix="kWh"
                    precision={2}
                    valueStyle={{ color: '#fa8c16' }}
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
            </>
          )}
          {equipmentSn && (
            <>
              <Col span={stationId && equipmentSn ? 6 : 8}>
                <Card size="small" style={{ background: 'linear-gradient(135deg, #f9f0ff 0%, #d3adf7 100%)' }}>
                  <Statistic
                    title="Equipment Total"
                    value={equipmentStats.total}
                    suffix="kWh"
                    precision={2}
                    valueStyle={{ color: '#722ed1' }}
                    prefix={<BuildOutlined />}
                  />
                </Card>
              </Col>
              <Col span={stationId && equipmentSn ? 6 : 8}>
                <Card size="small" style={{ background: 'linear-gradient(135deg, #fffbf0 0%, #ffe7ba 100%)' }}>
                  <Statistic
                    title="Equipment Average"
                    value={equipmentStats.average}
                    suffix={`kWh/${activeTab}`}
                    precision={2}
                    valueStyle={{ color: '#fa541c' }}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={stationId && equipmentSn ? 6 : 8}>
                <Card size="small" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #bfdbfe 100%)' }}>
                  <Statistic
                    title="Equipment Peak"
                    value={equipmentStats.peak}
                    suffix="kWh"
                    precision={2}
                    valueStyle={{ color: '#1677ff' }}
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
            </>
          )}
        </Row>

        {/* Performance Comparison Card (only when both station and equipment data) */}
        {stationId && equipmentSn && stationData.length > 0 && equipmentData.length > 0 && (
          <Card 
            title={<><BarChartOutlined /> Performance Comparison</>} 
            size="small" 
            style={{ marginTop: 16, background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f4ff 100%)' }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Equipment Contribution"
                  value={((equipmentStats.total / stationStats.total) * 100)}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<BuildOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Station/Equipment Ratio"
                  value={stationStats.total / equipmentStats.total}
                  suffix="×"
                  precision={2}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<ThunderboltOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Performance Gap"
                  value={stationStats.total - equipmentStats.total}
                  suffix="kWh"
                  precision={2}
                  valueStyle={{ color: stationStats.total > equipmentStats.total ? '#52c41a' : '#ff4d4f' }}
                  prefix={<LineChartOutlined />}
                />
              </Col>
            </Row>
          </Card>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : finalChartData.length > 0 ? (
          <>
            {/* Chart */}
            <Card title="Energy Production Trend" size="small">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={finalChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  {stationId && (
                    <Line
                      type="monotone"
                      dataKey="station"
                      stroke="#1890ff"
                      strokeWidth={2}
                      name="Station"
                      dot={{ r: 4 }}
                    />
                  )}
                  {equipmentSn && (
                    <Line
                      type="monotone"
                      dataKey="equipment"
                      stroke="#722ed1"
                      strokeWidth={2}
                      name="Equipment"
                      dot={{ r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Data Table */}
            <Card title="Detailed Statistics" size="small">
              <Table
                columns={tableColumns}
                dataSource={tableData}
                size="small"
                pagination={{ pageSize: 10 }}
                scroll={{ y: 300 }}
              />
            </Card>
          </>
        ) : (
          <Empty description="No statistics data available for the selected period" />
        )}
      </Space>
    </Modal>
  );
};

export default StatisticsDashboard;