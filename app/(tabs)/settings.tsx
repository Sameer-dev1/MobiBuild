import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings as SettingsIcon, Download, Database, Palette, Code, Cloud, User, Bell, Shield, CircleHelp as HelpCircle, ExternalLink, Save } from 'lucide-react-native';
import { useAppStore } from '../../store/AppStore';
import { validateFirebaseConfig } from '../../utils/helpers';

export default function Settings() {
  const { currentProject, updateProjectSettings, saveProject } = useAppStore();
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });

  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(currentProject?.settings.theme === 'dark');

  const handleThemeChange = (isDark: boolean) => {
    setDarkMode(isDark);
    updateProjectSettings({ theme: isDark ? 'dark' : 'light' });
    saveProject();
  };

  const handleColorChange = (colorType: 'primaryColor' | 'secondaryColor', color: string) => {
    updateProjectSettings({ [colorType]: color });
    saveProject();
  };

  const handleFirebaseConfigSave = () => {
    if (validateFirebaseConfig(firebaseConfig)) {
      updateProjectSettings({ firebaseConfig });
      saveProject();
      setShowFirebaseModal(false);
    } else {
      alert('Please fill in all Firebase configuration fields');
    }
  };

  const settingSections = [
    {
      title: 'Project Settings',
      items: [
        { 
          icon: Palette, 
          label: 'Theme Settings', 
          subtitle: 'Customize appearance', 
          action: 'custom',
          component: () => (
            <View style={styles.themeSettings}>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Switch
                  value={darkMode}
                  onValueChange={handleThemeChange}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Primary Color</Text>
                <TextInput
                  style={styles.colorInput}
                  value={currentProject?.settings.primaryColor}
                  onChangeText={(color) => handleColorChange('primaryColor', color)}
                  placeholder="#3B82F6"
                />
              </View>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Secondary Color</Text>
                <TextInput
                  style={styles.colorInput}
                  value={currentProject?.settings.secondaryColor}
                  onChangeText={(color) => handleColorChange('secondaryColor', color)}
                  placeholder="#8B5CF6"
                />
              </View>
            </View>
          )
        },
        { 
          icon: Database, 
          label: 'Firebase Config', 
          subtitle: 'Database connection', 
          action: 'firebase'
        },
      ]
    },
    {
      title: 'Application',
      items: [
        { icon: Bell, label: 'Notifications', subtitle: 'App notifications', action: 'toggle', value: notifications, setValue: setNotifications },
        { icon: Cloud, label: 'Auto Save', subtitle: 'Automatically save changes', action: 'toggle', value: autoSave, setValue: setAutoSave },
      ]
    },
    {
      title: 'Account & Support',
      items: [
        { icon: User, label: 'Account Settings', subtitle: 'Manage your account', action: 'navigate' },
        { icon: HelpCircle, label: 'Help & Support', subtitle: 'Get help and documentation', action: 'navigate' },
        { icon: ExternalLink, label: 'Documentation', subtitle: 'View full documentation', action: 'external' },
      ]
    }
  ];

  const renderSettingItem = (item: any) => {
    const IconComponent = item.icon;
    
    return (
      <View key={item.label} style={styles.settingItemContainer}>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => {
            if (item.action === 'firebase') {
              setShowFirebaseModal(true);
            }
          }}
        >
          <View style={styles.settingIcon}>
            <IconComponent size={20} color="#3B82F6" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
          <View style={styles.settingAction}>
            {item.action === 'toggle' ? (
              <Switch
                value={item.value}
                onValueChange={item.setValue}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            ) : (
              <ExternalLink size={16} color="#9CA3AF" />
            )}
          </View>
        </TouchableOpacity>
        {item.component && item.component()}
      </View>
    );
  };

  if (!currentProject) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noProjectContainer}>
          <SettingsIcon size={64} color="#9CA3AF" />
          <Text style={styles.noProjectTitle}>No Project Selected</Text>
          <Text style={styles.noProjectText}>
            Create or select a project to access settings and configuration options.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SettingsIcon size={28} color="#3B82F6" />
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Project Info */}
        <View style={styles.projectSection}>
          <Text style={styles.projectTitle}>Current Project</Text>
          <View style={styles.projectCard}>
            <Text style={styles.projectName}>{currentProject.name}</Text>
            <Text style={styles.projectDescription}>{currentProject.description || 'No description'}</Text>
            <Text style={styles.projectStats}>
              {currentProject.components.length} components • Theme: {currentProject.settings.theme}
            </Text>
          </View>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section) => (
          <View key={section.title} style={styles.settingSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingList}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Firebase Configuration Status */}
        <View style={styles.configSection}>
          <Text style={styles.configTitle}>Firebase Configuration</Text>
          <View style={styles.configCard}>
            <View style={styles.configStatus}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: currentProject.settings.firebaseConfig ? '#10B981' : '#EF4444' }
              ]} />
              <Text style={[
                styles.statusText,
                { color: currentProject.settings.firebaseConfig ? '#10B981' : '#EF4444' }
              ]}>
                {currentProject.settings.firebaseConfig ? 'Connected' : 'Not Configured'}
              </Text>
            </View>
            {currentProject.settings.firebaseConfig && (
              <Text style={styles.configProject}>
                Project: {currentProject.settings.firebaseConfig.projectId}
              </Text>
            )}
            <TouchableOpacity 
              style={styles.configButton}
              onPress={() => setShowFirebaseModal(true)}
            >
              <Text style={styles.configButtonText}>
                {currentProject.settings.firebaseConfig ? 'Update Config' : 'Configure Firebase'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Platform Information */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Platform Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>React Native:</Text>
              <Text style={styles.infoValue}>0.72.6</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Expo SDK:</Text>
              <Text style={styles.infoValue}>49.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Firebase:</Text>
              <Text style={styles.infoValue}>10.7.1</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Firebase Configuration Modal */}
      <Modal
        visible={showFirebaseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFirebaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Firebase Configuration</Text>
            
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalLabel}>API Key</Text>
              <TextInput
                style={styles.modalInput}
                value={firebaseConfig.apiKey}
                onChangeText={(value) => setFirebaseConfig(prev => ({ ...prev, apiKey: value }))}
                placeholder="AIzaSyC..."
              />
              
              <Text style={styles.modalLabel}>Auth Domain</Text>
              <TextInput
                style={styles.modalInput}
                value={firebaseConfig.authDomain}
                onChangeText={(value) => setFirebaseConfig(prev => ({ ...prev, authDomain: value }))}
                placeholder="your-project.firebaseapp.com"
              />
              
              <Text style={styles.modalLabel}>Project ID</Text>
              <TextInput
                style={styles.modalInput}
                value={firebaseConfig.projectId}
                onChangeText={(value) => setFirebaseConfig(prev => ({ ...prev, projectId: value }))}
                placeholder="your-project-id"
              />
              
              <Text style={styles.modalLabel}>Storage Bucket</Text>
              <TextInput
                style={styles.modalInput}
                value={firebaseConfig.storageBucket}
                onChangeText={(value) => setFirebaseConfig(prev => ({ ...prev, storageBucket: value }))}
                placeholder="your-project.appspot.com"
              />
              
              <Text style={styles.modalLabel}>Messaging Sender ID</Text>
              <TextInput
                style={styles.modalInput}
                value={firebaseConfig.messagingSenderId}
                onChangeText={(value) => setFirebaseConfig(prev => ({ ...prev, messagingSenderId: value }))}
                placeholder="123456789"
                keyboardType="numeric"
              />
              
              <Text style={styles.modalLabel}>App ID</Text>
              <TextInput
                style={styles.modalInput}
                value={firebaseConfig.appId}
                onChangeText={(value) => setFirebaseConfig(prev => ({ ...prev, appId: value }))}
                placeholder="1:123456789:web:abcdef"
              />
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowFirebaseModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleFirebaseConfigSave}
              >
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.modalSaveText}>Save Config</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  projectSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    boxShadow: Platform.OS === 'web' ? '0px 2px 8px rgba(0, 0, 0, 0.05)' : undefined,
    elevation: Platform.OS === 'web' ? 3 : undefined,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  projectCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  projectStats: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  settingSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  settingList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: Platform.OS === 'web' ? '0px 1px 4px rgba(0, 0, 0, 0.05)' : undefined,
    elevation: Platform.OS === 'web' ? 2 : undefined,
  },
  settingItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#EBF4FF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeSettings: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    minWidth: 100,
  },
  configSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    boxShadow: Platform.OS === 'web' ? '0px 1px 4px rgba(0, 0, 0, 0.05)' : undefined,
    elevation: Platform.OS === 'web' ? 2 : undefined,
  },
  configStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  configProject: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  configButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  configButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  infoSection: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    boxShadow: Platform.OS === 'web' ? '0px 1px 4px rgba(0, 0, 0, 0.05)' : undefined,
    elevation: Platform.OS === 'web' ? 2 : undefined,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});