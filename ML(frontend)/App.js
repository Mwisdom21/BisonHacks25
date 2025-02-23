import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [role, setRole] = useState('Healthcare Admin');
  const [orgName, setOrgName] = useState('');
  const [page, setPage] = useState(0);
  // State variables for additional fields on page 2
  const [icuBeds, setIcuBeds] = useState('');
  const [ppeStock, setPpeStock] = useState('');
  const [ventUsage, setVentUsage] = useState('');

  // Function to move to the next page
  const nextPage = () => {
    setPage(prev => Math.min(prev + 1, 2)); // now limiting to 3 pages (0, 1, and 2)
  };

  const prevPage = () => {
    setPage(prev => Math.max(prev - 1, 0));
  };

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
          {/* Content for page 2 */}
          <View style={styles.roleBox}>
            <Text style={styles.roleBoxText}>{role}</Text>
          </View>
          <Text style={styles.orgText}>Organization: {orgName}</Text>

          {/* Additional fields on page 2 */}
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
        <View style={styles.pageContent}>
          {/* Dashboard page */}
          <Text style={styles.header}>Dashboard</Text>
          <View style={styles.roleBox}>
            <Text style={styles.roleBoxText}>{role}</Text>
          </View>
          <Text style={styles.orgText}>Organization: {orgName}</Text>
          {/* Additional dashboard content can be added here */}
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
});