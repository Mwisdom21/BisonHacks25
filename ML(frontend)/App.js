import React, { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';

export default function App() {
  const [role, setRole] = useState('Healthcare Admin');
  const [orgName, setOrgName] = useState('');
  const [page, setPage] = useState(0);
  const [icuBeds, setIcuBeds] = useState('');
  const [ppeStock, setPpeStock] = useState('');
  const [ventUsage, setVentUsage] = useState('');
  const [activeTab, setActiveTab] = useState('tab1');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Navigation functions
  const nextPage = () => {
    setPage(prev => Math.min(prev + 1, 3)); // Allow navigation to page 3
  };

  const prevPage = () => {
    setPage(prev => Math.max(prev - 1, 0));
  };

  const restartForm = () => {
    setPage(0);
  };

  // Fetch chart data when on page 2 and activeTab is "tab2"
  useEffect(() => {
    if (page === 2 && activeTab === 'tab2') {
      setLoading(true);
      fetch('http://127.0.0.1:5000/quant')
        .then(response => response.json())
        .then(data => {
          setChartData(data.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Error fetching chart data');
          setLoading(false);
        });
    }
  }, [page, activeTab]);

  // Render pages based on the current page state
  const renderPage = () => {
    if (page === 0) {
      return (
        <>
          <Text style={styles.label}>Organization Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter organization name"
            value={orgName}
            onChangeText={setOrgName}
          />
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Role</Text>
            <Picker
              selectedValue={role}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="Healthcare Admin" value="Healthcare Admin" />
              <Picker.Item label="Govt. Official" value="Govt. Official" />
            </Picker>
          </View>
        </>
      );
    } else if (page === 1) {
      return (
        <View style={styles.pageContent}>
          <View style={styles.roleBox}>
            <Text style={styles.roleBoxText}>{role}</Text>
          </View>
          <Text style={styles.orgText}>Organization: {orgName}</Text>

          <Text style={styles.label}>ICU Beds</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of ICU beds"
            value={icuBeds}
            onChangeText={setIcuBeds}
            keyboardType="numeric"
          />

          <Text style={styles.label}>PPE Stock</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter PPE stock"
            value={ppeStock}
            onChangeText={setPpeStock}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Ventilator Usage</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter ventilator usage"
            value={ventUsage}
            onChangeText={setVentUsage}
            keyboardType="numeric"
          />
        </View>
      );
    } else if (page === 2) {
      return (
        <View style={styles.dashboardContainer}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'tab1' && styles.activeTab]}
              onPress={() => setActiveTab('tab1')}
            >
              <Text style={styles.tabText}>MedDash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'tab2' && styles.activeTab]}
              onPress={() => setActiveTab('tab2')}
            >
              <Text style={styles.tabText}>Network Optimization</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabContent}>
            {activeTab === 'tab1' && (
              <Text style={styles.tabContentText}>MedDash</Text>
            )}
            {activeTab === 'tab2' && (
              <>
                {loading ? (
                  <Text style={styles.tabContentText}>Loading chart data...</Text>
                ) : error ? (
                  <Text style={styles.tabContentText}>{error}</Text>
                ) : (
                  <LineChart
                    data={{
                      labels: chartData.map((_, index) => `Label ${index + 1}`),
                      datasets: [{ data: chartData }],
                    }}
                    width={Dimensions.get('window').width - 48}
                    height={220}
                    chartConfig={{
                      backgroundColor: '#e26a00',
                      backgroundGradientFrom: '#fb8c00',
                      backgroundGradientTo: '#ffa726',
                      decimalPlaces: 2,
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726',
                      },
                    }}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                )}
              </>
            )}
          </View>
          <View style={styles.bottomProfile}>
            <Text style={styles.profileText}>
              {role} | {orgName}
            </Text>
          </View>
        </View>
      );
    } else if (page === 3) {
      return (
        <View style={styles.pageContent}>
          <Text style={styles.dashboardTitle}>Thank You!</Text>
          <Text style={styles.tabContentText}>
            You've successfully completed the form.
          </Text>
          <TouchableOpacity onPress={restartForm}>
            <Text style={styles.navButton}>Restart</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {page === 0 && <Text style={styles.header}>Medalytics</Text>}
        {renderPage()}
      </View>
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={prevPage} disabled={page === 0}>
          <Text style={[styles.navButton, page === 0 && styles.disabled]}>
            {"<"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextPage} disabled={page === 3}>
          <Text style={[styles.navButton, page === 3 && styles.disabled]}>
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Keep your existing styles here
