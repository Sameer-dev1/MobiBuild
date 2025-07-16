import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Copy, Download, FileText, Code as Code2, Check } from 'lucide-react-native';
import { useAppStore } from '../../store/AppStore';
import { copyToClipboard, downloadFile } from '../../utils/helpers';

export default function CodeViewer() {
  const { generateCode, exportProject, currentProject, components } = useAppStore();
  const [activeTab, setActiveTab] = useState('component');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!currentProject) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noProjectContainer}>
          <Code2 size={64} color="#9CA3AF" />
          <Text style={styles.noProjectTitle}>No Project Selected</Text>
          <Text style={styles.noProjectText}>
            Create or select a project to view and export the generated code.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const componentCode = generateCode();

  const packageJsonCode = `{
  "name": "${currentProject.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "react-native-web": "~0.19.6",
    "react-native-safe-area-context": "4.6.3",
    "expo-status-bar": "~1.6.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  }
}`;

  const firebaseCode = `// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "${currentProject.settings.firebaseConfig?.apiKey || 'your-api-key'}",
  authDomain: "${currentProject.settings.firebaseConfig?.authDomain || 'your-project.firebaseapp.com'}",
  projectId: "${currentProject.settings.firebaseConfig?.projectId || 'your-project-id'}",
  storageBucket: "${currentProject.settings.firebaseConfig?.storageBucket || 'your-project.appspot.com'}",
  messagingSenderId: "${currentProject.settings.firebaseConfig?.messagingSenderId || '123456789'}",
  appId: "${currentProject.settings.firebaseConfig?.appId || 'your-app-id'}"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);`;

  const tabs = [
    { key: 'component', title: 'App Component', icon: Code2 },
    { key: 'package', title: 'package.json', icon: FileText },
    { key: 'firebase', title: 'Firebase Config', icon: FileText },
  ];

  const getCodeContent = () => {
    switch (activeTab) {
      case 'component':
        return componentCode;
      case 'package':
        return packageJsonCode;
      case 'firebase':
        return firebaseCode;
      default:
        return componentCode;
    }
  };

  const getFileName = () => {
    switch (activeTab) {
      case 'component':
        return 'App.tsx';
      case 'package':
        return 'package.json';
      case 'firebase':
        return 'firebase.js';
      default:
        return 'App.tsx';
    }
  };

  const handleCopyToClipboard = () => {
    const content = getCodeContent();
    copyToClipboard(content);
    setCopiedTab(activeTab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownloadCode = () => {
    const content = getCodeContent();
    const filename = getFileName();
    downloadFile(content, filename, 'text/plain');
  };

  const handleExportProject = () => {
    exportProject();
  };

  const codeStats = {
    files: 3,
    lines: componentCode.split('\n').length + packageJsonCode.split('\n').length + firebaseCode.split('\n').length,
    size: Math.round((componentCode.length + packageJsonCode.length + firebaseCode.length) / 1024 * 10) / 10
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Generated Code</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopyToClipboard}>
            {copiedTab === activeTab ? (
              <Check size={18} color="#10B981" />
            ) : (
              <Copy size={18} color="#3B82F6" />
            )}
            <Text style={[styles.actionText, copiedTab === activeTab && { color: '#10B981' }]}>
              {copiedTab === activeTab ? 'Copied!' : 'Copy'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownloadCode}>
            <Download size={18} color="#8B5CF6" />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportProject}>
            <Download size={18} color="#FFFFFF" />
            <Text style={styles.exportButtonText}>Export All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <IconComponent 
                size={16} 
                color={activeTab === tab.key ? '#3B82F6' : '#6B7280'} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Code Display */}
      <ScrollView style={styles.codeContainer}>
        <View style={styles.codeWrapper}>
          <View style={styles.codeHeader}>
            <View style={styles.windowControls}>
              <View style={[styles.windowDot, { backgroundColor: '#EF4444' }]} />
              <View style={[styles.windowDot, { backgroundColor: '#F59E0B' }]} />
              <View style={[styles.windowDot, { backgroundColor: '#10B981' }]} />
            </View>
            <Text style={styles.filename}>{getFileName()}</Text>
          </View>
          <ScrollView horizontal style={styles.codeScroll}>
            <Text style={styles.codeText}>{getCodeContent()}</Text>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Code Information */}
      <View style={styles.infoPanel}>
        <Text style={styles.infoTitle}>Export Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoNumber}>{codeStats.files}</Text>
            <Text style={styles.infoLabel}>Files</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoNumber}>{codeStats.lines}</Text>
            <Text style={styles.infoLabel}>Lines</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoNumber}>{codeStats.size}KB</Text>
            <Text style={styles.infoLabel}>Size</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoNumber}>{components.length}</Text>
            <Text style={styles.infoLabel}>Components</Text>
          </View>
        </View>
        <Text style={styles.infoDescription}>
          Your React Native app "{currentProject.name}" is ready for export. The generated code includes all components, 
          styling, and Firebase configuration needed to run your mobile application.
        </Text>
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 6,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#3B82F6',
  },
  codeContainer: {
    flex: 1,
    padding: 20,
  },
  codeWrapper: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  codeHeader: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  windowControls: {
    flexDirection: 'row',
    marginRight: 16,
  },
  windowDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  filename: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  codeScroll: {
    maxHeight: 400,
  },
  codeText: {
    fontSize: 13,
    fontFamily: 'Courier',
    color: '#E5E7EB',
    padding: 20,
    lineHeight: 20,
  },
  infoPanel: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flex: 1,
  },
  infoNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});