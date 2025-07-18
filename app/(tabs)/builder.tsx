import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Layers, 
  FileText, 
  Package, 
  Plug, 
  Menu,
  X,
  Eye,
  EyeOff,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw
} from 'lucide-react-native';
import { useAppStore } from '../../store/AppStore';
import { ComponentRenderer } from '../../components/ComponentRenderer';
import { PropertyEditor } from '../../components/PropertyEditor';
import { ComponentLibrary } from '../../components/ComponentLibrary';
import { PageManager } from '../../components/PageManager';
import { AuthenticationSetup } from '../../components/AuthenticationSetup';
import { DragDropBuilder } from '../../components/DragDropBuilder';
import DraggableFlatList from 'react-native-draggable-flatlist';

export default function Builder() {
  const {
    components,
    selectedComponentId,
    currentProject,
    currentPageId,
    pages,
    activePanel,
    sidebarCollapsed,
    isPreviewMode,
    deviceType,
    orientation,
    setActivePanel,
    setSidebarCollapsed,
    setPreviewMode,
    setDeviceType,
    setOrientation,
    selectComponent,
    saveProject
  } = useAppStore();

  const currentPage = pages.find(p => p.id === currentPageId);
  const pageComponents = components.filter(c => c.pageId === currentPageId);
  const selectedComponent = components.find(comp => comp.id === selectedComponentId);

  const sidebarPanels = [
    { key: 'components', name: 'Components', icon: Layers },
    { key: 'pages', name: 'Pages', icon: FileText },
    { key: 'assets', name: 'Assets', icon: Package },
    { key: 'integrations', name: 'Auth & APIs', icon: Plug },
  ];

  const devices = [
    { key: 'phone', name: 'Phone', icon: Smartphone },
    { key: 'tablet', name: 'Tablet', icon: Tablet },
    { key: 'desktop', name: 'Desktop', icon: Monitor },
  ];

  if (!currentProject) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noProjectContainer}>
          <Layers size={64} color="#9CA3AF" />
          <Text style={styles.noProjectTitle}>No Project Selected</Text>
          <Text style={styles.noProjectText}>
            Create or select a project from the Dashboard to start building your mobile app.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderSidebarContent = () => {
    switch (activePanel) {
      case 'components':
        return <ComponentLibrary />;
      case 'pages':
        return <PageManager />;
      case 'assets':
        return (
          <View style={styles.comingSoon}>
            <Package size={48} color="#9CA3AF" />
            <Text style={styles.comingSoonText}>Assets Manager</Text>
            <Text style={styles.comingSoonSubtext}>Coming soon</Text>
          </View>
        );
      case 'integrations':
        return <AuthenticationSetup />;
      default:
        return <ComponentLibrary />;
    }
  };

  // Handler for drag end
  const handleDragEnd = ({ data }: { data: typeof pageComponents }) => {
    // Update the order in the store
    const newOrderIds = data.map(c => c.id);
    const reordered = [
      ...components.filter(c => c.pageId !== currentPageId),
      ...data
    ];
    useAppStore.setState({ components: reordered });
  };

  return (
    <SafeAreaView style={styles.container}>
      <DragDropBuilder>
        <View style={styles.builderContainer}>
          {/* Top Toolbar */}
          <View style={styles.toolbar}>
            <View style={styles.toolbarLeft}>
              <TouchableOpacity
                style={styles.toolbarButton}
                onPress={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <Menu size={20} color="#6B7280" /> : <X size={20} color="#6B7280" />}
              </TouchableOpacity>
              
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{currentProject.name}</Text>
                <Text style={styles.currentPageName}>
                  {currentPage?.name || 'No page selected'}
                </Text>
              </View>
            </View>

            <View style={styles.toolbarCenter}>
              {/* Device Selector */}
              <View style={styles.deviceSelector}>
                {devices.map((device) => {
                  const IconComponent = device.icon;
                  return (
                    <TouchableOpacity
                      key={device.key}
                      style={[
                        styles.deviceButton,
                        deviceType === device.key && styles.activeDeviceButton,
                      ]}
                      onPress={() => setDeviceType(device.key as any)}
                    >
                      <IconComponent
                        size={18}
                        color={deviceType === device.key ? '#3B82F6' : '#6B7280'}
                      />
                    </TouchableOpacity>
                  );
                })}
                
                <TouchableOpacity
                  style={styles.deviceButton}
                  onPress={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
                >
                  <RotateCcw size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.toolbarRight}>
              <TouchableOpacity
                style={[styles.toolbarButton, isPreviewMode && styles.activeToolbarButton]}
                onPress={() => setPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? <EyeOff size={20} color="#3B82F6" /> : <Eye size={20} color="#6B7280" />}
                <Text style={[
                  styles.toolbarButtonText,
                  isPreviewMode && styles.activeToolbarButtonText
                ]}>
                  {isPreviewMode ? 'Edit' : 'Preview'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveButton} onPress={saveProject}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mainContent}>
            {/* Left Sidebar */}
            {!sidebarCollapsed && (
              <View style={styles.sidebar}>
                {/* Sidebar Tabs */}
                <View style={styles.sidebarTabs}>
                  {sidebarPanels.map((panel) => {
                    const IconComponent = panel.icon;
                    return (
                      <TouchableOpacity
                        key={panel.key}
                        style={[
                          styles.sidebarTab,
                          activePanel === panel.key && styles.activeSidebarTab,
                        ]}
                        onPress={() => setActivePanel(panel.key as any)}
                      >
                        <IconComponent
                          size={20}
                          color={activePanel === panel.key ? '#3B82F6' : '#6B7280'}
                        />
                        <Text style={[
                          styles.sidebarTabText,
                          activePanel === panel.key && styles.activeSidebarTabText,
                        ]}>
                          {panel.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Sidebar Content */}
                <View style={styles.sidebarContent}>
                  {renderSidebarContent()}
                </View>
              </View>
            )}

            {/* Canvas */}
            <View style={styles.canvas}>
              <View style={styles.canvasHeader}>
                <Text style={styles.canvasTitle}>
                  {currentPage?.name || 'Select a page'}
                </Text>
                <View style={styles.canvasInfo}>
                  <Text style={styles.canvasInfoText}>
                    {pageComponents.length} component{pageComponents.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              <ScrollView style={styles.canvasContent} contentContainerStyle={styles.canvasScrollContent}>
                <View style={[
                  styles.deviceFrame,
                  deviceType === 'phone' && styles.phoneFrame,
                  deviceType === 'tablet' && styles.tabletFrame,
                  deviceType === 'desktop' && styles.desktopFrame,
                  orientation === 'landscape' && styles.landscapeFrame,
                  { flex: 1 },
                ]}>
                  {currentPage ? (
                    <>
                      <DraggableFlatList
                        data={pageComponents}
                        keyExtractor={item => item.id}
                        renderItem={({ item, drag, isActive }) => (
                          <View
                            style={{
                              opacity: isActive ? 0.7 : 1,
                              transform: [{ scale: isActive ? 1.05 : 1 }],
                              borderWidth: isActive ? 2 : 0,
                              borderColor: isActive ? '#3B82F6' : 'transparent',
                              backgroundColor: isActive ? '#E0E7FF' : '#FFF',
                              marginBottom: 12,
                              borderRadius: 8,
                              position: 'relative',
                              ...(Platform.OS === 'web' && isActive
                                ? { boxShadow: '0 4px 16px rgba(59,130,246,0.2)' }
                                : {}),
                            }}
                            accessible
                            accessibilityLabel={`Component ${item.name}`}
                            accessibilityHint="Long press and drag to reorder"
                          >
                            <ComponentRenderer
                              component={item}
                              isSelected={selectedComponentId === item.id && !isPreviewMode}
                              onPress={() => !isPreviewMode && selectComponent(item.id)}
                              onLongPress={drag}
                            />
                            {isActive && (
                              <Text style={{
                                position: 'absolute',
                                top: 4,
                                right: 8,
                                color: '#3B82F6',
                                fontWeight: 'bold',
                                fontSize: 12,
                                backgroundColor: '#FFF',
                                paddingHorizontal: 6,
                                borderRadius: 4,
                                zIndex: 10,
                                borderWidth: 1,
                                borderColor: '#3B82F6',
                              }}>
                                Dragging...
                              </Text>
                            )}
                          </View>
                        )}
                        onDragEnd={handleDragEnd}
                        activationDistance={10}
                        containerStyle={{ flexGrow: 1 }}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        renderPlaceholder={({ item, index }) => (
                          <View
                            style={{
                              height: 60,
                              backgroundColor: '#DBEAFE',
                              borderWidth: 2,
                              borderColor: '#3B82F6',
                              borderRadius: 8,
                              marginBottom: 12,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ color: '#3B82F6', fontWeight: 'bold' }}>Drop here</Text>
                          </View>
                        )}
                        style={{ flex: 1 }}
                      />
                      {pageComponents.length === 0 && !isPreviewMode && (
                        <View style={styles.emptyCanvas}>
                          <Layers size={48} color="#9CA3AF" />
                          <Text style={styles.emptyText}>Start building your page</Text>
                          <Text style={styles.emptySubtext}>
                            Add components from the sidebar to create your app
                          </Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.emptyCanvas}>
                      <FileText size={48} color="#9CA3AF" />
                      <Text style={styles.emptyText}>No page selected</Text>
                      <Text style={styles.emptySubtext}>
                        Create or select a page to start building
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>

            {/* Right Properties Panel */}
            {!isPreviewMode && (
              <View style={styles.propertiesPanel}>
                <View style={styles.propertiesPanelHeader}>
                  <Text style={styles.propertiesPanelTitle}>Properties</Text>
                </View>
                
                <View style={styles.propertiesPanelContent}>
                  {selectedComponent ? (
                    <PropertyEditor component={selectedComponent} />
                  ) : (
                    <View style={styles.noSelection}>
                      <Text style={styles.noSelectionText}>
                        Select a component to edit its properties
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </DragDropBuilder>
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
  builderContainer: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toolbarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  activeToolbarButton: {
    backgroundColor: '#EBF4FF',
  },
  toolbarButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  activeToolbarButtonText: {
    color: '#3B82F6',
  },
  projectInfo: {
    marginLeft: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  currentPageName: {
    fontSize: 12,
    color: '#6B7280',
  },
  deviceSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  deviceButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 2,
  },
  activeDeviceButton: {
    backgroundColor: '#FFFFFF',
    boxShadow: Platform.OS === 'web' ? '0px 1px 2px rgba(0, 0, 0, 0.1)' : undefined,
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  sidebarTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sidebarTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeSidebarTab: {
    borderBottomColor: '#3B82F6',
  },
  sidebarTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  activeSidebarTabText: {
    color: '#3B82F6',
  },
  sidebarContent: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  canvasHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  canvasTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  canvasInfo: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  canvasInfoText: {
    fontSize: 12,
    color: '#6B7280',
  },
  canvasContent: {
    flex: 1,
  },
  canvasScrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  deviceFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    minHeight: 600,
    boxShadow: Platform.OS === 'web' ? '0px 8px 20px rgba(0, 0, 0, 0.15)' : undefined,
  },
  phoneFrame: {
    width: 375,
    maxWidth: '100%',
  },
  tabletFrame: {
    width: 768,
    maxWidth: '100%',
  },
  desktopFrame: {
    width: 1024,
    maxWidth: '100%',
  },
  landscapeFrame: {
    // Swap width/height for landscape
  },
  emptyCanvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 300,
  },
  propertiesPanel: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },
  propertiesPanelHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  propertiesPanelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  propertiesPanelContent: {
    flex: 1,
    padding: 20,
  },
  noSelection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noSelectionText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});