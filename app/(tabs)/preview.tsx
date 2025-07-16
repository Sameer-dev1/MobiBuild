import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Smartphone, Tablet, Monitor, RotateCcw, RefreshCw, Play } from 'lucide-react-native';
import { useAppStore } from '../../store/AppStore';
import { ComponentRenderer } from '../../components/ComponentRenderer';

export default function Preview() {
  const {
    components,
    currentProject,
    deviceType,
    orientation,
    setDeviceType,
    setOrientation
  } = useAppStore();

  const devices = [
    { key: 'phone', name: 'Phone', icon: Smartphone, dimensions: { width: 375, height: 667 } },
    { key: 'tablet', name: 'Tablet', icon: Tablet, dimensions: { width: 768, height: 1024 } },
    { key: 'desktop', name: 'Desktop', icon: Monitor, dimensions: { width: 1200, height: 800 } },
  ];

  const getCurrentDevice = () => devices.find(d => d.key === deviceType);
  const currentDevice = getCurrentDevice();

  const getDeviceDimensions = () => {
    if (!currentDevice) return { width: 375, height: 667 };
    
    if (orientation === 'landscape') {
      return {
        width: Math.max(currentDevice.dimensions.width, currentDevice.dimensions.height),
        height: Math.min(currentDevice.dimensions.width, currentDevice.dimensions.height),
      };
    }
    return currentDevice.dimensions;
  };

  const dimensions = getDeviceDimensions();
  const scale = Math.min(300 / dimensions.width, 400 / dimensions.height);

  if (!currentProject) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noProjectContainer}>
          <Smartphone size={64} color="#9CA3AF" />
          <Text style={styles.noProjectTitle}>No Project Selected</Text>
          <Text style={styles.noProjectText}>
            Create or select a project to preview your mobile app.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Live Preview</Text>
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
          >
            <RotateCcw size={18} color="#3B82F6" />
            <Text style={styles.controlText}>Rotate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <RefreshCw size={18} color="#10B981" />
            <Text style={styles.controlText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Device Selector */}
      <View style={styles.deviceSelector}>
        {devices.map((device) => {
          const IconComponent = device.icon;
          return (
            <TouchableOpacity
              key={device.key}
              style={[
                styles.deviceButton,
                deviceType === device.key && styles.activeDevice,
              ]}
              onPress={() => setDeviceType(device.key as any)}
            >
              <IconComponent
                size={20}
                color={deviceType === device.key ? '#3B82F6' : '#6B7280'}
              />
              <Text
                style={[
                  styles.deviceText,
                  deviceType === device.key && styles.activeDeviceText,
                ]}
              >
                {device.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Preview Area */}
      <ScrollView style={styles.previewArea} contentContainerStyle={styles.previewContent}>
        <View style={styles.deviceFrame}>
          <View
            style={[
              styles.deviceScreen,
              {
                width: dimensions.width * scale,
                height: dimensions.height * scale,
                transform: [{ scale: Math.min(scale, 1) }],
              },
            ]}
          >
            {/* Status Bar */}
            <View style={styles.statusBar}>
              <Text style={styles.statusTime}>9:41</Text>
              <View style={styles.statusIcons}>
                <View style={styles.batteryIcon} />
              </View>
            </View>

            {/* App Content */}
            <ScrollView style={styles.appContent}>
              {components.length > 0 ? (
                components.map((component) => (
                  <ComponentRenderer
                    key={component.id}
                    component={component}
                  />
                ))
              ) : (
                <View style={styles.emptyPreview}>
                  <Play size={32} color="#9CA3AF" />
                  <Text style={styles.emptyPreviewText}>No components to preview</Text>
                  <Text style={styles.emptyPreviewSubtext}>Add components in the Builder tab</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Device Info */}
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceInfoTitle}>Preview Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Project:</Text>
          <Text style={styles.infoValue}>{currentProject.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Device:</Text>
          <Text style={styles.infoValue}>{currentDevice?.name} ({orientation})</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Resolution:</Text>
          <Text style={styles.infoValue}>{dimensions.width} × {dimensions.height}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Components:</Text>
          <Text style={styles.infoValue}>{components.length}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Scale:</Text>
          <Text style={styles.infoValue}>{Math.round(scale * 100)}%</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  noProjectContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noProjectTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noProjectText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  controlText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 6,
  },
  deviceSelector: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  deviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F9FAFB',
  },
  activeDevice: {
    backgroundColor: '#EBF4FF',
  },
  deviceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  activeDeviceText: {
    color: '#3B82F6',
  },
  previewArea: {
    flex: 1,
  },
  previewContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  deviceFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceScreen: {
    backgroundColor: '#000000',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  statusBar: {
    backgroundColor: '#FFFFFF',
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  statusTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryIcon: {
    width: 24,
    height: 12,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  appContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  emptyPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyPreviewText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 12,
  },
  emptyPreviewSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  deviceInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  deviceInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
});