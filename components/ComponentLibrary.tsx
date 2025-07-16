import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Type, Square, Image as ImageIcon, MousePointer, Layers, Navigation, Menu, Star, Play, MapPin, ChartBar as BarChart3, FileText, ToggleLeft, ChevronDown, MessageSquare, Grid3x3 as Grid3X3, Video as Sidebar, Plus, User, TrendingUp, Loader, Minus } from 'lucide-react-native';
import { useAppStore } from '../store/AppStore';
import { ComponentLibraryItem, ComponentType } from '../types/app';

export function ComponentLibrary() {
  const { addComponent, startDrag, currentPageId } = useAppStore();

  const componentLibrary: ComponentLibraryItem[] = [
    // Basic Components
    { 
      type: 'text', 
      name: 'Text', 
      icon: Type, 
      color: '#3B82F6', 
      category: 'basic', 
      defaultProps: {},
      description: 'Display text content'
    },
    { 
      type: 'button', 
      name: 'Button', 
      icon: MousePointer, 
      color: '#8B5CF6', 
      category: 'basic', 
      defaultProps: {},
      description: 'Interactive button element'
    },
    { 
      type: 'image', 
      name: 'Image', 
      icon: ImageIcon, 
      color: '#10B981', 
      category: 'basic', 
      defaultProps: {},
      description: 'Display images'
    },
    { 
      type: 'input', 
      name: 'Input', 
      icon: FileText, 
      color: '#F59E0B', 
      category: 'form', 
      defaultProps: {},
      description: 'Text input field'
    },
    { 
      type: 'icon', 
      name: 'Icon', 
      icon: Star, 
      color: '#EF4444', 
      category: 'basic', 
      defaultProps: {},
      description: 'Display icons'
    },

    // Layout Components
    { 
      type: 'view', 
      name: 'Container', 
      icon: Square, 
      color: '#6B7280', 
      category: 'layout', 
      defaultProps: {},
      description: 'Generic container'
    },
    { 
      type: 'card', 
      name: 'Card', 
      icon: Layers, 
      color: '#06B6D4', 
      category: 'layout', 
      defaultProps: {},
      description: 'Card container with shadow'
    },
    { 
      type: 'header', 
      name: 'Header', 
      icon: Menu, 
      color: '#7C3AED', 
      category: 'layout', 
      defaultProps: {},
      description: 'Page header component'
    },
    { 
      type: 'divider', 
      name: 'Divider', 
      icon: Minus, 
      color: '#9CA3AF', 
      category: 'layout', 
      defaultProps: {},
      description: 'Visual separator'
    },
    { 
      type: 'spacer', 
      name: 'Spacer', 
      icon: Plus, 
      color: '#D1D5DB', 
      category: 'layout', 
      defaultProps: {},
      description: 'Add spacing between elements'
    },

    // Navigation Components
    { 
      type: 'navigation', 
      name: 'Navigation', 
      icon: Navigation, 
      color: '#059669', 
      category: 'navigation', 
      defaultProps: {},
      description: 'Navigation menu'
    },
    { 
      type: 'tabs', 
      name: 'Tabs', 
      icon: Grid3X3, 
      color: '#0891B2', 
      category: 'navigation', 
      defaultProps: {},
      description: 'Tab navigation'
    },
    { 
      type: 'drawer', 
      name: 'Drawer', 
      icon: Sidebar, 
      color: '#7C2D12', 
      category: 'navigation', 
      defaultProps: {},
      description: 'Side drawer menu'
    },
    { 
      type: 'fab', 
      name: 'FAB', 
      icon: Plus, 
      color: '#DC2626', 
      category: 'navigation', 
      defaultProps: {},
      description: 'Floating action button'
    },

    // Form Components
    { 
      type: 'switch', 
      name: 'Switch', 
      icon: ToggleLeft, 
      color: '#16A34A', 
      category: 'form', 
      defaultProps: {},
      description: 'Toggle switch'
    },
    { 
      type: 'picker', 
      name: 'Picker', 
      icon: ChevronDown, 
      color: '#CA8A04', 
      category: 'form', 
      defaultProps: {},
      description: 'Selection picker'
    },
    { 
      type: 'slider', 
      name: 'Slider', 
      icon: TrendingUp, 
      color: '#9333EA', 
      category: 'form', 
      defaultProps: {},
      description: 'Range slider'
    },
    { 
      type: 'form', 
      name: 'Form', 
      icon: FileText, 
      color: '#0F766E', 
      category: 'form', 
      defaultProps: {},
      description: 'Form container'
    },

    // Media Components
    { 
      type: 'video', 
      name: 'Video', 
      icon: Play, 
      color: '#BE123C', 
      category: 'media', 
      defaultProps: {},
      description: 'Video player'
    },
    { 
      type: 'map', 
      name: 'Map', 
      icon: MapPin, 
      color: '#15803D', 
      category: 'media', 
      defaultProps: {},
      description: 'Interactive map'
    },

    // Data Components
    { 
      type: 'list', 
      name: 'List', 
      icon: Menu, 
      color: '#1D4ED8', 
      category: 'data', 
      defaultProps: {},
      description: 'Scrollable list'
    },
    { 
      type: 'chart', 
      name: 'Chart', 
      icon: BarChart3, 
      color: '#B91C1C', 
      category: 'data', 
      defaultProps: {},
      description: 'Data visualization'
    },

    // Feedback Components
    { 
      type: 'modal', 
      name: 'Modal', 
      icon: MessageSquare, 
      color: '#7C3AED', 
      category: 'feedback', 
      defaultProps: {},
      description: 'Modal dialog'
    },
    { 
      type: 'badge', 
      name: 'Badge', 
      icon: Star, 
      color: '#DC2626', 
      category: 'feedback', 
      defaultProps: {},
      description: 'Status badge'
    },
    { 
      type: 'avatar', 
      name: 'Avatar', 
      icon: User, 
      color: '#059669', 
      category: 'feedback', 
      defaultProps: {},
      description: 'User avatar'
    },
    { 
      type: 'progress', 
      name: 'Progress', 
      icon: TrendingUp, 
      color: '#0891B2', 
      category: 'feedback', 
      defaultProps: {},
      description: 'Progress indicator'
    },
    { 
      type: 'skeleton', 
      name: 'Skeleton', 
      icon: Loader, 
      color: '#6B7280', 
      category: 'feedback', 
      defaultProps: {},
      description: 'Loading skeleton'
    },
  ];

  const categories = [
    { key: 'basic', name: 'Basic', color: '#3B82F6' },
    { key: 'layout', name: 'Layout', color: '#8B5CF6' },
    { key: 'navigation', name: 'Navigation', color: '#10B981' },
    { key: 'form', name: 'Form', color: '#F59E0B' },
    { key: 'media', name: 'Media', color: '#EF4444' },
    { key: 'data', name: 'Data', color: '#06B6D4' },
    { key: 'feedback', name: 'Feedback', color: '#8B5CF6' },
  ];

  const [selectedCategory, setSelectedCategory] = React.useState<string>('basic');

  const filteredComponents = componentLibrary.filter(comp => comp.category === selectedCategory);

  const handleAddComponent = (type: ComponentType) => {
    if (currentPageId) {
      addComponent(type, currentPageId);
      Alert.alert(
        'Component Added!', 
        `${type.charAt(0).toUpperCase() + type.slice(1)} component has been added to your page.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'No Page Selected', 
        'Please create or select a page first before adding components.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDragStart = (component: ComponentLibraryItem) => {
    const dragComponent = {
      id: 'temp',
      type: component.type,
      name: component.name,
      props: component.defaultProps,
    };
    startDrag(dragComponent);
  };

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabs}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryTab,
              selectedCategory === category.key && styles.activeCategoryTab,
              { borderBottomColor: category.color }
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Text style={[
              styles.categoryTabText,
              selectedCategory === category.key && styles.activeCategoryTabText,
              { color: selectedCategory === category.key ? category.color : '#6B7280' }
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Components Grid */}
      <ScrollView style={styles.componentsScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.componentsGrid}>
          {filteredComponents.map((component) => {
            const IconComponent = component.icon;
            return (
              <TouchableOpacity
                key={component.type}
                style={styles.componentItem}
                onPress={() => handleAddComponent(component.type)}
                onLongPress={() => handleDragStart(component)}
                delayLongPress={500}
              >
                <View style={[styles.componentIcon, { backgroundColor: component.color + '15' }]}>
                  <IconComponent size={24} color={component.color} />
                </View>
                <Text style={styles.componentName}>{component.name}</Text>
                <Text style={styles.componentDescription} numberOfLines={2}>
                  {component.description}
                </Text>
                <View style={styles.componentActions}>
                  <Text style={styles.tapHint}>Tap to add</Text>
                  <Text style={styles.dragHint}>Hold to drag</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  categoryTabs: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeCategoryTab: {
    borderBottomWidth: 2,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeCategoryTabText: {
    fontWeight: '600',
  },
  componentsScroll: {
    flex: 1,
    padding: 16,
  },
  componentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  componentItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  componentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  componentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  componentDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 8,
  },
  componentActions: {
    alignItems: 'center',
  },
  tapHint: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '500',
  },
  dragHint: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
});