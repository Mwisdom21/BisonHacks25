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
  // State variables for additional fields on page 2
  const [icuBeds, setIcuBeds] = useState('');
  const [ppeStock, setPpeStock] = useState('');
  const [ventUsage, setVentUsage] = useState('');
  // State variable for dashboard active tab
  const [activeTab, setActiveTab] = useState('tab1');

  // State variables for chart data
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Navigation functions
  const nextPage = () => {
    setPage(prev => Math.min(prev + 1, 2)); // Pages: 0, 1, and 2
  };

  const prevPage = () => {
    setPage(prev => Math.max(prev - 1, 0));
  };

  // Fetch chart data when on page 2 and activeTab is "tab2"
  useEffect(() => {
    if (page === 2 && activeTab === 'tab2') {
      setLoading(true);
      fetch('http://127.0.0.1:5000/quant')
        .then(response => response.json())
        .then(data => {
          // Expecting API response format: { data: [ ... ] }
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

  // Render different pages based on the current page state
  const renderPage = () => {
    if (page === 0) {
      return (
        <>
          {/* Organization Name Section */}
          <Text style={styles.label}>Organization Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter organization name"
            value={orgName}
            onChangeText={setOrgName}
          />

          {/* Role Section */}
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
          {/* Page 2: Additional Details */}
          <View style={styles.roleBox}>
            <Text style={styles.roleBoxText}>{role}</Text>
          </View>
          <Text style={styles.orgText}>Organization: {orgName}</Text>

          {/* Additional Fields */}
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
          {/* Dashboard Title */}
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          {/* Tabs container */}
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
          {/* Tab content */}
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
                    width={Dimensions.get('window').width - 48} // subtracting margins
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
          {/* Bottom profile info */}
          <View style={styles.bottomProfile}>
            <Text style={styles.profileText}>
              {role} | {orgName}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* "Medalytics" title appears only on page 0 */}
        {page === 0 && <Text style={styles.header}>Medalytics</Text>}
        {renderPage()}
      </View>
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={prevPage} disabled={page === 0}>
          <Text style={[styles.navButton, page === 0 && styles.disabled]}>
            {"<"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextPage} disabled={page === 2}>
          <Text style={[styles.navButton, page === 2 && styles.disabled]}>
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 24,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 24,
    marginTop: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 24,
    marginVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  roleContainer: {
    marginHorizontal: 24,
    marginTop: 24,
  },
  roleLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    color: '#000',
  },
  pickerItem: {
    fontSize: 18,
    color: '#000',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  navButton: {
    fontSize: 40,
    color: '#000',
  },
  disabled: {
    color: 'gray',
  },
  pageContent: {
    alignItems: 'center',
    marginTop: 24,
  },
  roleBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 24,
    marginTop: 15,
    alignItems: 'center',
    width: '80%',
  },
  roleBoxText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  orgText: {
    fontSize: 20,
    marginTop: 12,
    textAlign: 'center',
    color: '#000',
  },
  dashboardContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  tabContent: {
    alignItems: 'center',
  },
  tabContentText: {
    fontSize: 18,
    marginTop: 20,
  },
  bottomProfile: {
    alignItems: 'center',
    marginTop: 30,
  },
  profileText: {
    fontSize: 16,
    color: '#555',
  },
});

