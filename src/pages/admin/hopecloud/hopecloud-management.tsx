import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Table,
  Tag,
  Spin,
  message,
  Tabs,
  Statistic,
  Progress,
  Modal,
  Descriptions,
  Badge,
  Avatar,
  Layout,
  Input,
  Select,
  List,
  Drawer,
  Timeline,
  Empty,
  Tooltip,
  Form,
  DatePicker,
  Divider,
} from 'antd';
import type { TableColumnsType, TabsProps } from 'antd';
import {
  CloudServerOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  DashboardOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  SunOutlined,
  LineChartOutlined,
  ApiOutlined,
  UserOutlined,
  SearchOutlined,
  ToolOutlined,
  RadarChartOutlined,
  ClusterOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  BuildOutlined,
  PlusOutlined,
  EditOutlined,
  BarChartOutlined,
  WifiOutlined,
  LinkOutlined,
  AlertOutlined,
  FileTextOutlined,
  SaveOutlined,
  CloseOutlined,
  UpOutlined,
  DownOutlined,
  ExportOutlined,
  RiseOutlined,
  FallOutlined,
  SettingFilled,
  MonitorOutlined as MonitoringOutlined,
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import dayjs from 'dayjs';
import { hopeCloudService } from '../../../service';
import type {
  HopeCloudStation,
  HopeCloudAlarm,
  HopeCloudHealthStatus,
  HopeCloudSyncResult,
  HopeCloudDevice,
  HopeCloudOwner,
  HopeCloudChannelProvider,
  HopeCloudChannelTree,
  HopeCloudDiscoveryStatus,
  HopeCloudEquipmentDetails,
  HopeCloudRealtimeData,
  HopeCloudStatistics,
  HopeCloudCommunicationModule,
  HopeCloudEquipmentRealtimeData,
  CreateHopeCloudStationDto,
  BindDevicesDto,
  HopeCloudConfigTypes,
  HopeCloudAuthValidation,
} from '../../../types/hopecloud';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const HopeCloudManagement: React.FC = () => {
  // Core state
  const [healthStatus, setHealthStatus] = useState<HopeCloudHealthStatus | null>(null);
  // const [batchStatus, setBatchStatus] = useState<HopeCloudBatchStatus | null>(null);
  const [stations, setStations] = useState<HopeCloudStation[]>([]);
  const [alarms, setAlarms] = useState<HopeCloudAlarm[]>([]);
  const [devices, setDevices] = useState<HopeCloudDevice[]>([]);
  const [owners, setOwners] = useState<HopeCloudOwner[]>([]);
  const [channelProviders, setChannelProviders] = useState<HopeCloudChannelProvider[]>([]);
  const [channelTree, setChannelTree] = useState<HopeCloudChannelTree[]>([]);
  const [discoveryStatus, setDiscoveryStatus] = useState<HopeCloudDiscoveryStatus | null>(null);
  // const [metrics, setMetrics] = useState<HopeCloudMetrics | null>(null);
  const [authValidation, setAuthValidation] = useState<HopeCloudAuthValidation | null>(null);
  
  // New state for additional APIs
  const [stationStatistics, setStationStatistics] = useState<HopeCloudStatistics[]>([]);
  const [equipmentRealtimeData, setEquipmentRealtimeData] = useState<HopeCloudEquipmentRealtimeData | null>(null);
  const [equipmentAlarms, setEquipmentAlarms] = useState<HopeCloudAlarm[]>([]);
  const [equipmentStatistics, setEquipmentStatistics] = useState<HopeCloudStatistics[]>([]);
  const [communicationModules, setCommunicationModules] = useState<HopeCloudCommunicationModule[]>([]);
  const [selectedCommModule, setSelectedCommModule] = useState<HopeCloudCommunicationModule | null>(null);
  const [stationConfigTypes, setStationConfigTypes] = useState<HopeCloudConfigTypes | null>(null);
  const [selectedAlarmDetails, setSelectedAlarmDetails] = useState<HopeCloudAlarm | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStation, setSelectedStation] = useState<HopeCloudStation | null>(null);
  const [stationDetailVisible, setStationDetailVisible] = useState(false);
  const [deviceDrawerVisible, setDeviceDrawerVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<HopeCloudDevice | null>(null);
  const [equipmentDetails, setEquipmentDetails] = useState<HopeCloudEquipmentDetails | null>(null);
  const [realtimeData, setRealtimeData] = useState<HopeCloudRealtimeData[]>([]);
  
  // New UI state
  const [createStationVisible, setCreateStationVisible] = useState(false);
  const [bindDevicesVisible, setBindDevicesVisible] = useState(false);
  const [alarmDetailVisible, setAlarmDetailVisible] = useState(false);
  const [commModuleVisible, setCommModuleVisible] = useState(false);
  const [statisticsVisible, setStatisticsVisible] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  
  // New state for missing APIs
  // const [stationDetails, setStationDetails] = useState<HopeCloudStation | null>(null);
  
  // Consolidated historical data state
  const [historicalDataVisible, setHistoricalDataVisible] = useState(false);
  const [historicalDataStationId, setHistoricalDataStationId] = useState<string>('');
  const [historicalDataActiveTab, setHistoricalDataActiveTab] = useState<string>('daily');
  
  // Daily historical data
  const [dailyHistoricalData, setDailyHistoricalData] = useState<any[]>([]);
  const [dailyHistoricalDate, setDailyHistoricalDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Monthly historical data (using month ranges with historical API)
  const [monthlyHistoricalData, setMonthlyHistoricalData] = useState<any[]>([]);
  const [monthlyHistoricalYear, setMonthlyHistoricalYear] = useState<string>(new Date().getFullYear().toString());
  const [monthlyHistoricalMonth, setMonthlyHistoricalMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
  
  // Yearly historical data (using year ranges with historical API)
  const [yearlyHistoricalData, setYearlyHistoricalData] = useState<any[]>([]);
  const [yearlyHistoricalYear, setYearlyHistoricalYear] = useState<string>(new Date().getFullYear().toString());
  const [equipmentHistoricalData, setEquipmentHistoricalData] = useState<any[]>([]);
  const [equipmentHistoricalVisible, setEquipmentHistoricalVisible] = useState(false);
  const [selectedCommModuleDetails, setSelectedCommModuleDetails] = useState<HopeCloudCommunicationModule | null>(null);
  const [commModuleDetailsVisible, setCommModuleDetailsVisible] = useState(false);
  const [syncingSiteDevices, setSyncingSiteDevices] = useState<string | null>(null);
  const [cleaningUpDevices, setCleaningUpDevices] = useState(false);
  
  // Station table UI state
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  // const [showAllColumns, setShowAllColumns] = useState(false);
  // const [viewMode, setViewMode] = useState<'simple' | 'detailed' | 'compact'>('simple');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('');
  const [companyFilter, setCompanyFilter] = useState<string>('');

  // Filters
  const [stationFilter, setStationFilter] = useState('');
  const [alarmFilter, setAlarmFilter] = useState('');
  

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Get health status first
      const health = await hopeCloudService.getHealth();
      setHealthStatus(health);
      
      // Get batch status
      // try {
      //   const batch = await hopeCloudService.getBatchStatus();
      //   setBatchStatus(batch);
      // } catch (error: any) {
      //   console.warn('Could not fetch batch status:', error);
      // }

      // Get metrics
      // try {
      //   const metricsData = await hopeCloudService.getMetrics();
      //   setMetrics(metricsData);
      // } catch (error: any) {
      //   console.warn('Could not fetch metrics:', error);
      // }

      // Get auth validation
      try {
        const authData = await hopeCloudService.validateAuth();
        setAuthValidation(authData);
      } catch (error: any) {
        console.warn('Could not fetch auth validation:', error);
      }

      if (health.status === 'healthy') {
        // Fetch all data in parallel
        Promise.all([
          hopeCloudService.getStations({ pageIndex: 1, pageSize: 50 }),
          hopeCloudService.getActiveAlarms({ pageIndex: 1, pageSize: 50 }),
          hopeCloudService.getSubOwners({ pageIndex: 1, pageSize: 20 }),
          hopeCloudService.getChannelProviders({ pageIndex: 1, pageSize: 20 }),
          hopeCloudService.getChannelTree(),
          hopeCloudService.getDiscoveryStatus(),
          hopeCloudService.getStationConfigTypes(),
        ]).then(([stationsResponse, alarmsResponse, ownersResponse, providersResponse, treeResponse, discoveryResponse, configTypesResponse]) => {
          const stationsData = Array.isArray(stationsResponse.data?.records) ? stationsResponse.data.records : [];
          const alarmsData = Array.isArray(alarmsResponse.data) ? alarmsResponse.data : [];
          const ownersData = Array.isArray(ownersResponse.data) ? ownersResponse.data : [];
          const providersData = Array.isArray(providersResponse.data) ? providersResponse.data : [];
          const treeData = Array.isArray(treeResponse.data) ? treeResponse.data : [];
          
          setStations(stationsData);
          setAlarms(alarmsData);
          setOwners(ownersData);
          setChannelProviders(providersData);
          setChannelTree(treeData);
          setDiscoveryStatus(discoveryResponse.data);
          setStationConfigTypes(configTypesResponse.data);
          
          // Load communication modules for first station if available
          if (stationsData.length > 0) {
            hopeCloudService.getCommunicationModules({
              plantId: stationsData[0].id,
              pageIndex: 1,
              pageSize: 20
            }).then(commResponse => {
              const commData = Array.isArray(commResponse.data) ? commResponse.data : [];
              setCommunicationModules(commData);
            }).catch(err => console.warn('Communication modules error:', err));
          }
        }).catch(error => {
          console.warn('Error fetching some data:', error);
        });
      }
      
      setLoading(false);
    } catch (error: any) {
      message.error('Failed to fetch HopeCloud data: ' + (error?.response?.data?.message || error.message));
      setLoading(false);
    }
  };


  const handleViewDeviceDetails = async (device: HopeCloudDevice) => {
    setSelectedDevice(device);
    setDeviceDrawerVisible(true);
    
    try {
      const [equipmentResponse, realtimeResponse] = await Promise.all([
        hopeCloudService.getEquipmentDetails(device.equipmentSn),
        hopeCloudService.getEquipmentRealtimeData(device.equipmentSn),
      ]);
      setEquipmentDetails(equipmentResponse.data);
      setEquipmentRealtimeData(realtimeResponse.data);
    } catch (error: any) {
      console.warn('Could not fetch equipment details:', error);
    }
  };

  const handleViewAlarmDetails = async (alarm: HopeCloudAlarm) => {
    try {
      const response = await hopeCloudService.getAlarmDetails({
        alarmId: alarm.alarmId,
        sn: alarm.equipmentSn
      });
      setSelectedAlarmDetails(response.data);
      setAlarmDetailVisible(true);
    } catch (error: any) {
      message.error('Failed to fetch alarm details: ' + error.message);
    }
  };

  const handleViewStationStatistics = async (stationId: string, type: 'daily' | 'monthly' | 'yearly') => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      if (type === 'daily') {
        startDate.setDate(endDate.getDate() - 30);
      } else if (type === 'monthly') {
        startDate.setMonth(endDate.getMonth() - 12);
      } else {
        startDate.setFullYear(endDate.getFullYear() - 5);
      }

      const filters = {
        startTime: startDate.toISOString().split('T')[0],
        endTime: endDate.toISOString().split('T')[0]
      };

      let response;
      if (type === 'daily') {
        response = await hopeCloudService.getStationDailyStats(stationId, filters);
      } else if (type === 'monthly') {
        response = await hopeCloudService.getStationMonthlyStats(stationId, filters);
      } else {
        response = await hopeCloudService.getStationYearlyStats(stationId, filters);
      }

      const statisticsData = Array.isArray(response.data) ? response.data : [];
      setStationStatistics(statisticsData);
      setSelectedStationId(stationId);
      setStatisticsVisible(true);
    } catch (error: any) {
      message.error('Failed to fetch station statistics: ' + error.message);
    }
  };

  const handleViewEquipmentStatistics = async (deviceSn: string, type: 'daily' | 'monthly' | 'yearly') => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      if (type === 'daily') {
        startDate.setDate(endDate.getDate() - 30);
      } else if (type === 'monthly') {
        startDate.setMonth(endDate.getMonth() - 12);
      } else {
        startDate.setFullYear(endDate.getFullYear() - 5);
      }

      const filters = {
        startTime: startDate.toISOString().split('T')[0],
        endTime: endDate.toISOString().split('T')[0],
        type: 'sn' as const
      };

      let response;
      if (type === 'daily') {
        response = await hopeCloudService.getEquipmentDailyStats(deviceSn, filters);
      } else if (type === 'monthly') {
        response = await hopeCloudService.getEquipmentMonthlyStats(deviceSn, filters);
      } else {
        response = await hopeCloudService.getEquipmentYearlyStats(deviceSn, filters);
      }

      const equipmentData = Array.isArray(response.data) ? response.data : [];
      setEquipmentStatistics(equipmentData);
      setStatisticsVisible(true);
    } catch (error: any) {
      message.error('Failed to fetch equipment statistics: ' + error.message);
    }
  };

  const handleViewEquipmentAlarms = async (deviceSn: string) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);

      const filters = {
        startTime: startDate.toISOString().split('T')[0],
        endTime: endDate.toISOString().split('T')[0]
      };

      const response = await hopeCloudService.getEquipmentAlarms(deviceSn, filters);
      const alarmsData = Array.isArray(response.data) ? response.data : [];
      setEquipmentAlarms(alarmsData);
    } catch (error: any) {
      console.warn('Could not fetch equipment alarms:', error);
    }
  };

  const handleCreateStation = async (values: any) => {
    try {
      const stationData: CreateHopeCloudStationDto = {
        ...values,
        snList: values.snList?.split('\n').filter((sn: string) => sn.trim()) || [],
      };
      await hopeCloudService.createPowerStation(stationData);
      message.success('Power station created successfully');
      setCreateStationVisible(false);
      await fetchAllData();
    } catch (error: any) {
      message.error('Failed to create power station: ' + error.message);
    }
  };

  const handleBindDevices = async (plantId: string, devices: BindDevicesDto) => {
    try {
      await hopeCloudService.bindDevicesToPlant(plantId, devices);
      message.success('Devices bound to station successfully');
      setBindDevicesVisible(false);
      await fetchAllData();
    } catch (error: any) {
      message.error('Failed to bind devices: ' + error.message);
    }
  };

  const handleSync = async (type: 'realtime' | 'daily' | 'monthly' | 'sites' | 'devices') => {
    try {
      setSyncing(type);
      let result: HopeCloudSyncResult;
      
      switch (type) {
        case 'realtime':
          result = (await hopeCloudService.triggerRealtimeSync()).data;
          break;
        case 'daily':
          result = (await hopeCloudService.triggerDailySync()).data;
          break;
        case 'monthly':
          result = (await hopeCloudService.triggerMonthlySync()).data;
          break;
        case 'sites':
          result = (await hopeCloudService.triggerSiteSync()).data;
          break;
        case 'devices':
          result = (await hopeCloudService.triggerDeviceSync()).data;
          break;
      }
      
      message.success(`${type} sync completed: ${result.recordsProcessed} processed, ${result.recordsFailed} failed`);
      await fetchAllData();
    } catch (error: any) {
      message.error(`Failed to trigger ${type} sync: ` + (error?.response?.data?.message || error.message));
    } finally {
      setSyncing(null);
    }
  };

  const handleDiscoverDevices = async () => {
    try {
      message.loading('Discovering devices...', 0);
      const result = await hopeCloudService.discoverDevices();
      message.destroy();
      message.success(`Device discovery completed: ${result.data.discovered} discovered, ${result.data.updated} updated`);
      await fetchAllData();
    } catch (error: any) {
      message.destroy();
      message.error('Failed to discover devices: ' + (error?.response?.data?.message || error.message));
    }
  };

  // Consolidated historical data handler
  const handleViewHistoricalData = async (plantId: string) => {
    setHistoricalDataStationId(plantId);
    setHistoricalDataVisible(true);
    setHistoricalDataActiveTab('daily');
    
    // Load daily data by default
    await handleLoadDailyHistoricalData(plantId, dailyHistoricalDate);
  };

  const handleLoadDailyHistoricalData = async (plantId: string, date: string) => {
    try {
      setLoading(true);
      console.log('Loading daily historical data for:', { plantId, date });
      
      // Use historical power API for detailed time-series data (every 10 minutes)
      const response = await hopeCloudService.getStationHistoricalPower(plantId, date);
      console.log('Daily historical API response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'null');
      
      // The service already returns response.data, so response is the actual data
      let rawData = response?.data || response || [];
      console.log('Daily historical raw data:', rawData);
      console.log('Raw data type:', typeof rawData);
      console.log('Raw data is array:', Array.isArray(rawData));
      if (Array.isArray(rawData)) {
        console.log('Raw data length:', rawData.length);
        if (rawData.length > 0) {
          console.log('First item:', rawData[0]);
          console.log('First item keys:', Object.keys(rawData[0]));
        }
      }
      
      let chartData: any[] = [];
      
      if (Array.isArray(rawData)) {
        chartData = rawData.map((item: any, index: number) => ({
          time: item.time ? item.time.split(' ')[1] : `${String(index).padStart(2, '0')}:00`,
          power: item.nowKw || 0,
          timestamp: new Date(item.time || date).getTime()
        }));
      }
      
      if (chartData.length === 0) {
        console.warn('No daily historical data available');
        message.info('No daily historical data available for this station and date');
      }
      
      console.log('Processed daily historical data:', chartData);
      console.log('Setting daily data - length:', chartData.length);
      if (chartData.length > 0) {
        console.log('Sample daily data point:', chartData[0]);
        console.log('Daily data power values (first 10):', chartData.slice(0, 10).map(item => item.power));
        console.log('Daily data power range:', Math.min(...chartData.map(item => item.power)), 'to', Math.max(...chartData.map(item => item.power)));
      }
      setDailyHistoricalData(chartData);
    } catch (error: any) {
      console.error('Error loading daily historical data:', error);
      message.error('Failed to load daily historical data: ' + (error?.message || 'Unknown error'));
      setDailyHistoricalData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMonthlyHistoricalData = async (plantId: string, year: string, month: string) => {
    try {
      setLoading(true);
      console.log('Loading monthly historical data for:', { plantId, year, month });
      
      // Use monthly stats API with proper date range
      const startTime = `${year}-${month.padStart(2, '0')}-01`;
      const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
      const endTime = `${year}-${month.padStart(2, '0')}-${daysInMonth.toString().padStart(2, '0')}`;
      
      const response = await hopeCloudService.getStationMonthlyStats(plantId, {
        startTime,
        endTime
      });
      console.log('Monthly historical API response:', response);
      console.log('Monthly response type:', typeof response);
      console.log('Monthly response keys:', response ? Object.keys(response) : 'null');
      
      const rawData = response?.data || response || [];
      console.log('Monthly historical raw data:', rawData);
      console.log('Monthly raw data type:', typeof rawData);
      console.log('Monthly raw data is array:', Array.isArray(rawData));
      if (Array.isArray(rawData)) {
        console.log('Monthly raw data length:', rawData.length);
        if (rawData.length > 0) {
          console.log('Monthly first item:', rawData[0]);
          console.log('Monthly first item keys:', Object.keys(rawData[0]));
        }
      }
      
      let chartData: any[] = [];
      
      if (Array.isArray(rawData)) {
        chartData = rawData.map((item: any) => ({
          time: item.time ? item.time.split('-')[2].split(' ')[0] : 'N/A',
          power: item.kwh || 0,
          income: item.earnings || 0,
          timestamp: new Date(item.time || startTime).getTime()
        }));
      }
      
      if (chartData.length === 0) {
        console.warn('No monthly historical data available');
        message.info('No monthly historical data available for this period');
      }
      
      console.log('Processed monthly historical data:', chartData);
      console.log('Monthly data length:', chartData.length);
      if (chartData.length > 0) {
        console.log('Sample monthly data point:', chartData[0]);
        console.log('Monthly data power values (first 5):', chartData.slice(0, 5).map(item => item.power));
        console.log('Total non-zero power values:', chartData.filter(item => item.power > 0).length);
      }
      setMonthlyHistoricalData(chartData);
    } catch (error: any) {
      console.error('Error loading monthly historical data:', error);
      message.error('Failed to load monthly historical data: ' + (error?.message || 'Unknown error'));
      setMonthlyHistoricalData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadYearlyHistoricalData = async (plantId: string, year: string) => {
    try {
      setLoading(true);
      console.log('Loading yearly historical data for:', { plantId, year });
      
      // Use yearly stats API with proper date range
      const startTime = `${year}-01-01`;
      const endTime = `${year}-12-31`;
      
      const response = await hopeCloudService.getStationYearlyStats(plantId, {
        startTime,
        endTime
      });
      console.log('Yearly historical API response:', response);
      
      const rawData = response?.data || response || [];
      console.log('Yearly historical raw data:', rawData);
      
      let chartData: any[] = [];
      
      if (Array.isArray(rawData)) {
        chartData = rawData.map((item: any) => ({
          time: item.time ? item.time.split('-')[0] : year,
          power: item.kwh || 0,
          income: item.earnings || 0,
          timestamp: new Date(item.time || startTime).getTime()
        }));
      }
      
      if (chartData.length === 0) {
        console.warn('No yearly historical data available');
        message.info('No yearly historical data available for this period');
      }
      
      console.log('Processed yearly historical data:', chartData);
      setYearlyHistoricalData(chartData);
    } catch (error: any) {
      console.error('Error loading yearly historical data:', error);
      message.error('Failed to load yearly historical data: ' + (error?.message || 'Unknown error'));
      setYearlyHistoricalData([]);
    } finally {
      setLoading(false);
    }
  };

  // Tab switching handler for consolidated historical data
  const handleHistoricalTabChange = async (activeKey: string) => {
    setHistoricalDataActiveTab(activeKey);
    
    if (!historicalDataStationId) return;
    
    switch (activeKey) {
      case 'daily':
        await handleLoadDailyHistoricalData(historicalDataStationId, dailyHistoricalDate);
        break;
      case 'monthly':
        await handleLoadMonthlyHistoricalData(historicalDataStationId, monthlyHistoricalYear, monthlyHistoricalMonth);
        break;
      case 'yearly':
        await handleLoadYearlyHistoricalData(historicalDataStationId, yearlyHistoricalYear);
        break;
    }
  };

  // Consolidated station details handler
  const handleViewStationDetailsModal = async (stationId: string) => {
    try {
      setLoading(true);
      
      // Find the station from our existing data
      const station = stations.find(s => s.id === stationId);
      if (station) {
        setSelectedStation(station);
      }
      
      // Try to get detailed station info
      // try {
      //   const response = await hopeCloudService.getStationDetails(stationId);
      //   setStationDetails(response.data);
      // } catch (detailsError) {
      //   console.warn('Could not fetch detailed station info, using basic data:', detailsError);
      // }
      
      // Try to get devices for this station
      try {
        const devicesResponse = await hopeCloudService.getStationDevices(stationId);
        if (devicesResponse?.data) {
          setDevices(devicesResponse.data);
        }
      } catch (devicesError) {
        console.warn('Could not fetch station devices:', devicesError);
        setDevices([]);
      }
      
      // Try to get realtime data
      try {
        const realtimeResponse = await hopeCloudService.getStationRealtimeData(stationId);
        if (realtimeResponse?.data) {
          setRealtimeData([realtimeResponse.data]);
        }
      } catch (realtimeError) {
        console.warn('Could not fetch realtime data:', realtimeError);
        setRealtimeData([]);
      }
      
      // Open the comprehensive modal
      setStationDetailVisible(true);
    } catch (error: any) {
      message.error('Failed to load station details: ' + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };





  const handleViewEquipmentHistorical = async (deviceSn: string, time: string) => {
    try {
      setLoading(true);
      const response = await hopeCloudService.getEquipmentHistoricalData(deviceSn, time, { sn: deviceSn });
      
      // Format equipment historical data for charts
      const chartData = Array.isArray(response.data) ? response.data.map((item, index) => ({
        time: item.time || `${String(Math.floor(index / 6)).padStart(2, '0')}:${String((index % 6) * 10).padStart(2, '0')}`,
        power: item.power || 0,
        efficiency: item.efficiency || 0,
        voltage: item.voltage || 0,
        current: item.current || 0,
        temperature: item.temperature || 0
      })) : [];
      
      setEquipmentHistoricalData(chartData);
      setEquipmentHistoricalVisible(true);
    } catch (error: any) {
      message.error('Failed to load equipment historical data: ' + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSiteDevices = async (siteId: string | number) => {
    try {
      const siteIdStr = siteId.toString();
      const siteIdNum = typeof siteId === 'string' ? parseInt(siteId) : siteId;
      
      if (isNaN(siteIdNum)) {
        throw new Error(`Invalid site ID: ${siteId}`);
      }
      
      setSyncingSiteDevices(siteIdStr);
      console.log('Starting sync for site ID:', siteIdNum);
      
      const result = await hopeCloudService.syncSiteDevices(siteIdNum);
      console.log('Sync result:', result);
      
      if (result?.data) {
        const { discovered = 0, updated = 0, skipped = 0 } = result.data;
        message.success(
          `Site device sync completed successfully!\n` +
          `Discovered: ${discovered}, Updated: ${updated}, Skipped: ${skipped}`
        );
      } else {
        message.success('Site device sync completed successfully!');
      }
      
      // Refresh data after successful sync
      await fetchAllData();
    } catch (error: any) {
      console.error('Sync devices error:', error);
      
      let errorMessage = 'Failed to sync site devices';
      if (error?.response?.data?.message) {
        errorMessage += ': ' + error.response.data.message;
      } else if (error?.message) {
        errorMessage += ': ' + error.message;
      } else if (error?.response?.status) {
        errorMessage += ` (Status: ${error.response.status})`;
      }
      
      message.error(errorMessage);
    } finally {
      setSyncingSiteDevices(null);
    }
  };

  const handleCleanupDevices = async () => {
    try {
      setCleaningUpDevices(true);
      const result = await hopeCloudService.cleanupDevices();
      message.success(`Device cleanup completed: ${result.data.discovered} devices processed`);
      await fetchAllData();
    } catch (error: any) {
      message.error('Failed to cleanup devices: ' + (error?.response?.data?.message || error.message));
    } finally {
      setCleaningUpDevices(false);
    }
  };

  const handleViewCommModuleDetails = async (moduleId?: string, modulePn?: string) => {
    try {
      setLoading(true);
      const response = await hopeCloudService.getCommunicationModuleDetails({ id: moduleId, pn: modulePn });
      setSelectedCommModuleDetails(response.data);
      setCommModuleDetailsVisible(true);
    } catch (error: any) {
      message.error('Failed to load communication module details: ' + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const isHealthy = healthStatus?.status === 'healthy';

  // Helper functions for enhanced UI
  const getPerformanceColor = (efficiency: number) => {
    if (efficiency >= 80) return '#52c41a'; // Green
    if (efficiency >= 60) return '#faad14'; // Yellow  
    return '#ff4d4f'; // Red
  };

  const getNetworkStrength = (networkTime?: string) => {
    if (!networkTime) return { level: 0, color: '#d9d9d9' };
    const hoursAgo = (Date.now() - new Date(networkTime).getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 1) return { level: 3, color: '#52c41a' }; // Strong
    if (hoursAgo < 6) return { level: 2, color: '#faad14' }; // Moderate
    return { level: 1, color: '#ff4d4f' }; // Weak
  };

  const getTrendIndicator = (current: number, previous: number = current * 0.95) => {
    if (current > previous) return <RiseOutlined style={{ color: '#52c41a' }} />;
    if (current < previous) return <FallOutlined style={{ color: '#ff4d4f' }} />;
    return null;
  };

  // Direct filtering function that always recalculates
  const getFilteredStations = () => {
    if (!Array.isArray(stations)) {
      console.warn('getFilteredStations: Stations is not an array:', stations);
      return [];
    }
    
    // Use immediate stationFilter for real-time search
    const searchTerm = stationFilter.toLowerCase().trim();
    
    const filteredStations = stations.filter(station => {
      if (!station || typeof station !== 'object') {
        console.warn('Invalid station object:', station);
        return false;
      }
      
      // Text search filter - immediate response
      const matchesSearch = searchTerm === '' || 
        (station.name && station.name.toLowerCase().includes(searchTerm)) ||
        (station.city && station.city.toLowerCase().includes(searchTerm)) ||
        (station.ownerName && station.ownerName.toLowerCase().includes(searchTerm)) ||
        (station.companyName && station.companyName.toLowerCase().includes(searchTerm)) ||
        (station.province && station.province.toLowerCase().includes(searchTerm)) ||
        (station.district && station.district.toLowerCase().includes(searchTerm));
        
      // Status filter
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'online' && station.status === 1) ||
        (statusFilter === 'offline' && station.status === 0);
        
      // Region filter
      const matchesRegion = regionFilter === '' || station.province === regionFilter;
      
      // Company filter
      const matchesCompany = companyFilter === '' || station.companyName === companyFilter;
      
      const result = matchesSearch && matchesStatus && matchesRegion && matchesCompany;
      return result;
    });
    
    return filteredStations;
  };

  // Helper function to highlight search terms
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <Text key={index} style={{ backgroundColor: '#fff2b8', fontWeight: 600 }}>
          {part}
        </Text>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // Get columns based on view mode
  const getTableColumns = () => {
    // Default to essential columns since we removed view controls
    return essentialStationColumns;
  };

  // Enhanced station columns with all available data
  // Essential columns for simplified view
  const essentialStationColumns: TableColumnsType<HopeCloudStation> = [
    {
      title: 'Station Name',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left' as const,
      render: (text: string, record) => (
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <HomeOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            <Text strong style={{ fontSize: '14px' }}>
              {stationFilter ? highlightSearchTerm(text, stationFilter) : text}
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {stationFilter ? 
              <>{highlightSearchTerm(record.city, stationFilter)}, {highlightSearchTerm(record.province, stationFilter)}</> :
              <>{record.city}, {record.province}</>
            }
          </Text>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status',
      key: 'status',
      width: 140,
      render: (_, record) => {
        const networkStrength = getNetworkStrength(record.networkTime);
        return (
          <Space direction="vertical" size={2}>
            <Badge
              status={record.status === 1 ? 'success' : 'error'}
              text={
                <Text strong style={{ color: record.status === 1 ? '#52c41a' : '#ff4d4f' }}>
                  {record.status === 1 ? 'Online' : 'Offline'}
                </Text>
              }
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <WifiOutlined style={{ color: networkStrength.color, fontSize: '12px' }} />
              <Text type="secondary" style={{ fontSize: '11px' }}>
                Network {networkStrength.level === 3 ? 'Strong' : networkStrength.level === 2 ? 'Good' : 'Weak'}
              </Text>
            </div>
          </Space>
        );
      },
      filters: [
        { text: 'Online', value: 1 },
        { text: 'Offline', value: 0 },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Current Power',
      key: 'currentPower',
      width: 160,
      render: (_, record) => {
        const efficiency = Math.min(Math.round((record.nowKw / record.kwp) * 100), 100);
        const performanceColor = getPerformanceColor(efficiency);
        return (
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
              <Text strong style={{ color: performanceColor, fontSize: '15px' }}>
                {(record.nowKw || 0).toFixed(2)} kW
              </Text>
              {getTrendIndicator(record.nowKw)}
            </div>
            <Progress
              percent={efficiency}
              strokeColor={performanceColor}
              size="small"
              showInfo={false}
              style={{ margin: '4px 0' }}
            />
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {efficiency}% of {record.kwp} kWp
            </Text>
          </div>
        );
      },
      sorter: (a, b) => a.nowKw - b.nowKw,
    },
    {
      title: "Today's Generation",
      key: 'todayGeneration',
      width: 160,
      render: (_, record) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
            <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>
              {(record.todayKwh || 0).toFixed(1)} kWh
            </Text>
            {getTrendIndicator(record.todayKwh)}
          </div>
          <div style={{ marginTop: '2px' }}>
            <Progress
              percent={Math.min((record.todayKwh / (record.kwp * 8)) * 100, 100)} // Assuming 8h peak sun
              strokeColor="#52c41a"
              size="small"
              showInfo={false}
              style={{ width: '80px' }}
            />
          </div>
        </div>
      ),
      sorter: (a, b) => a.todayKwh - b.todayKwh,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Button 
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewStationDetailsModal(record.id)}
            block
          >
            Details
          </Button>
          <Button
            size="small"
            icon={<BarChartOutlined />}
            onClick={() => handleViewHistoricalData(record.id)}
            block
          >
            Historical Data
          </Button>
          <Button
            size="small"
            icon={<SyncOutlined />}
            loading={syncingSiteDevices === record.id}
            onClick={() => handleSyncSiteDevices(record.id)}
            block
          >
            Sync Devices
          </Button>
        </Space>
      ),
    },
  ];

  // Expanded row render function for additional details
  const expandedRowRender = (record: HopeCloudStation) => (
    <div style={{ 
      padding: '20px', 
      background: 'linear-gradient(135deg, #f8faff 0%, #f0f5ff 100%)', 
      borderRadius: '12px',
      border: '1px solid #e6f4ff'
    }}>
      <Row gutter={[24, 20]}>
        <Col xs={24} sm={8}>
          <Card 
            size="small" 
            title={
              <Space>
                <SettingFilled style={{ color: '#1890ff' }} />
                <span>Technical Details</span>
              </Space>
            } 
            style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label="Plant Type">
                <Tag color="blue" style={{ borderRadius: '6px' }}>{record.powerPlantType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Network Type">
                <Tag color="green" style={{ borderRadius: '6px' }}>{record.networkType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Orientation">
                <Text strong style={{ color: '#722ed1' }}>{record.orientationAngle}°</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Dip Angle">
                <Text strong style={{ color: '#722ed1' }}>{record.dipAngle}°</Text>
              </Descriptions.Item>
              {record.subassemblyNumber && (
                <Descriptions.Item label="Subassemblies">
                  <Badge count={record.subassemblyNumber} style={{ backgroundColor: '#52c41a' }} />
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            size="small" 
            title={
              <Space>
                <DollarOutlined style={{ color: '#52c41a' }} />
                <span>Generation & Financial</span>
              </Space>
            } 
            style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label="Monthly Generation">
                <Space>
                  <Text strong style={{ color: '#1890ff' }}>{(record.monKwh || 0).toFixed(1)} kWh</Text>
                  {getTrendIndicator(record.monKwh)}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Yearly Generation">
                <Space>
                  <Text strong style={{ color: '#722ed1' }}>{(record.yearKwh || 0).toFixed(1)} kWh</Text>
                  {getTrendIndicator(record.yearKwh)}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Total Lifetime">
                <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                  {((record.sumKwh || 0) / 1000).toFixed(2)} MWh
                </Text>
              </Descriptions.Item>
              {record.todayEarnings && (
                <Descriptions.Item label="Today's Earnings">
                  <Text strong style={{ color: '#fa8c16', fontSize: '14px' }}>
                    ¥{(record.todayEarnings || 0).toFixed(2)}
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            size="small" 
            title={
              <Space>
                <TeamOutlined style={{ color: '#722ed1' }} />
                <span>Contact & Location</span>
              </Space>
            } 
            style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label="Full Address">
                <Text style={{ fontSize: '12px' }}>{record.address}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Owner">
                <Space>
                  <UserOutlined style={{ color: '#1890ff' }} />
                  <Text strong>{record.ownerName}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Company">
                <Space>
                  <BuildOutlined style={{ color: '#52c41a' }} />
                  <Text>{record.companyName}</Text>
                </Space>
              </Descriptions.Item>
              {record.ownerPhone && (
                <Descriptions.Item label="Owner Phone">
                  <Space>
                    <PhoneOutlined style={{ color: '#faad14' }} />
                    <Text copyable={{ text: record.ownerPhone }}>{record.ownerPhone}</Text>
                  </Space>
                </Descriptions.Item>
              )}
              {record.plantContact && (
                <Descriptions.Item label="Plant Contact">{record.plantContact}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
      </Row>
      
      <Divider style={{ margin: '20px 0 16px 0' }} />
      
      <Row justify="space-between" align="middle">
        <Col>
          <Space size="large">
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Last Update</Text>
              <br />
              <Text strong style={{ fontSize: '13px' }}>
                {new Date(record.updateTime).toLocaleString()}
              </Text>
            </div>
            {record.remark && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Notes</Text>
                <br />
                <Text style={{ fontSize: '13px' }}>{record.remark}</Text>
              </div>
            )}
          </Space>
        </Col>
        <Col>
          <Space>
            <Button 
              type="primary"
              size="small"
              icon={<BarChartOutlined />}
              onClick={() => handleViewStationStatistics(record.id, 'daily')}
            >
              Statistics
            </Button>
            <Button 
              size="small"
              icon={<MonitoringOutlined />}
              onClick={() => handleViewStationDetailsModal(record.id)}
            >
              Monitor
            </Button>
            <Button 
              size="small"
              icon={<LinkOutlined />}
              onClick={() => {
                setSelectedStationId(record.id);
                setBindDevicesVisible(true);
              }}
            >
              Bind Devices
            </Button>
            <Button 
              size="small"
              icon={<EditOutlined />}
              onClick={() => message.info('Edit functionality coming soon')}
            >
              Edit
            </Button>
            <Button 
              size="small"
              icon={<ExportOutlined />}
              onClick={() => message.info('Export functionality coming soon')}
            >
              Export
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );


  /*
  // All columns for detailed view (removed/commented out for now)
  const stationColumns = [
    {
      title: 'Station Details',
      dataIndex: 'name',
      key: 'name',
      width: 280,
      fixed: 'left' as const,
      render: (text: string, record) => (
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <HomeOutlined style={{ color: '#1890ff', marginRight: '6px' }} />
            <Text strong style={{ fontSize: '14px' }}>{text}</Text>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <EnvironmentOutlined style={{ color: '#52c41a', marginRight: '6px', fontSize: '12px' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.address}
            </Text>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              📍 {record.city}, {record.province}, {record.district}
            </Text>
          </div>
          <div>
            <UserOutlined style={{ color: '#722ed1', marginRight: '4px', fontSize: '11px' }} />
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {record.ownerName}
            </Text>
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status & Type',
      key: 'statusType',
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Badge
            status={record.status === 1 ? 'success' : 'error'}
            text={
              <Text strong style={{ color: record.status === 1 ? '#52c41a' : '#ff4d4f' }}>
                {record.status === 1 ? 'Online' : 'Offline'}
              </Text>
            }
          />
          <Tag color="blue" style={{ fontSize: '11px', margin: '2px 0' }}>
            {record.powerPlantType}
          </Tag>
          <Tag color="green" style={{ fontSize: '11px', margin: '2px 0' }}>
            {record.networkType}
          </Tag>
          {record.networkTime && (
            <Text type="secondary" style={{ fontSize: '10px' }}>
              Network: {new Date(record.networkTime).toLocaleString()}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Power & Capacity',
      key: 'power',
      width: 220,
      render: (_, record) => (
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ color: '#1890ff', fontSize: '15px' }}>
              {(record.nowKw || 0).toFixed(2)} kW
            </Text>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              / {record.kwp} kWp
            </Text>
          </div>
          <Progress
            percent={Math.min(Math.round((record.nowKw / record.kwp) * 100), 100)}
            strokeColor="#1890ff"
            size="small"
            showInfo={false}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <Text type="secondary">Efficiency</Text>
            <Text strong style={{ color: record.nowKw > 0 ? '#52c41a' : '#8c8c8c' }}>
              {Math.min(Math.round((record.nowKw / record.kwp) * 100), 100)}%
            </Text>
          </div>
          {record.subassemblyNumber && (
            <Text type="secondary" style={{ fontSize: '10px' }}>
              Subassemblies: {record.subassemblyNumber}
            </Text>
          )}
        </Space>
      ),
      sorter: (a, b) => a.nowKw - b.nowKw,
    },
    {
      title: 'Generation Statistics',
      key: 'generation',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <div>
            <SunOutlined style={{ color: '#faad14', marginRight: '4px', fontSize: '12px' }} />
            <Text strong style={{ color: '#52c41a', fontSize: '13px' }}>
              Today: {record.todayKwh?.toFixed(1) || '0.0'} kWh
            </Text>
          </div>
          <div>
            <CalendarOutlined style={{ color: '#1890ff', marginRight: '4px', fontSize: '11px' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Month: {record.monKwh?.toFixed(1) || '0.0'} kWh
            </Text>
          </div>
          <div>
            <LineChartOutlined style={{ color: '#722ed1', marginRight: '4px', fontSize: '11px' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Year: {(record.yearKwh / 1000)?.toFixed(1) || '0.0'} MWh
            </Text>
          </div>
          <div>
            <DatabaseOutlined style={{ color: '#13c2c2', marginRight: '4px', fontSize: '11px' }} />
            <Text strong style={{ color: '#722ed1', fontSize: '12px' }}>
              Total: {(record.sumKwh / 1000)?.toFixed(1) || '0.0'} MWh
            </Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.todayKwh - b.todayKwh,
    },
    {
      title: 'Financial Data',
      key: 'financial',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          {record.todayEarnings && (
            <div>
              <DollarOutlined style={{ color: '#52c41a', marginRight: '4px', fontSize: '12px' }} />
              <Text style={{ color: '#52c41a', fontSize: '12px' }}>
                Today: ${(record.todayEarnings || 0).toFixed(2)}
              </Text>
            </div>
          )}
          {record.yearEarnings && (
            <div>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                Year: ${(record.yearEarnings || 0).toFixed(2)}
              </Text>
            </div>
          )}
          {record.paymentType && (
            <Tag color="gold">
              {record.paymentType}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Technical Info',
      key: 'technical',
      width: 160,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <div>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              Orientation: {record.orientationAngle}°
            </Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              Dip Angle: {record.dipAngle}°
            </Text>
          </div>
          {record.serviceProviderName && (
            <div>
              <Text type="secondary" style={{ fontSize: '10px' }}>
                Provider: {record.serviceProviderName}
              </Text>
            </div>
          )}
          {record.plantContact && (
            <div>
              <PhoneOutlined style={{ fontSize: '10px', marginRight: '4px' }} />
              <Text type="secondary" style={{ fontSize: '10px' }}>
                {record.plantContact}
              </Text>
            </div>
          )}
        </Space>
      ),
    },
    {
      title: 'Company & Owner',
      key: 'company',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <div>
            <BuildOutlined style={{ color: '#1890ff', marginRight: '4px', fontSize: '11px' }} />
            <Text strong style={{ fontSize: '12px' }}>
              {record.companyName}
            </Text>
          </div>
          <div>
            <UserOutlined style={{ color: '#722ed1', marginRight: '4px', fontSize: '11px' }} />
            <Text style={{ fontSize: '11px' }}>
              {record.ownerName}
            </Text>
          </div>
          {record.ownerPhone && (
            <div>
              <PhoneOutlined style={{ fontSize: '10px', marginRight: '4px' }} />
              <Text type="secondary" style={{ fontSize: '10px' }}>
                {record.ownerPhone}
              </Text>
            </div>
          )}
          {record.plantContactPhone && record.plantContactPhone !== record.ownerPhone && (
            <div>
              <Text type="secondary" style={{ fontSize: '10px' }}>
                Plant: {record.plantContactPhone}
              </Text>
            </div>
          )}
        </Space>
      ),
    },
    {
      title: 'Last Update',
      key: 'update',
      width: 140,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {new Date(record.updateTime).toLocaleDateString()}
          </Text>
          <Text type="secondary" style={{ fontSize: '10px' }}>
            {new Date(record.updateTime).toLocaleTimeString()}
          </Text>
          {record.remark && (
            <Tooltip title={record.remark}>
              <Text type="secondary" style={{ fontSize: '10px', fontStyle: 'italic' }}>
                Note: {record.remark.substring(0, 20)}...
              </Text>
            </Tooltip>
          )}
        </Space>
      ),
      sorter: (a, b) => new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Button 
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewStationDetailsModal(record.id)}
            block
          >
            Details
          </Button>
          <Button 
            size="small"
            icon={<BarChartOutlined />}
            onClick={() => handleViewStationStatistics(record.id, 'daily')}
            block
          >
            Statistics
          </Button>
          <Button 
            size="small"
            icon={<LinkOutlined />}
            onClick={() => {
              setSelectedStationId(record.id);
              setBindDevicesVisible(true);
            }}
            block
          >
            Bind Devices
          </Button>
        </Space>
      ),
    },
  ];
  */

  // Dashboard content - single comprehensive dashboard
  const DashboardContent = () => (
    <div style={{ width: '100%', padding: '16px 24px', background: '#f0f2f5', minHeight: '100vh', boxSizing: 'border-box', overflow: 'hidden' }}>
      {/* System Overview */}
      <Card 
        title={
          <Space>
            <RadarChartOutlined />
            <span>System Health & Overview</span>
          </Space>
        }
        extra={
          <Badge 
            status={isHealthy ? 'success' : 'error'}
            text={isHealthy ? 'All Systems Operational' : 'Issues Detected'}
          />
        }
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="API Health"
                value={isHealthy ? 'Healthy' : 'Warning'}
                prefix={isHealthy ? 
                  <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                  <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                }
                valueStyle={{ color: isHealthy ? '#52c41a' : '#faad14' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Auth: {authValidation?.validation?.valid ? 'Valid' : 'Invalid'}
                {authValidation?.validation?.errors && authValidation.validation.errors.length > 0 && (
                  <Tooltip title={authValidation.validation.errors.join(', ')}>
                    <ExclamationCircleOutlined style={{ color: '#faad14', marginLeft: 4 }} />
                  </Tooltip>
                )}
              </Text>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="Total Stations"
                value={Array.isArray(stations) ? stations.length : 0}
                prefix={<DatabaseOutlined style={{ color: '#1890ff' }} />}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Active: {Array.isArray(stations) ? stations.filter(s => s.status === 1).length : 0}
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="Real-time Power"
                value={Array.isArray(stations) ? stations.reduce((sum, s) => sum + s.nowKw, 0) : 0}
                precision={2}
                suffix="kW"
                prefix={<ThunderboltOutlined style={{ color: '#722ed1' }} />}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Capacity: {Array.isArray(stations) ? stations.reduce((sum, s) => sum + s.kwp, 0) : 0} kWp
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="Active Alarms"
                value={Array.isArray(alarms) ? alarms.filter(a => a.status === 'active').length : 0}
                prefix={<BellOutlined style={{ color: (Array.isArray(alarms) ? alarms.filter(a => a.status === 'active').length : 0) > 0 ? '#ff4d4f' : '#52c41a' }} />}
                valueStyle={{ color: (Array.isArray(alarms) ? alarms.filter(a => a.status === 'active').length : 0) > 0 ? '#ff4d4f' : '#52c41a' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Total: {Array.isArray(alarms) ? alarms.length : 0} alerts
              </Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small">
              <Statistic
                title="Today's Generation"
                value={Array.isArray(stations) ? stations.reduce((sum, s) => sum + s.todayKwh, 0) : 0}
                precision={1}
                suffix="kWh"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card size="small">
              <Statistic
                title="Monthly Generation"
                value={Array.isArray(stations) ? stations.reduce((sum, s) => sum + s.monKwh, 0) : 0}
                precision={1}
                suffix="kWh"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={8}>
            <Card size="small">
              <Statistic
                title="Total Lifetime"
                value={Array.isArray(stations) ? stations.reduce((sum, s) => sum + s.sumKwh, 0) / 1000 : 0}
                precision={1}
                suffix="MWh"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>


      {/* Recent Activity */}
      <Card 
        title={
          <Space>
            <ClusterOutlined />
            <span>Recent Activity</span>
          </Space>
        }
      >
        <Timeline
          items={[
            {
              color: 'green',
              children: (
                <div>
                  <Text strong>System Status Check</Text>
                  <br />
                  <Text type="secondary">All systems operational - {new Date().toLocaleString()}</Text>
                </div>
              ),
            },
            {
              color: 'purple', 
              children: (
                <div>
                  <Text strong>Data Sync Completed</Text>
                  <br />
                  <Text type="secondary">Real-time data synchronized successfully</Text>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );

  // Stations content with enhanced design
  const StationsContent = () => (
    <div style={{ width: '100%', padding: '16px 24px', background: '#f0f2f5', minHeight: '100vh', boxSizing: 'border-box', overflow: 'hidden' }}>
      <Card 
        title={
          <Space>
            <DatabaseOutlined />
            <span>Power Stations Management</span>
            <Badge count={Array.isArray(stations) ? stations.length : 0} showZero />
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="Search stations..."
              prefix={<SearchOutlined />}
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value)}
              onPressEnter={() => {
                // Search is already happening in real-time, this is just for UX
                // Could add analytics or other behavior here if needed
              }}
              style={{ width: 200 }}
              allowClear
              suffix={
                stationFilter ? (
                  <Text style={{ fontSize: '11px', color: '#666' }}>
                    {getFilteredStations().length}
                  </Text>
                ) : null
              }
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setCreateStationVisible(true)}
            >
              Create Station
            </Button>
          </Space>
        }
      >
        {(!Array.isArray(stations) || stations.length === 0) && !loading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No stations available"
          >
            <Button type="primary" icon={<ReloadOutlined />} onClick={fetchAllData}>
              Retry Loading
            </Button>
          </Empty>
        ) : getFilteredStations().length === 0 && (stationFilter || statusFilter !== 'all' || regionFilter || companyFilter) ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text>No stations found matching your search criteria</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {stationFilter && `Search: "${stationFilter}" • `}
                  {statusFilter !== 'all' && `Status: ${statusFilter} • `}
                  {regionFilter && `Region: ${regionFilter} • `}
                  {companyFilter && `Company: ${companyFilter}`}
                </Text>
              </div>
            }
          >
            <Space>
              <Button 
                icon={<CloseOutlined />} 
                onClick={() => {
                  setStationFilter('');
                  setStatusFilter('all');
                  setRegionFilter('');
                  setCompanyFilter('');
                }}
              >
                Clear All Filters
              </Button>
              <Button type="primary" icon={<ReloadOutlined />} onClick={fetchAllData}>
                Refresh Data
              </Button>
            </Space>
          </Empty>
        ) : (
          <>
            {/* Station Count */}
            <div style={{ marginBottom: '16px', padding: '0 24px' }}>
              <Space size={4}>
                <Text type="secondary" style={{ fontSize: '14px', fontWeight: 500 }}>
                  {getFilteredStations().length} of {stations.length} stations
                </Text>
                {stationFilter && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    🔍 "{stationFilter}"
                  </Text>
                )}
                {(statusFilter !== 'all' || regionFilter || companyFilter) && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    📊 filtered
                  </Text>
                )}
              </Space>
            </div>

            <Table
              columns={getTableColumns()}
              dataSource={getFilteredStations()}
              rowKey="id"
              loading={loading}
              expandable={{
                expandedRowKeys,
                onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
                expandedRowRender,
                expandRowByClick: true,
                expandIcon: ({ expanded, onExpand, record }) =>
                  expanded ? (
                    <UpOutlined onClick={(e) => onExpand(record, e)} style={{ color: '#1890ff' }} />
                  ) : (
                    <DownOutlined onClick={(e) => onExpand(record, e)} style={{ color: '#1890ff' }} />
                  ),
              }}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} stations`,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['5', '10', '20', '50'],
              }}
              scroll={{ x: 'max-content' }}
              size="small"
              style={{ backgroundColor: '#fff' }}
              sticky={{ offsetHeader: 64 }}
            />
            
            {/* Mobile Responsive Card View for small screens */}
            <div className="mobile-cards" style={{ display: 'none' }}>
              <style>{`
                @media (max-width: 768px) {
                  .ant-table-wrapper { display: none !important; }
                  .mobile-cards { display: block !important; }
                }
              `}</style>
              <Row gutter={[16, 16]}>
                {getFilteredStations().map((station) => (
                  <Col xs={24} sm={12} key={station.id}>
                    <Card 
                      size="small" 
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text strong style={{ fontSize: '14px' }}>{station.name}</Text>
                          <Badge
                            status={station.status === 1 ? 'success' : 'error'}
                            text={
                              <Text style={{ fontSize: '12px', color: station.status === 1 ? '#52c41a' : '#ff4d4f' }}>
                                {station.status === 1 ? 'Online' : 'Offline'}
                              </Text>
                            }
                          />
                        </div>
                      }
                      extra={
                        <Button 
                          type="primary"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewStationDetailsModal(station.id)}
                        >
                          Details
                        </Button>
                      }
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>Location:</Text>
                          <br />
                          <Text style={{ fontSize: '13px' }}>{station.city}, {station.province}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Current Power:</Text>
                            <br />
                            <Text strong style={{ color: '#1890ff' }}>{(station.nowKw || 0).toFixed(2)} kW</Text>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Today's Gen:</Text>
                            <br />
                            <Text strong style={{ color: '#52c41a' }}>{(station.todayKwh || 0).toFixed(1)} kWh</Text>
                          </div>
                        </div>
                        <Progress 
                          percent={Math.min(Math.round(((station.nowKw || 0) / (station.kwp || 1)) * 100), 100)}
                          strokeColor="#52c41a"
                          size="small"
                          format={(percent) => `${percent}% efficiency`}
                        />
                        <div style={{ textAlign: 'center' }}>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            Owner: {station.ownerName} • Company: {station.companyName}
                          </Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </>
        )}
      </Card>
      
      <style>{`
        /* Enhanced responsive styles */
        @media (max-width: 576px) {
          .ant-table-thead > tr > th {
            padding: 8px 4px !important;
            font-size: 12px !important;
          }
          .ant-table-tbody > tr > td {
            padding: 8px 4px !important;
          }
          .ant-card .ant-card-head-title {
            font-size: 14px !important;
          }
        }
        
        @media (max-width: 768px) {
          .ant-table-wrapper .ant-table-container {
            overflow-x: auto;
          }
        }
        
        /* Custom scrollbar for table */
        .ant-table-body::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .ant-table-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .ant-table-body::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .ant-table-body::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* Enhanced hover effects */
        .ant-table-tbody > tr:hover > td {
          background: #f0f8ff !important;
        }
        
        /* Performance indicators */
        .ant-progress-line .ant-progress-bg {
          transition: all 0.3s ease;
        }
        
        /* Enhanced button styles */
        .ant-btn-sm {
          transition: all 0.2s ease;
        }
        
        .ant-btn-sm:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );

  // Single comprehensive sync management
  const SyncContent = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card 
        title={
          <Space>
            <ApiOutlined />
            <span>Data Synchronization Control</span>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              size="small"
              title={<Space><ThunderboltOutlined />Real-time Sync</Space>}
              extra={<Tag color="red">Critical</Tag>}
            >
              <Paragraph type="secondary" style={{ fontSize: '12px' }}>
                Synchronizes live power generation data and current system metrics.
              </Paragraph>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                loading={syncing === 'realtime'}
                onClick={() => handleSync('realtime')}
                block
              >
                {syncing === 'realtime' ? 'Syncing...' : 'Sync Real-time Data'}
              </Button>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              size="small"
              title={<Space><LineChartOutlined />Daily Sync</Space>}
              extra={<Tag color="orange">High</Tag>}
            >
              <Paragraph type="secondary" style={{ fontSize: '12px' }}>
                Processes daily generation statistics and performance analytics.
              </Paragraph>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                loading={syncing === 'daily'}
                onClick={() => handleSync('daily')}
                block
              >
                {syncing === 'daily' ? 'Processing...' : 'Sync Daily Data'}
              </Button>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              size="small"
              title={<Space><SettingOutlined />Monthly Sync</Space>}
              extra={<Tag color="blue">Normal</Tag>}
            >
              <Paragraph type="secondary" style={{ fontSize: '12px' }}>
                Generates monthly reports and aggregated performance data.
              </Paragraph>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                loading={syncing === 'monthly'}
                onClick={() => handleSync('monthly')}
                block
              >
                {syncing === 'monthly' ? 'Generating...' : 'Sync Monthly Data'}
              </Button>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              size="small"
              title={<Space><DatabaseOutlined />Infrastructure</Space>}
              extra={<Tag color="green">Low</Tag>}
            >
              <Paragraph type="secondary" style={{ fontSize: '12px' }}>
                Updates station metadata and device configurations.
              </Paragraph>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  icon={<SyncOutlined />}
                  loading={syncing === 'sites'}
                  onClick={() => handleSync('sites')}
                  block
                >
                  Sync Sites
                </Button>
                <Button
                  icon={<SyncOutlined />}
                  loading={syncing === 'devices'}
                  onClick={() => handleSync('devices')}
                  block
                >
                  Sync Devices
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Device Discovery */}
      <Card 
        title={
          <Space>
            <RadarChartOutlined />
            <span>Device Discovery & Management</span>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            {discoveryStatus && (
              <div>
                <Title level={5}>Discovery Status</Title>
                <Space direction="vertical">
                  <Text>Last Run: {discoveryStatus.lastRun}</Text>
                  <Text>Next Scheduled: {discoveryStatus.nextScheduledRun}</Text>
                  <Text>Schedule: {discoveryStatus.schedule}</Text>
                  <Badge 
                    status={discoveryStatus.enabled ? 'success' : 'default'} 
                    text={discoveryStatus.enabled ? 'Enabled' : 'Disabled'} 
                  />
                </Space>
              </div>
            )}
          </Col>
          <Col span={12}>
            <Title level={5}>Discovery Actions</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleDiscoverDevices}
                block
              >
                Discover New Devices
              </Button>
              <Button
                icon={<ToolOutlined />}
                loading={cleaningUpDevices}
                onClick={handleCleanupDevices}
                block
              >
                Cleanup Orphaned Devices
              </Button>
            </Space>
          </Col>
        </Row>

        {discoveryStatus && (
          <div style={{ marginTop: 16 }}>
            <Title level={5}>Last Discovery Results</Title>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic
                  title="Discovered"
                  value={discoveryStatus.lastRunStats.discovered}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Updated"
                  value={discoveryStatus.lastRunStats.updated}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Skipped"
                  value={discoveryStatus.lastRunStats.skipped}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Errors"
                  value={discoveryStatus.lastRunStats.errors}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
          </div>
        )}
      </Card>
    </Space>
  );

  // Single comprehensive alarms management
  const AlarmsContent = () => (
    <Card 
      title={
        <Space>
          <BellOutlined />
          <span>Alarm Management</span>
          <Badge count={Array.isArray(alarms) ? alarms.filter(a => a.status === 'active').length : 0} />
        </Space>
      }
      extra={
        <Space>
          <Select
            placeholder="Filter by severity"
            style={{ width: 150 }}
            allowClear
            onChange={setAlarmFilter}
          >
            <Select.Option value="high">High</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="low">Low</Select.Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={fetchAllData} loading={loading}>
            Refresh
          </Button>
        </Space>
      }
    >
      {(!Array.isArray(alarms) || alarms.length === 0) ? (
        <Empty
          image={<SafetyCertificateOutlined style={{ fontSize: '64px', color: '#52c41a' }} />}
          description="No active alarms"
        >
          <Text type="secondary">All systems are operating normally</Text>
        </Empty>
      ) : (
        <List
          dataSource={Array.isArray(alarms) ? alarms.filter(alarm => 
            !alarmFilter || alarm.severity === alarmFilter
          ) : []}
          renderItem={(alarm) => (
            <List.Item
              actions={[
                <Button 
                  key="details" 
                  type="link" 
                  size="small"
                  icon={<FileTextOutlined />}
                  onClick={() => handleViewAlarmDetails(alarm)}
                >
                  View Details
                </Button>,
                <Button key="acknowledge" type="link" size="small">
                  Acknowledge
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={<ExclamationCircleOutlined />} 
                    style={{ 
                      backgroundColor: alarm.severity === 'high' ? '#ff4d4f' : 
                                      alarm.severity === 'medium' ? '#faad14' : '#52c41a' 
                    }} 
                  />
                }
                title={
                  <Space>
                    <Text strong>{alarm.alarmType}</Text>
                    <Tag 
                      color={alarm.severity === 'high' ? 'red' : 
                             alarm.severity === 'medium' ? 'orange' : 'green'}
                    >
                      {alarm.severity}
                    </Tag>
                    <Badge 
                      status={alarm.status === 'active' ? 'error' : 'success'} 
                      text={alarm.status}
                    />
                  </Space>
                }
                description={
                  <Space direction="vertical" size={4}>
                    <Text>{alarm.message}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Device: {alarm.deviceSn || alarm.deviceId} • Plant: {alarm.plantName || 'Unknown'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Occurred: {new Date(alarm.occurredAt).toLocaleString()}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      )}
    </Card>
  );

  // Communication modules management
  const CommunicationModulesContent = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card 
        title={
          <Space>
            <WifiOutlined />
            <span>Communication Modules</span>
            <Badge count={Array.isArray(communicationModules) ? communicationModules.length : 0} showZero />
          </Space>
        }
        extra={
          <Button icon={<ReloadOutlined />} onClick={fetchAllData} loading={loading}>
            Refresh
          </Button>
        }
      >
        {(!Array.isArray(communicationModules) || communicationModules.length === 0) ? (
          <Empty description="No communication modules found" />
        ) : (
          <Table
            columns={[
              {
                title: 'Module Information',
                key: 'info',
                render: (_, record) => (
                  <Space direction="vertical" size={4}>
                    <Text strong>{record.divertorName}</Text>
                    <Text type="secondary">PN: {record.equipmentPn}</Text>
                    <Text type="secondary">Type: {record.deviceType}</Text>
                  </Space>
                ),
              },
              {
                title: 'Status & Signal',
                key: 'status',
                render: (_, record) => (
                  <Space direction="vertical" size={4}>
                    <Badge
                      status={record.status === 1 ? 'success' : 'error'}
                      text={record.status === 1 ? 'Online' : 'Offline'}
                    />
                    <Text type="secondary">RSSI: {record.rssi} dBm</Text>
                    <Text type="secondary">Loaded: {record.loadedNumber}</Text>
                  </Space>
                ),
              },
              {
                title: 'Location',
                key: 'location',
                render: (_, record) => (
                  <Space direction="vertical" size={4}>
                    {record.latitude && record.longitude && (
                      <Text>📍 {record.latitude}, {record.longitude}</Text>
                    )}
                    {record.powerPlantName && (
                      <Text type="secondary">Plant: {record.powerPlantName}</Text>
                    )}
                  </Space>
                ),
              },
              {
                title: 'Network',
                key: 'network',
                render: (_, record) => (
                  <Space direction="vertical" size={4}>
                    {record.iccid && <Text>ICCID: {record.iccid}</Text>}
                    {record.operatorType && <Text>Operator: {record.operatorType}</Text>}
                  </Space>
                ),
              },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                  <Button
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewCommModuleDetails(record.id, record.equipmentPn)}
                  >
                    Details
                  </Button>
                ),
              },
            ]}
            dataSource={Array.isArray(communicationModules) ? communicationModules : []}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </Space>
  );

  // Users and channels management
  const UsersContent = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                <span>Sub Owners</span>
                <Badge count={Array.isArray(owners) ? owners.length : 0} showZero />
              </Space>
            }
          >
            <List
              dataSource={Array.isArray(owners) ? owners : []}
              renderItem={(owner) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={owner.ownerName}
                    description={
                      <Space direction="vertical" size={2}>
                        <div>
                          <MailOutlined style={{ marginRight: 4, fontSize: '12px' }} />
                          <Text type="secondary">{owner.email}</Text>
                        </div>
                        <div>
                          <PhoneOutlined style={{ marginRight: 4, fontSize: '12px' }} />
                          <Text type="secondary">{owner.phone}</Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          Created: {owner.createdTime}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card 
            title={
              <Space>
                <TeamOutlined />
                <span>Channel Providers</span>
                <Badge count={Array.isArray(channelProviders) ? channelProviders.length : 0} showZero />
              </Space>
            }
          >
            <List
              dataSource={Array.isArray(channelProviders) ? channelProviders : []}
              renderItem={(provider) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<TeamOutlined />} />}
                    title={provider.channelName}
                    description={
                      <Space direction="vertical" size={2}>
                        <Text type="secondary">Provider: {provider.providerName}</Text>
                        <Text type="secondary">Contact: {provider.contactInfo}</Text>
                        <Badge 
                          status={provider.status === 'active' ? 'success' : 'default'} 
                          text={provider.status} 
                        />
                      </Space>
                    }
                  />
                </List.Item>
              )}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>

      {Array.isArray(channelTree) && channelTree.length > 0 && (
        <Card 
          title={
            <Space>
              <ClusterOutlined />
              <span>Channel Tree Structure</span>
            </Space>
          }
        >
          <List
            dataSource={Array.isArray(channelTree) ? channelTree : []}
            renderItem={(node) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{node.userName.charAt(0)}</Avatar>}
                  title={node.userName}
                  description={
                    <Space direction="vertical" size={2}>
                      <Text type="secondary">Nick: {node.nickName}</Text>
                      <Text type="secondary">Email: {node.email}</Text>
                      <Text type="secondary">Phone: {node.phone}</Text>
                      {node.childCompanyList.length > 0 && (
                        <Text type="secondary">
                          Sub-companies: {node.childCompanyList.length}
                        </Text>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </Space>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'dashboard',
      label: (
        <Space>
          <DashboardOutlined />
          Dashboard
        </Space>
      ),
      children: <div style={{ padding: 0, margin: 0, minHeight: 'calc(100vh - 120px)', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}><DashboardContent /></div>,
    },
    {
      key: 'stations',
      label: (
        <Space>
          <DatabaseOutlined />
          Stations
          <Badge count={Array.isArray(stations) ? stations.length : 0} showZero size="small" />
        </Space>
      ),
      children: <div style={{ padding: 0, margin: 0, minHeight: 'calc(100vh - 120px)', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}><StationsContent /></div>,
    },
    {
      key: 'sync',
      label: (
        <Space>
          <SyncOutlined />
          Data Sync
        </Space>
      ),
      children: <div style={{ padding: 0, margin: 0, minHeight: 'calc(100vh - 120px)', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}><SyncContent /></div>,
    },
    {
      key: 'alarms',
      label: (
        <Space>
          <BellOutlined />
          Alarms
          <Badge count={Array.isArray(alarms) ? alarms.filter(a => a.status === 'active').length : 0} showZero size="small" />
        </Space>
      ),
      children: <div style={{ padding: 0, margin: 0, minHeight: 'calc(100vh - 120px)', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}><AlarmsContent /></div>,
    },
    {
      key: 'communication',
      label: (
        <Space>
          <WifiOutlined />
          Communication
          <Badge count={Array.isArray(communicationModules) ? communicationModules.length : 0} showZero size="small" />
        </Space>
      ),
      children: <div style={{ padding: 0, margin: 0, minHeight: 'calc(100vh - 120px)', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}><CommunicationModulesContent /></div>,
    },
    {
      key: 'users',
      label: (
        <Space>
          <TeamOutlined />
          Users & Channels
        </Space>
      ),
      children: <div style={{ padding: 0, margin: 0, minHeight: 'calc(100vh - 120px)', width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}><UsersContent /></div>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5', margin: 0, padding: 0 }}>
      <Content style={{ padding: 0, margin: 0, width: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid #d9d9d9',
          marginBottom: 0,
          background: '#ffffff',
          borderRadius: 0,
          marginTop: 0,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <Row justify="space-between" align="middle" style={{ padding: 0, width: '100%' }}>
            <Col>
              <Space size="large">
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CloudServerOutlined style={{ color: '#fff', fontSize: '24px' }} />
                </div>
                <div>
                  <Title level={2} style={{ margin: '0 0 4px 0', color: '#262626' }}>
                    HopeCloud Management Platform
                  </Title>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    Comprehensive solar power monitoring and control system
                  </Text>
                  <br />
                  <Space size="middle" style={{ marginTop: '8px' }}>
                    <Badge 
                      status={isHealthy ? 'success' : 'error'} 
                      text={isHealthy ? 'Connected' : 'Connection Issues'} 
                    />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      |
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {Array.isArray(stations) ? stations.length : 0} stations • {Array.isArray(alarms) ? alarms.filter(a => a.status === 'active').length : 0} active alarms
                    </Text>
                  </Space>
                </div>
              </Space>
            </Col>
            <Col>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchAllData}
                loading={loading}
                size="large"
              >
                Refresh All Data
              </Button>
            </Col>
          </Row>
        </div>

        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 0',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <Spin size="large" />
            <div style={{ marginTop: 24 }}>
              <Text style={{ fontSize: '16px', color: '#666' }}>
                Loading HopeCloud data and services...
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '14px' }}>
                This may take a few moments to fetch all API endpoints
              </Text>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            overflow: 'hidden'
          }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              size="large"
              items={tabItems}
              style={{ margin: 0, width: '100%', overflow: 'hidden' }}
              tabBarStyle={{ 
                paddingLeft: '24px',
                paddingRight: '24px',
                marginBottom: 0,
                background: '#ffffff',
                borderBottom: '1px solid #d9d9d9',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {/* Enhanced Station Details Modal */}
        <Modal
          title={
            <Space>
              <ThunderboltOutlined style={{ color: '#1890ff' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Text style={{ fontSize: '18px', fontWeight: 600 }}>
                  {selectedStation ? selectedStation.name : 'Station Details'}
                </Text>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Tag color="blue">Comprehensive View</Tag>
                  {selectedStation && (
                    <>
                      <Tag color={selectedStation.status === 1 ? 'success' : 'error'}>
                        {selectedStation.status === 1 ? 'Online' : 'Offline'}
                      </Tag>
                      <Tag color="purple">{selectedStation.kwp} kWp</Tag>
                      <Tag color="orange">{selectedStation.powerPlantType}</Tag>
                    </>
                  )}
                </div>
              </div>
            </Space>
          }
          open={stationDetailVisible}
          onCancel={() => {
            setStationDetailVisible(false);
            setSelectedStation(null);
            setDevices([]);
            setRealtimeData([]);
          }}
          footer={[
            <Button 
              key="historical-data" 
              type="primary"
              icon={<BarChartOutlined />} 
              onClick={() => {
                if (selectedStation) {
                  setStationDetailVisible(false);
                  handleViewHistoricalData(selectedStation.id);
                }
              }}
            >
              Historical Data
            </Button>,
            <Button 
              key="refresh" 
              icon={<ReloadOutlined />} 
              onClick={() => selectedStation && handleViewStationDetailsModal(selectedStation.id)}
              loading={loading}
            >
              Refresh
            </Button>,
            <Button key="close" onClick={() => {
              setStationDetailVisible(false);
              setSelectedStation(null);
              setDevices([]);
              setRealtimeData([]);
            }}>
              Close
            </Button>
          ]}
          width={1200}
        >
          {selectedStation && (
            <Tabs
              defaultActiveKey="overview"
              items={[
                {
                  key: 'overview',
                  label: 'Station Overview',
                  children: (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Card size="small">
                            <Statistic
                              title="Current Power"
                              value={selectedStation.nowKw}
                              precision={2}
                              suffix="kW"
                              prefix={<ThunderboltOutlined />}
                            />
                            <Progress
                              percent={Math.round((selectedStation.nowKw / selectedStation.kwp) * 100)}
                              style={{ marginTop: 12 }}
                            />
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small">
                            <Statistic
                              title="Today Generation"
                              value={selectedStation.todayKwh}
                              precision={1}
                              suffix="kWh"
                              prefix={<SunOutlined />}
                            />
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small">
                            <Statistic
                              title="Status"
                              value={selectedStation.status === 1 ? 'Online' : 'Offline'}
                              prefix={selectedStation.status === 1 ? 
                                <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                                <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                              }
                              valueStyle={{ 
                                color: selectedStation.status === 1 ? '#52c41a' : '#ff4d4f' 
                              }}
                            />
                          </Card>
                        </Col>
                      </Row>

                      <Card title="Complete Station Information" size="small">
                        <Descriptions column={3} size="small" bordered>
                          <Descriptions.Item label="Station Name">{selectedStation.name}</Descriptions.Item>
                          <Descriptions.Item label="Owner">{selectedStation.ownerName}</Descriptions.Item>
                          <Descriptions.Item label="Company">{selectedStation.companyName}</Descriptions.Item>
                          
                          <Descriptions.Item label="Address">{selectedStation.address}</Descriptions.Item>
                          <Descriptions.Item label="City">{selectedStation.city}</Descriptions.Item>
                          <Descriptions.Item label="Province">{selectedStation.province}</Descriptions.Item>
                          
                          <Descriptions.Item label="District">{selectedStation.district}</Descriptions.Item>
                          <Descriptions.Item label="Plant Type">{selectedStation.powerPlantType}</Descriptions.Item>
                          <Descriptions.Item label="Network Type">{selectedStation.networkType}</Descriptions.Item>
                          
                          <Descriptions.Item label="Capacity">{selectedStation.kwp} kWp</Descriptions.Item>
                          <Descriptions.Item label="Orientation">{selectedStation.orientationAngle}°</Descriptions.Item>
                          <Descriptions.Item label="Dip Angle">{selectedStation.dipAngle}°</Descriptions.Item>
                          
                          {selectedStation.ownerPhone && (
                            <Descriptions.Item label="Owner Phone">{selectedStation.ownerPhone}</Descriptions.Item>
                          )}
                          {selectedStation.plantContact && (
                            <Descriptions.Item label="Plant Contact">{selectedStation.plantContact}</Descriptions.Item>
                          )}
                          {selectedStation.plantContactPhone && (
                            <Descriptions.Item label="Plant Phone">{selectedStation.plantContactPhone}</Descriptions.Item>
                          )}
                          
                          {selectedStation.serviceProviderName && (
                            <Descriptions.Item label="Service Provider">{selectedStation.serviceProviderName}</Descriptions.Item>
                          )}
                          {selectedStation.serviceProviderPhone && (
                            <Descriptions.Item label="Service Phone">{selectedStation.serviceProviderPhone}</Descriptions.Item>
                          )}
                          {selectedStation.paymentType && (
                            <Descriptions.Item label="Payment Type">{selectedStation.paymentType}</Descriptions.Item>
                          )}
                          
                          {selectedStation.subassemblyNumber && (
                            <Descriptions.Item label="Subassemblies">{selectedStation.subassemblyNumber}</Descriptions.Item>
                          )}
                          <Descriptions.Item label="Last Update">{selectedStation.updateTime}</Descriptions.Item>
                          {selectedStation.networkTime && (
                            <Descriptions.Item label="Network Time">{selectedStation.networkTime}</Descriptions.Item>
                          )}
                        </Descriptions>
                        
                        {selectedStation.remark && (
                          <div style={{ marginTop: 16 }}>
                            <Text strong>Remarks:</Text>
                            <br />
                            <Text>{selectedStation.remark}</Text>
                          </div>
                        )}
                      </Card>
                    </Space>
                  ),
                },
                {
                  key: 'devices',
                  label: `Station Devices (${Array.isArray(devices) ? devices.length : 0})`,
                  children: (Array.isArray(devices) && devices.length > 0) ? (
                    <Table
                      columns={[
                        {
                          title: 'Device Name',
                          dataIndex: 'equipmentName',
                          key: 'equipmentName',
                        },
                        {
                          title: 'Serial Number',
                          dataIndex: 'equipmentSn',
                          key: 'equipmentSn',
                        },
                        {
                          title: 'Model',
                          dataIndex: 'equipmentModel',
                          key: 'equipmentModel',
                        },
                        {
                          title: 'Status',
                          dataIndex: 'status',
                          key: 'status',
                          render: (status: number) => (
                            <Badge
                              status={status === 1 ? 'success' : 'error'}
                              text={status === 1 ? 'Online' : 'Offline'}
                            />
                          ),
                        },
                        {
                          title: 'Current Power',
                          dataIndex: 'nowKw',
                          key: 'nowKw',
                          render: (power: number) => `${(power || 0).toFixed(2)} kW`,
                        },
                        {
                          title: 'Rated Power',
                          dataIndex: 'ratedPower',
                          key: 'ratedPower',
                          render: (power: number) => `${power} kW`,
                        },
                        {
                          title: 'Actions',
                          key: 'actions',
                          render: (_, record) => (
                            <Space size={4}>
                              <Button 
                                size="small"
                                icon={<ToolOutlined />}
                                onClick={() => handleViewDeviceDetails(record)}
                              >
                                Details
                              </Button>
                              <Button
                                size="small"
                                icon={<BarChartOutlined />}
                                onClick={() => handleViewEquipmentHistorical(record.equipmentSn, new Date().toISOString().split('T')[0])}
                              >
                                Historical
                              </Button>
                            </Space>
                          ),
                        },
                      ]}
                      dataSource={Array.isArray(devices) ? devices : []}
                      rowKey="id"
                      size="small"
                      pagination={{ pageSize: 10 }}
                    />
                  ) : (
                    <Empty description="No devices found for this station" />
                  ),
                },
                {
                  key: 'realtime',
                  label: 'Real-time Data',
                  children: (Array.isArray(realtimeData) && realtimeData.length > 0) ? (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {Array.isArray(realtimeData) && realtimeData.map((data, index) => (
                        <Card key={index} size="small" title="Current Real-time Metrics">
                          <Row gutter={16}>
                            <Col span={6}>
                              <Statistic
                                title="Active Power"
                                value={data.nowKw}
                                suffix="kW"
                              />
                            </Col>
                            <Col span={6}>
                              <Statistic
                                title="Day Yield"
                                value={data.todayKwh}
                                suffix="kWh"
                              />
                            </Col>
                            <Col span={6}>
                              <Statistic
                                title="Total Yield"
                                value={data.totalKwh}
                                suffix="kWh"
                              />
                            </Col>
                            <Col span={6}>
                              <Statistic
                                title="Efficiency"
                                value={0}
                                suffix="%"
                              />
                            </Col>
                          </Row>
                        </Card>
                      ))}
                    </Space>
                  ) : (
                    <Empty description="No real-time data available" />
                  ),
                },
              ]}
            />
          )}
        </Modal>

        {/* Device Details Drawer */}
        <Drawer
          title={
            <Space>
              <ToolOutlined />
              {selectedDevice ? selectedDevice.equipmentName : 'Device Details'}
            </Space>
          }
          placement="right"
          onClose={() => {
            setDeviceDrawerVisible(false);
            setSelectedDevice(null);
            setEquipmentDetails(null);
          }}
          open={deviceDrawerVisible}
          width={600}
        >
          {selectedDevice && (
            <Tabs
              defaultActiveKey="basic"
              items={[
                {
                  key: 'basic',
                  label: 'Basic Info',
                  children: (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                      <Card size="small" title="Basic Device Information">
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Equipment Name">{selectedDevice.equipmentName}</Descriptions.Item>
                          <Descriptions.Item label="Serial Number">{selectedDevice.equipmentSn}</Descriptions.Item>
                          <Descriptions.Item label="Model">{selectedDevice.equipmentModel}</Descriptions.Item>
                          <Descriptions.Item label="Type">{selectedDevice.deviceType || 'N/A'}</Descriptions.Item>
                          <Descriptions.Item label="Rated Power">{selectedDevice.ratedPower} kW</Descriptions.Item>
                          <Descriptions.Item label="Current Power">{(selectedDevice.nowKw || 0).toFixed(2)} kW</Descriptions.Item>
                          <Descriptions.Item label="Status">
                            <Badge 
                              status={selectedDevice.status === 1 ? 'success' : 'error'}
                              text={selectedDevice.status === 1 ? 'Online' : 'Offline'}
                            />
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>

                      {equipmentDetails && (
                        <Card size="small" title="Advanced Equipment Details">
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="Device Name">{equipmentDetails.deviceName}</Descriptions.Item>
                            <Descriptions.Item label="Device Type">{equipmentDetails.deviceType}</Descriptions.Item>
                            <Descriptions.Item label="Model">{equipmentDetails.model}</Descriptions.Item>
                            <Descriptions.Item label="Capacity">{equipmentDetails.capacity} kW</Descriptions.Item>
                            <Descriptions.Item label="Firmware Version">{equipmentDetails.firmwareVersion}</Descriptions.Item>
                            <Descriptions.Item label="Last Update">{equipmentDetails.lastUpdateTime}</Descriptions.Item>
                          </Descriptions>
                        </Card>
                      )}
                    </Space>
                  ),
                },
                {
                  key: 'realtime',
                  label: 'Real-time Data',
                  children: equipmentRealtimeData ? (
                    <Card size="small" title="Equipment Real-time Metrics">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Statistic
                            title="Active Power"
                            value={equipmentRealtimeData.activePower}
                            suffix="kW"
                            prefix={<ThunderboltOutlined />}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="Voltage"
                            value={equipmentRealtimeData.voltage}
                            suffix="V"
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="Current"
                            value={equipmentRealtimeData.current}
                            suffix="A"
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="Frequency"
                            value={equipmentRealtimeData.frequency}
                            suffix="Hz"
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="Temperature"
                            value={equipmentRealtimeData.temperature}
                            suffix="°C"
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="Efficiency"
                            value={equipmentRealtimeData.efficiency}
                            suffix="%"
                          />
                        </Col>
                      </Row>
                    </Card>
                  ) : (
                    <Empty description="No real-time data available" />
                  ),
                },
                {
                  key: 'alarms',
                  label: 'Device Alarms',
                  children: (
                    <Card 
                      size="small" 
                      title="Equipment Alarm History"
                      extra={
                        <Button
                          size="small"
                          icon={<ReloadOutlined />}
                          onClick={() => handleViewEquipmentAlarms(selectedDevice.equipmentSn)}
                        >
                          Load Alarms
                        </Button>
                      }
                    >
                      {(Array.isArray(equipmentAlarms) && equipmentAlarms.length > 0) ? (
                        <List
                          dataSource={Array.isArray(equipmentAlarms) ? equipmentAlarms : []}
                          renderItem={(alarm) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  <Avatar 
                                    icon={<AlertOutlined />} 
                                    style={{ backgroundColor: '#ff4d4f' }} 
                                  />
                                }
                                title={alarm.alarmType}
                                description={
                                  <Space direction="vertical" size={2}>
                                    <Text>{alarm.message}</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                      {new Date(alarm.occurredAt).toLocaleString()}
                                    </Text>
                                  </Space>
                                }
                              />
                            </List.Item>
                          )}
                          pagination={{ pageSize: 5 }}
                        />
                      ) : (
                        <Empty description="No alarms found for this device" />
                      )}
                    </Card>
                  ),
                },
                {
                  key: 'statistics',
                  label: 'Statistics',
                  children: (
                    <Card size="small" title="Equipment Performance Statistics">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Space>
                          <Button
                            icon={<BarChartOutlined />}
                            onClick={() => handleViewEquipmentStatistics(selectedDevice.equipmentSn, 'daily')}
                          >
                            Daily Stats
                          </Button>
                          <Button
                            icon={<BarChartOutlined />}
                            onClick={() => handleViewEquipmentStatistics(selectedDevice.equipmentSn, 'monthly')}
                          >
                            Monthly Stats
                          </Button>
                          <Button
                            icon={<BarChartOutlined />}
                            onClick={() => handleViewEquipmentStatistics(selectedDevice.equipmentSn, 'yearly')}
                          >
                            Yearly Stats
                          </Button>
                        </Space>
                        {Array.isArray(equipmentStatistics) && equipmentStatistics.length > 0 && (
                          <Table
                            columns={[
                              {
                                title: 'Period',
                                dataIndex: 'collectTime',
                                key: 'period',
                                render: (_, record) => record.collectTime,
                              },
                              {
                                title: 'Generation (kWh)',
                                dataIndex: 'totalGeneration',
                                key: 'generation',
                                render: (value) => value?.toFixed(2) || '0.00',
                              },
                              {
                                title: 'Peak Power (kW)',
                                dataIndex: 'peakPower',
                                key: 'peak',
                                render: (value) => value?.toFixed(2) || 'N/A',
                              },
                              {
                                title: 'Efficiency (%)',
                                dataIndex: 'efficiency',
                                key: 'efficiency',
                                render: (value) => value?.toFixed(1) || 'N/A',
                              },
                            ]}
                            dataSource={Array.isArray(equipmentStatistics) ? equipmentStatistics : []}
                            size="small"
                            pagination={{ pageSize: 10 }}
                          />
                        )}
                      </Space>
                    </Card>
                  ),
                },
              ]}
            />
          )}
        </Drawer>

        {/* Create Station Modal */}
        <Modal
          title="Create New Power Station"
          open={createStationVisible}
          onCancel={() => setCreateStationVisible(false)}
          footer={null}
          width={800}
        >
          <Form
            layout="vertical"
            onFinish={handleCreateStation}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="plantName"
                  label="Station Name"
                  rules={[{ required: true, message: 'Please input station name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="powerPlantType"
                  label="Plant Type"
                  rules={[{ required: true, message: 'Please select plant type' }]}
                >
                  <Select>
                    {stationConfigTypes?.powerPlantTypes && Object.entries(stationConfigTypes.powerPlantTypes).map(([key, value]) => (
                      <Select.Option key={key} value={key}>{value}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="networkType"
                  label="Network Type"
                  rules={[{ required: true, message: 'Please select network type' }]}
                >
                  <Select>
                    {stationConfigTypes?.networkTypes && Object.entries(stationConfigTypes.networkTypes).map(([key, value]) => (
                      <Select.Option key={key} value={key}>{value}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="kwp" label="Capacity (kWp)">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="address" label="Address">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="country" label="Country">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="province" label="Province">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="city" label="City">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="longitude" label="Longitude">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="latitude" label="Latitude">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="snList"
                  label="Device Serial Numbers"
                  rules={[{ required: true, message: 'Please input device serial numbers' }]}
                >
                  <Input.TextArea placeholder="Enter serial numbers, one per line" rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Create Station
                </Button>
                <Button onClick={() => setCreateStationVisible(false)} icon={<CloseOutlined />}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Bind Devices Modal */}
        <Modal
          title="Bind Devices to Station"
          open={bindDevicesVisible}
          onCancel={() => setBindDevicesVisible(false)}
          footer={null}
        >
          <Form
            layout="vertical"
            onFinish={(values) => {
              const deviceData: BindDevicesDto = {
                snList: values.snList?.split('\n').filter((sn: string) => sn.trim()) || [],
                pnList: values.pnList?.split('\n').filter((pn: string) => pn.trim()) || [],
              };
              handleBindDevices(selectedStationId, deviceData);
            }}
          >
            <Form.Item
              name="snList"
              label="Device Serial Numbers"
              rules={[{ required: true, message: 'Please input device serial numbers' }]}
            >
              <Input.TextArea placeholder="Enter serial numbers, one per line" rows={4} />
            </Form.Item>
            <Form.Item name="pnList" label="Device Part Numbers (Optional)">
              <Input.TextArea placeholder="Enter part numbers, one per line" rows={4} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<LinkOutlined />}>
                  Bind Devices
                </Button>
                <Button onClick={() => setBindDevicesVisible(false)} icon={<CloseOutlined />}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Alarm Details Modal */}
        <Modal
          title="Alarm Details"
          open={alarmDetailVisible}
          onCancel={() => {
            setAlarmDetailVisible(false);
            setSelectedAlarmDetails(null);
          }}
          footer={[
            <Button key="close" onClick={() => {
              setAlarmDetailVisible(false);
              setSelectedAlarmDetails(null);
            }}>
              Close
            </Button>
          ]}
          width={700}
        >
          {selectedAlarmDetails && (
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Alarm ID">{selectedAlarmDetails.alarmId}</Descriptions.Item>
              <Descriptions.Item label="Plant ID">{selectedAlarmDetails.plantId}</Descriptions.Item>
              <Descriptions.Item label="Device ID">{selectedAlarmDetails.deviceId}</Descriptions.Item>
              <Descriptions.Item label="Serial Number">{selectedAlarmDetails.deviceSn}</Descriptions.Item>
              <Descriptions.Item label="Alarm Type">{selectedAlarmDetails.alarmType}</Descriptions.Item>
              <Descriptions.Item label="Severity">{selectedAlarmDetails.severity}</Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                <Badge 
                  status={selectedAlarmDetails.status === 'active' ? 'error' : 'success'} 
                  text={selectedAlarmDetails.status} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="Message" span={2}>
                {selectedAlarmDetails.message}
              </Descriptions.Item>
              {selectedAlarmDetails.description && (
                <Descriptions.Item label="Description" span={2}>
                  {selectedAlarmDetails.description}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Occurred At">{selectedAlarmDetails.occurredAt}</Descriptions.Item>
              <Descriptions.Item label="Reported Time">{selectedAlarmDetails.reportedTime}</Descriptions.Item>
              {selectedAlarmDetails.causesAnalysis && (
                <Descriptions.Item label="Causes Analysis" span={2}>
                  {selectedAlarmDetails.causesAnalysis}
                </Descriptions.Item>
              )}
              {selectedAlarmDetails.diagnosticAdvice && (
                <Descriptions.Item label="Diagnostic Advice" span={2}>
                  {selectedAlarmDetails.diagnosticAdvice}
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Modal>

        {/* Communication Module Details Modal */}
        <Modal
          title="Communication Module Details"
          open={commModuleVisible}
          onCancel={() => {
            setCommModuleVisible(false);
            setSelectedCommModule(null);
          }}
          footer={[
            <Button key="close" onClick={() => {
              setCommModuleVisible(false);
              setSelectedCommModule(null);
            }}>
              Close
            </Button>
          ]}
          width={600}
        >
          {selectedCommModule && (
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Module Name">{selectedCommModule.divertorName}</Descriptions.Item>
              <Descriptions.Item label="Part Number">{selectedCommModule.equipmentPn}</Descriptions.Item>
              <Descriptions.Item label="Device Type">{selectedCommModule.deviceType}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge
                  status={selectedCommModule.status === 1 ? 'success' : 'error'}
                  text={selectedCommModule.status === 1 ? 'Online' : 'Offline'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="RSSI">{selectedCommModule.rssi} dBm</Descriptions.Item>
              <Descriptions.Item label="Loaded Number">{selectedCommModule.loadedNumber}</Descriptions.Item>
              {selectedCommModule.iccid && (
                <Descriptions.Item label="ICCID" span={2}>{selectedCommModule.iccid}</Descriptions.Item>
              )}
              {selectedCommModule.latitude && selectedCommModule.longitude && (
                <>
                  <Descriptions.Item label="Latitude">{selectedCommModule.latitude}</Descriptions.Item>
                  <Descriptions.Item label="Longitude">{selectedCommModule.longitude}</Descriptions.Item>
                </>
              )}
              {selectedCommModule.operatorType && (
                <Descriptions.Item label="Operator">{selectedCommModule.operatorType}</Descriptions.Item>
              )}
              {selectedCommModule.powerPlantName && (
                <Descriptions.Item label="Power Plant">{selectedCommModule.powerPlantName}</Descriptions.Item>
              )}
              {selectedCommModule.updateTime && (
                <Descriptions.Item label="Last Update">{selectedCommModule.updateTime}</Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Modal>

        {/* Statistics Modal */}
        <Modal
          title="Statistics Analysis"
          open={statisticsVisible}
          onCancel={() => {
            setStatisticsVisible(false);
            setStationStatistics([]);
            setEquipmentStatistics([]);
          }}
          footer={[
            <Button key="close" onClick={() => {
              setStatisticsVisible(false);
              setStationStatistics([]);
              setEquipmentStatistics([]);
            }}>
              Close
            </Button>
          ]}
          width={800}
        >
          {((Array.isArray(stationStatistics) && stationStatistics.length > 0) || (Array.isArray(equipmentStatistics) && equipmentStatistics.length > 0)) && (
            <Table
              columns={[
                {
                  title: 'Period',
                  key: 'period',
                  render: (_, record) => record.collectTime || 'N/A',
                },
                {
                  title: 'Total Generation (kWh)',
                  dataIndex: 'totalGeneration',
                  key: 'generation',
                  render: (value) => value?.toFixed(2) || '0.00',
                },
                {
                  title: 'Peak Power (kW)',
                  dataIndex: 'peakPower',
                  key: 'peak',
                  render: (value) => value?.toFixed(2) || 'N/A',
                },
                {
                  title: 'Average Power (kW)',
                  dataIndex: 'averagePower',
                  key: 'average',
                  render: (value) => value?.toFixed(2) || 'N/A',
                },
                {
                  title: 'Efficiency (%)',
                  dataIndex: 'efficiency',
                  key: 'efficiency',
                  render: (value) => value?.toFixed(1) || 'N/A',
                },
              ]}
              dataSource={
                (Array.isArray(stationStatistics) && stationStatistics.length > 0) 
                  ? stationStatistics 
                  : (Array.isArray(equipmentStatistics) ? equipmentStatistics : [])
              }
              size="small"
              pagination={{ pageSize: 15 }}
              scroll={{ y: 400 }}
            />
          )}
        </Modal>
      </Content>

      {/* New Consolidated Historical Data Modal */}
      <Modal
        title={<><BarChartOutlined /> Historical Data</>}
        open={historicalDataVisible}
        onCancel={() => setHistoricalDataVisible(false)}
        width={1400}
        style={{ top: 20 }}
        footer={[
          <Button key="close" onClick={() => setHistoricalDataVisible(false)}>
            Close
          </Button>
        ]}
      >
        <Tabs
          activeKey={historicalDataActiveTab}
          onChange={handleHistoricalTabChange}
          type="card"
          items={[
            {
              key: 'daily',
              label: (
                <span>
                  <CalendarOutlined />
                  Daily
                </span>
              ),
              children: (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Row gutter={16} align="middle">
                    <Col>
                      <Text strong>Date: </Text>
                      <DatePicker 
                        value={dayjs(dailyHistoricalDate)}
                        onChange={(date) => {
                          if (date) {
                            const newDate = date.format('YYYY-MM-DD');
                            setDailyHistoricalDate(newDate);
                            if (historicalDataStationId) {
                              handleLoadDailyHistoricalData(historicalDataStationId, newDate);
                            }
                          }
                        }}
                        format="YYYY-MM-DD"
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                      />
                    </Col>
                    <Col>
                      <Text type="secondary">
                        Showing {dailyHistoricalData.length} data points for {dailyHistoricalDate}
                      </Text>
                    </Col>
                  </Row>

                  {dailyHistoricalData.length > 0 ? (
                    <div style={{ height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time"
                    interval="preserveStartEnd"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [`${value.toFixed(2)} kW`, 'Power']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="power"
                    stroke="#1890ff"
                    fill="#1890ff"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="Power Generation"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty description="No historical power data available" />
          )}

                  {dailyHistoricalData.length > 0 && (
                    <Row gutter={16}>
                      <Col span={6}>
                        <Statistic
                          title="Peak Power"
                          value={Math.max(...dailyHistoricalData.map(d => d.power))}
                          suffix="kW"
                          precision={2}
                          valueStyle={{ color: '#cf1322' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Average Power"
                          value={dailyHistoricalData.reduce((sum, d) => sum + d.power, 0) / dailyHistoricalData.length}
                          suffix="kW"
                          precision={2}
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Total Generation"
                          value={dailyHistoricalData.reduce((sum, d) => sum + (d.power * 10 / 60), 0)}
                          suffix="kWh"
                          precision={2}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Peak Time"
                          value={dailyHistoricalData.find(d => d.power === Math.max(...dailyHistoricalData.map(p => p.power)))?.time || 'N/A'}
                          valueStyle={{ color: '#722ed1' }}
                        />
                      </Col>
                    </Row>
                  )}
                </Space>
              )
            },
            {
              key: 'monthly',
              label: (
                <span>
                  <CalendarOutlined />
                  Monthly
                </span>
              ),
              children: (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Row gutter={16} align="middle">
                    <Col>
                      <Text strong>Year: </Text>
                      <DatePicker 
                        picker="year"
                        value={dayjs(monthlyHistoricalYear)}
                        onChange={(date) => {
                          if (date) {
                            const newYear = date.format('YYYY');
                            setMonthlyHistoricalYear(newYear);
                            if (historicalDataStationId) {
                              handleLoadMonthlyHistoricalData(historicalDataStationId, newYear, monthlyHistoricalMonth);
                            }
                          }
                        }}
                        format="YYYY"
                      />
                    </Col>
                    <Col>
                      <Text strong>Month: </Text>
                      <Select
                        value={monthlyHistoricalMonth}
                        onChange={(month) => {
                          setMonthlyHistoricalMonth(month);
                          if (historicalDataStationId) {
                            handleLoadMonthlyHistoricalData(historicalDataStationId, monthlyHistoricalYear, month);
                          }
                        }}
                        style={{ width: 120 }}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <Select.Option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                            {new Date(0, i).toLocaleDateString('en-US', { month: 'long' })}
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                    <Col>
                      <Text type="secondary">
                        Showing {monthlyHistoricalData.length} days for {monthlyHistoricalYear}-{monthlyHistoricalMonth}
                      </Text>
                    </Col>
                  </Row>

                  {monthlyHistoricalData.length > 0 ? (
                    <div style={{ height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyHistoricalData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="time"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }}
                            tick={{ fontSize: 12 }}
                          />
                          <RechartsTooltip 
                            formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Daily Energy']}
                            labelFormatter={(label) => `Day ${label}`}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="power"
                            stroke="#52c41a"
                            fill="#52c41a"
                            fillOpacity={0.3}
                            strokeWidth={2}
                            name="Daily Average Power"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <Empty description="No monthly historical data available" />
                  )}

                  {monthlyHistoricalData.length > 0 && (
                    <Row gutter={16}>
                      <Col span={6}>
                        <Statistic
                          title="Best Day"
                          value={Math.max(...monthlyHistoricalData.map(d => d.power))}
                          suffix="kW"
                          precision={2}
                          valueStyle={{ color: '#cf1322' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Monthly Average"
                          value={monthlyHistoricalData.reduce((sum, d) => sum + d.power, 0) / monthlyHistoricalData.length}
                          suffix="kW"
                          precision={2}
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Total Generation"
                          value={monthlyHistoricalData.reduce((sum, d) => sum + d.power, 0)}
                          suffix="kW"
                          precision={2}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Days Tracked"
                          value={monthlyHistoricalData.length}
                          valueStyle={{ color: '#722ed1' }}
                        />
                      </Col>
                    </Row>
                  )}
                </Space>
              )
            },
            {
              key: 'yearly',
              label: (
                <span>
                  <LineChartOutlined />
                  Yearly
                </span>
              ),
              children: (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Row gutter={16} align="middle">
                    <Col>
                      <Text strong>Year: </Text>
                      <DatePicker 
                        picker="year"
                        value={dayjs(yearlyHistoricalYear)}
                        onChange={(date) => {
                          if (date) {
                            const newYear = date.format('YYYY');
                            setYearlyHistoricalYear(newYear);
                            if (historicalDataStationId) {
                              handleLoadYearlyHistoricalData(historicalDataStationId, newYear);
                            }
                          }
                        }}
                        format="YYYY"
                      />
                    </Col>
                    <Col>
                      <Text type="secondary">
                        Showing {yearlyHistoricalData.length} months for {yearlyHistoricalYear}
                      </Text>
                    </Col>
                  </Row>

                  {yearlyHistoricalData.length > 0 ? (
                    <div style={{ height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={yearlyHistoricalData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="time"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }}
                            tick={{ fontSize: 12 }}
                          />
                          <RechartsTooltip 
                            formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Monthly Energy']}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="power"
                            stroke="#722ed1"
                            fill="#722ed1"
                            fillOpacity={0.3}
                            strokeWidth={2}
                            name="Monthly Total Power"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <Empty description="No yearly historical data available" />
                  )}

                  {yearlyHistoricalData.length > 0 && (
                    <Row gutter={16}>
                      <Col span={6}>
                        <Statistic
                          title="Best Month"
                          value={Math.max(...yearlyHistoricalData.map(d => d.power))}
                          suffix="kW"
                          precision={2}
                          valueStyle={{ color: '#cf1322' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Yearly Average"
                          value={yearlyHistoricalData.reduce((sum, d) => sum + d.power, 0) / yearlyHistoricalData.length}
                          suffix="kW"
                          precision={2}
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Total Generation"
                          value={yearlyHistoricalData.reduce((sum, d) => sum + d.power, 0)}
                          suffix="kW"
                          precision={2}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="Months Tracked"
                          value={yearlyHistoricalData.length}
                          valueStyle={{ color: '#722ed1' }}
                        />
                      </Col>
                    </Row>
                  )}
                </Space>
              )
            }
          ]}
        />
      </Modal>

      {/* Equipment Historical Data Modal */}
      <Modal
        title={<><LineChartOutlined /> Equipment Historical Data</>}
        open={equipmentHistoricalVisible}
        onCancel={() => setEquipmentHistoricalVisible(false)}
        width={1200}
        footer={[
          <Button key="close" onClick={() => setEquipmentHistoricalVisible(false)}>
            Close
          </Button>
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {equipmentHistoricalData.length > 0 ? (
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equipmentHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="power"
                    label={{ value: 'Power (kWh)', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="income"
                    orientation="right"
                    label={{ value: 'Income ($)', angle: 90, position: 'insideRight' }}
                    tick={{ fontSize: 12 }}
                  />
                  <RechartsTooltip 
                    formatter={(value: number, name: string) => [
                      name === 'Power Generation' ? `${value.toFixed(2)} kWh` : `$${value.toFixed(2)}`,
                      name === 'Power Generation' ? 'Monthly Generation' : 'Monthly Income'
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="power"
                    stroke="#1890ff"
                    fill="#1890ff"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name="Power Generation"
                    yAxisId="power"
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#52c41a"
                    fill="#52c41a"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Income"
                    yAxisId="income"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty description="No monthly power data available" />
          )}

          {equipmentHistoricalData.length > 0 && (
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Peak Period"
                  value={equipmentHistoricalData.find(d => d.power === Math.max(...equipmentHistoricalData.map(p => p.power)))?.time || 'N/A'}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Average Power"
                  value={equipmentHistoricalData.reduce((sum, d) => sum + d.power, 0) / equipmentHistoricalData.length}
                  suffix="kWh"
                  precision={2}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Total Power"
                  value={equipmentHistoricalData.reduce((sum, d) => sum + d.power, 0)}
                  suffix="kWh"
                  precision={2}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Total Income"
                  value={equipmentHistoricalData.reduce((sum, d) => sum + d.income, 0)}
                  prefix="$"
                  precision={2}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          )}
        </Space>
      </Modal>


      {/* Equipment Historical Data Modal */}
      <Modal
        title={<><BarChartOutlined /> Equipment Historical Analysis</>}
        open={equipmentHistoricalVisible}
        onCancel={() => setEquipmentHistoricalVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setEquipmentHistoricalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {equipmentHistoricalData.length > 0 ? (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={equipmentHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ value: 'Performance', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <RechartsTooltip 
                    formatter={(value: number, name: string) => [value, name]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="power"
                    stroke="#1890ff"
                    strokeWidth={2}
                    name="Power Output"
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#52c41a"
                    strokeWidth={2}
                    name="Efficiency"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Data Points"
                  value={equipmentHistoricalData.length}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Average Performance"
                  value={equipmentHistoricalData.reduce((sum, d) => sum + (d.power || 0), 0) / equipmentHistoricalData.length}
                  suffix="kW"
                  precision={2}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Peak Performance"
                  value={Math.max(...equipmentHistoricalData.map(d => d.power || 0))}
                  suffix="kW"
                  precision={2}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
            </Row>
          </Space>
        ) : (
          <Empty description="No historical data available for this equipment" />
        )}
      </Modal>

      {/* Communication Module Details Modal */}
      <Modal
        title={<><WifiOutlined /> Communication Module Details</>}
        open={commModuleDetailsVisible}
        onCancel={() => setCommModuleDetailsVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setCommModuleDetailsVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedCommModuleDetails && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Module ID">{selectedCommModuleDetails.id}</Descriptions.Item>
            <Descriptions.Item label="Equipment PN">{selectedCommModuleDetails.equipmentPn}</Descriptions.Item>
            <Descriptions.Item label="Name">{selectedCommModuleDetails.divertorName}</Descriptions.Item>
            <Descriptions.Item label="Device Type">{selectedCommModuleDetails.deviceType}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge status={selectedCommModuleDetails.status === 1 ? 'success' : 'error'} text={selectedCommModuleDetails.status === 1 ? 'Online' : 'Offline'} />
            </Descriptions.Item>
            <Descriptions.Item label="RSSI">{selectedCommModuleDetails.rssi} dBm</Descriptions.Item>
            <Descriptions.Item label="Loaded Devices">{selectedCommModuleDetails.loadedNumber}</Descriptions.Item>
            {selectedCommModuleDetails.iccid && (
              <Descriptions.Item label="ICCID">{selectedCommModuleDetails.iccid}</Descriptions.Item>
            )}
            {selectedCommModuleDetails.operatorType && (
              <Descriptions.Item label="Operator">{selectedCommModuleDetails.operatorType}</Descriptions.Item>
            )}
            {selectedCommModuleDetails.updateTime && (
              <Descriptions.Item label="Last Update">{selectedCommModuleDetails.updateTime}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
      
    </Layout>
  );
};

export default HopeCloudManagement;