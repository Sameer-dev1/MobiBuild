import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Switch, Alert } from 'react-native';
import { Component } from '../types/app';
import { useAppStore } from '../store/AppStore';
import { Star, User, Play, MapPin, BarChart3, Menu, Plus } from 'lucide-react-native';

interface ComponentRendererProps {
  component: Component;
  isSelected?: boolean;
  onPress?: () => void;
}

export function ComponentRenderer({ component, isSelected, onPress }: ComponentRendererProps) {
  const { updateComponent } = useAppStore();

  const handleInputChange = (value: string) => {
    updateComponent(component.id, {
      props: { ...component.props, value }
    });
  };

  const handleButtonPress = () => {
    Alert.alert(
      'Button Pressed!', 
      `You pressed the "${component.props.title || 'Button'}" button.`,
      [{ text: 'OK' }]
    );
  };

  const handleSwitchChange = (value: boolean) => {
    updateComponent(component.id, {
      props: { ...component.props, value }
    });
    Alert.alert(
      'Switch Toggled!', 
      `Switch is now ${value ? 'ON' : 'OFF'}`,
      [{ text: 'OK' }]
    );
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'text':
        return (
          <Text style={[styles.text, component.props.style, { 
            color: component.props.color || '#1F2937', 
            fontSize: component.props.fontSize || 16 
          }]}>
            {component.props.text || 'Sample Text'}
          </Text>
        );

      case 'button':
        return (
          <TouchableOpacity
            style={[
              styles.button,
              component.props.style,
              { backgroundColor: component.props.backgroundColor || '#3B82F6' }
            ]}
            onPress={handleButtonPress}
          >
            <Text style={[styles.buttonText, { color: component.props.color || '#FFFFFF' }]}>
              {component.props.title || 'Button'}
            </Text>
          </TouchableOpacity>
        );

      case 'image':
        return (
          <Image
            source={{ uri: component.props.source || 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={[styles.image, component.props.style]}
            resizeMode="cover"
          />
        );

      case 'input':
        return (
          <TextInput
            placeholder={component.props.placeholder || 'Enter text...'}
            value={component.props.value || ''}
            onChangeText={handleInputChange}
            style={[styles.input, component.props.style]}
          />
        );

      case 'view':
        return (
          <View style={[
            styles.view, 
            component.props.style, 
            { backgroundColor: component.props.backgroundColor || '#F3F4F6' }
          ]}>
            <Text style={styles.viewText}>Container: {component.name}</Text>
          </View>
        );

      case 'card':
        return (
          <View style={[styles.card, component.props.style]}>
            <Text style={styles.cardTitle}>{component.props.title || 'Card Title'}</Text>
            <Text style={styles.cardContent}>{component.props.content || 'Card content goes here...'}</Text>
          </View>
        );

      case 'switch':
        return (
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{component.props.label || 'Toggle Switch'}</Text>
            <Switch
              value={component.props.value || false}
              onValueChange={handleSwitchChange}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        );

      case 'icon':
        return (
          <View style={[styles.iconContainer, component.props.style]}>
            <Star size={component.props.size || 24} color={component.props.color || '#3B82F6'} />
          </View>
        );

      case 'avatar':
        return (
          <View style={[styles.avatar, component.props.style]}>
            <User size={24} color="#FFFFFF" />
          </View>
        );

      case 'badge':
        return (
          <View style={[styles.badge, { backgroundColor: component.props.backgroundColor || '#EF4444' }]}>
            <Text style={[styles.badgeText, { color: component.props.color || '#FFFFFF' }]}>
              {component.props.text || 'Badge'}
            </Text>
          </View>
        );

      case 'divider':
        return (
          <View style={[styles.divider, component.props.style]} />
        );

      case 'spacer':
        return (
          <View style={[styles.spacer, { height: component.props.height || 20 }]} />
        );

      case 'header':
        return (
          <View style={[styles.header, component.props.style]}>
            <Text style={styles.headerTitle}>{component.props.title || 'Header Title'}</Text>
          </View>
        );

      case 'fab':
        return (
          <TouchableOpacity 
            style={[styles.fab, component.props.style]}
            onPress={() => Alert.alert('FAB Pressed!', 'Floating Action Button was pressed.')}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        );

      case 'progress':
        return (
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>{component.props.label || 'Progress'}</Text>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill, 
                { width: `${component.props.value || 50}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>{component.props.value || 50}%</Text>
          </View>
        );

      case 'list':
        return (
          <View style={[styles.list, component.props.style]}>
            <Text style={styles.listTitle}>{component.props.title || 'List Component'}</Text>
            {['Item 1', 'Item 2', 'Item 3'].map((item, index) => (
              <TouchableOpacity key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'navigation':
        return (
          <View style={[styles.navigation, component.props.style]}>
            <Text style={styles.navTitle}>Navigation Menu</Text>
            <View style={styles.navItems}>
              {['Home', 'About', 'Contact'].map((item, index) => (
                <TouchableOpacity key={index} style={styles.navItem}>
                  <Text style={styles.navItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'tabs':
        return (
          <View style={[styles.tabs, component.props.style]}>
            <View style={styles.tabHeaders}>
              {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, index) => (
                <TouchableOpacity key={index} style={[styles.tabHeader, index === 0 && styles.activeTab]}>
                  <Text style={[styles.tabHeaderText, index === 0 && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.tabContent}>
              <Text style={styles.tabContentText}>Tab 1 Content</Text>
            </View>
          </View>
        );

      default:
        return (
          <Text style={styles.unknownComponent}>
            Unknown component: {component.type}
          </Text>
        );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.componentWrapper,
        isSelected && styles.selectedComponent,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {renderComponent()}
      {isSelected && (
        <View style={styles.selectionIndicator}>
          <Text style={styles.selectionText}>Selected</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  componentWrapper: {
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 4,
    position: 'relative',
  },
  selectedComponent: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  selectionIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    color: '#1F2937',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  view: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 60,
  },
  viewText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  iconContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  spacer: {
    width: '100%',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  progressContainer: {
    paddingVertical: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'right',
  },
  list: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  listItemText: {
    fontSize: 14,
    color: '#1F2937',
  },
  navigation: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  navItems: {
    flexDirection: 'row',
    gap: 16,
  },
  navItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  navItemText: {
    fontSize: 14,
    color: '#1F2937',
  },
  tabs: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabHeaders: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabHeader: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabHeaderText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  tabContentText: {
    fontSize: 14,
    color: '#1F2937',
  },
  unknownComponent: {
    fontSize: 14,
    color: '#EF4444',
    fontStyle: 'italic',
  },
});