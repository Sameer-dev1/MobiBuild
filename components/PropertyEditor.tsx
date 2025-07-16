import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { Component } from '../types/app';
import { useAppStore } from '../store/AppStore';
import { Palette, Type, Image as ImageIcon, Settings } from 'lucide-react-native';

interface PropertyEditorProps {
  component: Component;
}

export function PropertyEditor({ component }: PropertyEditorProps) {
  const { updateComponent } = useAppStore();
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');

  const updateProp = (key: string, value: any) => {
    updateComponent(component.id, {
      props: { ...component.props, [key]: value }
    });
  };

  const updateStyle = (key: string, value: any) => {
    updateComponent(component.id, {
      props: {
        ...component.props,
        style: { ...component.props.style, [key]: value }
      }
    });
  };

  const renderContentTab = () => {
    switch (component.type) {
      case 'text':
        return (
          <View>
            <Text style={styles.label}>Text Content</Text>
            <TextInput
              style={styles.input}
              value={component.props.text}
              onChangeText={(value) => updateProp('text', value)}
              placeholder="Enter text..."
              multiline
            />
            <Text style={styles.label}>Font Size</Text>
            <TextInput
              style={styles.input}
              value={component.props.fontSize?.toString()}
              onChangeText={(value) => updateProp('fontSize', parseInt(value) || 16)}
              placeholder="16"
              keyboardType="numeric"
            />
            <Text style={styles.label}>Text Color</Text>
            <TextInput
              style={styles.input}
              value={component.props.color}
              onChangeText={(value) => updateProp('color', value)}
              placeholder="#1F2937"
            />
          </View>
        );

      case 'button':
        return (
          <View>
            <Text style={styles.label}>Button Text</Text>
            <TextInput
              style={styles.input}
              value={component.props.title}
              onChangeText={(value) => updateProp('title', value)}
              placeholder="Button"
            />
            <Text style={styles.label}>Background Color</Text>
            <TextInput
              style={styles.input}
              value={component.props.backgroundColor}
              onChangeText={(value) => updateProp('backgroundColor', value)}
              placeholder="#3B82F6"
            />
            <Text style={styles.label}>Text Color</Text>
            <TextInput
              style={styles.input}
              value={component.props.color}
              onChangeText={(value) => updateProp('color', value)}
              placeholder="#FFFFFF"
            />
          </View>
        );

      case 'image':
        return (
          <View>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={component.props.source}
              onChangeText={(value) => updateProp('source', value)}
              placeholder="https://example.com/image.jpg"
              multiline
            />
            <TouchableOpacity
              style={styles.presetButton}
              onPress={() => updateProp('source', 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400')}
            >
              <Text style={styles.presetButtonText}>Use Sample Image</Text>
            </TouchableOpacity>
          </View>
        );

      case 'input':
        return (
          <View>
            <Text style={styles.label}>Placeholder Text</Text>
            <TextInput
              style={styles.input}
              value={component.props.placeholder}
              onChangeText={(value) => updateProp('placeholder', value)}
              placeholder="Enter placeholder..."
            />
          </View>
        );

      case 'card':
        return (
          <View>
            <Text style={styles.label}>Card Title</Text>
            <TextInput
              style={styles.input}
              value={component.props.title}
              onChangeText={(value) => updateProp('title', value)}
              placeholder="Card Title"
            />
            <Text style={styles.label}>Card Content</Text>
            <TextInput
              style={styles.input}
              value={component.props.content}
              onChangeText={(value) => updateProp('content', value)}
              placeholder="Card content..."
              multiline
            />
          </View>
        );

      default:
        return (
          <Text style={styles.noProperties}>No content properties available for this component.</Text>
        );
    }
  };

  const renderStyleTab = () => {
    const style = component.props.style || {};
    
    return (
      <View>
        <Text style={styles.sectionTitle}>Spacing</Text>
        
        <Text style={styles.label}>Margin Bottom</Text>
        <TextInput
          style={styles.input}
          value={style.marginBottom?.toString()}
          onChangeText={(value) => updateStyle('marginBottom', parseInt(value) || 0)}
          placeholder="10"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Padding</Text>
        <TextInput
          style={styles.input}
          value={style.padding?.toString()}
          onChangeText={(value) => updateStyle('padding', parseInt(value) || 0)}
          placeholder="0"
          keyboardType="numeric"
        />

        <Text style={styles.sectionTitle}>Border</Text>
        
        <Text style={styles.label}>Border Radius</Text>
        <TextInput
          style={styles.input}
          value={style.borderRadius?.toString()}
          onChangeText={(value) => updateStyle('borderRadius', parseInt(value) || 0)}
          placeholder="8"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Border Width</Text>
        <TextInput
          style={styles.input}
          value={style.borderWidth?.toString()}
          onChangeText={(value) => updateStyle('borderWidth', parseInt(value) || 0)}
          placeholder="0"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Border Color</Text>
        <TextInput
          style={styles.input}
          value={style.borderColor}
          onChangeText={(value) => updateStyle('borderColor', value)}
          placeholder="#D1D5DB"
        />

        {component.type === 'view' && (
          <>
            <Text style={styles.sectionTitle}>Background</Text>
            <Text style={styles.label}>Background Color</Text>
            <TextInput
              style={styles.input}
              value={component.props.backgroundColor}
              onChangeText={(value) => updateProp('backgroundColor', value)}
              placeholder="#F3F4F6"
            />
          </>
        )}
      </View>
    );
  };

  const renderAdvancedTab = () => {
    return (
      <View>
        <Text style={styles.label}>Component Name</Text>
        <TextInput
          style={styles.input}
          value={component.name}
          onChangeText={(value) => updateComponent(component.id, { name: value })}
          placeholder="Component name"
        />

        <Text style={styles.label}>Component ID</Text>
        <Text style={styles.readOnlyValue}>{component.id}</Text>

        <Text style={styles.label}>Component Type</Text>
        <Text style={styles.readOnlyValue}>{component.type}</Text>
      </View>
    );
  };

  const tabs = [
    { key: 'content', title: 'Content', icon: Type },
    { key: 'style', title: 'Style', icon: Palette },
    { key: 'advanced', title: 'Advanced', icon: Settings },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Properties: {component.name}</Text>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key as any)}
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

      {/* Tab Content */}
      <ScrollView style={styles.tabContent}>
        {activeTab === 'content' && renderContentTab()}
        {activeTab === 'style' && renderStyleTab()}
        {activeTab === 'advanced' && renderAdvancedTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: 16,
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
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  readOnlyValue: {
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  presetButton: {
    backgroundColor: '#EBF4FF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  noProperties: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});