import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal } from 'react-native';
import { Plus, FileText, Copy, Trash2, CreditCard as Edit3, Chrome as Home, Settings, User, ShoppingCart, MessageCircle, Bell, Search, Heart, Camera, Map } from 'lucide-react-native';
import { useAppStore } from '../store/AppStore';
import { Page } from '../types/app';

export function PageManager() {
  const { 
    pages, 
    currentPageId, 
    createPage, 
    updatePage, 
    deletePage, 
    duplicatePage, 
    setCurrentPage,
    reorderPages 
  } = useAppStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [pageName, setPageName] = useState('');
  const [pageRoute, setPageRoute] = useState('');
  const [pageLayout, setPageLayout] = useState<'stack' | 'scroll' | 'fixed'>('scroll');

  const pageIcons = [
    { name: 'home', icon: Home, color: '#3B82F6' },
    { name: 'profile', icon: User, color: '#8B5CF6' },
    { name: 'settings', icon: Settings, color: '#6B7280' },
    { name: 'shop', icon: ShoppingCart, color: '#10B981' },
    { name: 'chat', icon: MessageCircle, color: '#F59E0B' },
    { name: 'notifications', icon: Bell, color: '#EF4444' },
    { name: 'search', icon: Search, color: '#06B6D4' },
    { name: 'favorites', icon: Heart, color: '#EC4899' },
    { name: 'camera', icon: Camera, color: '#7C3AED' },
    { name: 'map', icon: Map, color: '#059669' },
  ];

  const handleCreatePage = () => {
    if (pageName.trim() && pageRoute.trim()) {
      createPage(pageName.trim(), pageRoute.trim(), pageLayout);
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdatePage = () => {
    if (editingPage && pageName.trim()) {
      updatePage(editingPage.id, {
        name: pageName.trim(),
        route: pageRoute.trim(),
        layout: pageLayout,
      });
      setEditingPage(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setPageName('');
    setPageRoute('');
    setPageLayout('scroll');
  };

  const openEditModal = (page: Page) => {
    setEditingPage(page);
    setPageName(page.name);
    setPageRoute(page.route);
    setPageLayout(page.layout);
  };

  const getPageIcon = (pageName: string) => {
    const iconData = pageIcons.find(icon => 
      pageName.toLowerCase().includes(icon.name) || 
      icon.name === 'home'
    ) || pageIcons[0];
    
    const IconComponent = iconData.icon;
    return <IconComponent size={20} color={iconData.color} />;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pages</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Pages List */}
      <ScrollView style={styles.pagesList} showsVerticalScrollIndicator={false}>
        {pages.map((page, index) => (
          <TouchableOpacity
            key={page.id}
            style={[
              styles.pageItem,
              currentPageId === page.id && styles.activePageItem,
            ]}
            onPress={() => setCurrentPage(page.id)}
          >
            <View style={styles.pageIcon}>
              {getPageIcon(page.name)}
            </View>
            
            <View style={styles.pageInfo}>
              <Text style={[
                styles.pageName,
                currentPageId === page.id && styles.activePageName,
              ]}>
                {page.name}
              </Text>
              <Text style={styles.pageRoute}>{page.route}</Text>
              <View style={styles.pageMetadata}>
                <Text style={styles.pageLayout}>{page.layout}</Text>
                {page.isHomePage && (
                  <View style={styles.homePageBadge}>
                    <Text style={styles.homePageBadgeText}>Home</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.pageActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openEditModal(page)}
              >
                <Edit3 size={16} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => duplicatePage(page.id)}
              >
                <Copy size={16} color="#6B7280" />
              </TouchableOpacity>
              {!page.isHomePage && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => deletePage(page.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {pages.length === 0 && (
          <View style={styles.emptyState}>
            <FileText size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No pages yet</Text>
            <Text style={styles.emptyStateSubtext}>Create your first page to get started</Text>
          </View>
        )}
      </ScrollView>

      {/* Create/Edit Page Modal */}
      <Modal
        visible={showCreateModal || editingPage !== null}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowCreateModal(false);
          setEditingPage(null);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingPage ? 'Edit Page' : 'Create New Page'}
            </Text>
            
            <Text style={styles.modalLabel}>Page Name</Text>
            <TextInput
              style={styles.modalInput}
              value={pageName}
              onChangeText={setPageName}
              placeholder="Home, Profile, Settings..."
              autoFocus
            />
            
            <Text style={styles.modalLabel}>Route Path</Text>
            <TextInput
              style={styles.modalInput}
              value={pageRoute}
              onChangeText={setPageRoute}
              placeholder="/home, /profile, /settings..."
            />
            
            <Text style={styles.modalLabel}>Layout Type</Text>
            <View style={styles.layoutOptions}>
              {[
                { key: 'scroll', name: 'Scrollable', description: 'Vertical scrolling content' },
                { key: 'stack', name: 'Stack', description: 'Fixed positioned elements' },
                { key: 'fixed', name: 'Fixed', description: 'No scrolling, fixed layout' },
              ].map((layout) => (
                <TouchableOpacity
                  key={layout.key}
                  style={[
                    styles.layoutOption,
                    pageLayout === layout.key && styles.activeLayoutOption,
                  ]}
                  onPress={() => setPageLayout(layout.key as any)}
                >
                  <Text style={[
                    styles.layoutOptionName,
                    pageLayout === layout.key && styles.activeLayoutOptionText,
                  ]}>
                    {layout.name}
                  </Text>
                  <Text style={styles.layoutOptionDescription}>
                    {layout.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowCreateModal(false);
                  setEditingPage(null);
                  resetForm();
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalCreateButton,
                  (!pageName.trim() || !pageRoute.trim()) && styles.modalCreateButtonDisabled
                ]}
                onPress={editingPage ? handleUpdatePage : handleCreatePage}
                disabled={!pageName.trim() || !pageRoute.trim()}
              >
                <Text style={styles.modalCreateText}>
                  {editingPage ? 'Update Page' : 'Create Page'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagesList: {
    flex: 1,
    padding: 16,
  },
  pageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activePageItem: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  pageIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pageInfo: {
    flex: 1,
  },
  pageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activePageName: {
    color: '#3B82F6',
  },
  pageRoute: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  pageMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageLayout: {
    fontSize: 12,
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  homePageBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  homePageBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
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
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
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
  layoutOptions: {
    marginTop: 8,
  },
  layoutOption: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  activeLayoutOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  layoutOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activeLayoutOptionText: {
    color: '#3B82F6',
  },
  layoutOptionDescription: {
    fontSize: 12,
    color: '#6B7280',
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
  modalCreateButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  modalCreateButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  modalCreateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});