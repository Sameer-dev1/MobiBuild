import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Component, Project, ProjectSettings, Page, NavigationStructure, AuthenticationConfig, Integration, AppTheme, Template, User, ComponentType } from '../types/app';
import { generateId } from '../utils/helpers';

interface AppState {
  // User & Authentication
  user: User | null;
  isAuthenticated: boolean;
  
  // Current project
  currentProject: Project | null;
  
  // Pages
  pages: Page[];
  currentPageId: string | null;
  
  // Components
  components: Component[];
  selectedComponentId: string | null;
  draggedComponent: Component | null;
  
  // UI State
  isPreviewMode: boolean;
  deviceType: 'phone' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  sidebarCollapsed: boolean;
  activePanel: 'components' | 'pages' | 'assets' | 'integrations';
  
  // Templates
  templates: Template[];
  
  // Drag & Drop
  isDragging: boolean;
  dropZones: any[];
  
  // Actions - Authentication
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  
  // Actions - Project Management
  createProject: (name: string, description: string, template?: Template) => void;
  loadProject: (project: Project) => void;
  saveProject: () => void;
  deleteProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => void;
  
  // Actions - Page Management
  createPage: (name: string, route: string, layout?: 'stack' | 'scroll' | 'fixed') => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  deletePage: (pageId: string) => void;
  duplicatePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  reorderPages: (pageIds: string[]) => void;
  
  // Actions - Component Management
  addComponent: (type: ComponentType, pageId?: string, parentId?: string, position?: { x: number; y: number }) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  removeComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  moveComponent: (id: string, newParentId?: string, newPageId?: string, newPosition?: { x: number; y: number }) => void;
  selectComponent: (id: string | null) => void;
  
  // Actions - Drag & Drop
  startDrag: (component: Component) => void;
  endDrag: () => void;
  handleDrop: (targetId: string, position: { x: number; y: number }) => void;
  
  // Actions - UI State
  setPreviewMode: (enabled: boolean) => void;
  setDeviceType: (type: 'phone' | 'tablet' | 'desktop') => void;
  setOrientation: (orientation: 'portrait' | 'landscape') => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActivePanel: (panel: 'components' | 'pages' | 'assets' | 'integrations') => void;
  
  // Actions - Settings & Configuration
  updateProjectSettings: (settings: Partial<ProjectSettings>) => void;
  updateNavigation: (navigation: Partial<NavigationStructure>) => void;
  updateAuthentication: (auth: Partial<AuthenticationConfig>) => void;
  updateIntegrations: (integrations: Integration[]) => void;
  updateTheme: (theme: Partial<AppTheme>) => void;
  
  // Actions - Code Generation & Export
  generateCode: () => string;
  generatePageCode: (pageId: string) => string;
  exportProject: () => void;
  exportToExpo: () => void;
  
  // Actions - Templates
  loadTemplates: () => void;
  createTemplate: (name: string, description: string) => void;
  
  // Actions - Collaboration
  shareProject: (projectId: string, permissions: 'view' | 'edit') => string;
  importProject: (projectData: any) => void;
}

const defaultTheme: AppTheme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
  },
  typography: {
    fontFamily: 'Inter',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    weights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 12,
    },
  },
};

const defaultProjectSettings: ProjectSettings = {
  theme: 'light',
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  fontFamily: 'Inter',
  permissions: ['camera', 'location', 'notifications'],
  buildSettings: {
    bundleId: 'com.example.app',
    version: '1.0.0',
    buildNumber: 1,
    orientation: 'portrait',
    platforms: ['ios', 'android', 'web'],
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      currentProject: null,
      pages: [],
      currentPageId: null,
      components: [],
      selectedComponentId: null,
      draggedComponent: null,
      isPreviewMode: false,
      deviceType: 'phone',
      orientation: 'portrait',
      sidebarCollapsed: false,
      activePanel: 'components',
      templates: [],
      isDragging: false,
      dropZones: [],

      // Authentication Actions
      login: async (email: string, password: string) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: generateId(),
            email,
            name: email.split('@')[0],
            subscription: 'free',
            projects: [],
            createdAt: new Date(),
            lastLoginAt: new Date(),
          };
          
          set({ user, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      signup: async (email: string, password: string, name: string) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: generateId(),
            email,
            name,
            subscription: 'free',
            projects: [],
            createdAt: new Date(),
            lastLoginAt: new Date(),
          };
          
          set({ user, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Signup failed:', error);
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, currentProject: null });
      },

      // Project Management
      createProject: (name: string, description: string, template?: Template) => {
        const project: Project = {
          id: generateId(),
          name,
          description,
          pages: template?.pages || [createDefaultPage()],
          components: template?.components || [],
          createdAt: new Date(),
          updatedAt: new Date(),
          settings: template?.settings || defaultProjectSettings,
          navigation: {
            type: 'tabs',
            screens: [
              { name: 'Home', pageId: 'home', icon: 'home', title: 'Home' }
            ],
          },
          integrations: [],
          theme: template?.theme || defaultTheme,
        };
        
        set({
          currentProject: project,
          pages: project.pages,
          components: project.components,
          currentPageId: project.pages[0]?.id || null,
          selectedComponentId: null,
        });
      },

      loadProject: (project: Project) => {
        set({
          currentProject: project,
          pages: project.pages,
          components: project.components,
          currentPageId: project.pages[0]?.id || null,
          selectedComponentId: null,
        });
      },

      saveProject: () => {
        const { currentProject, pages, components } = get();
        if (currentProject) {
          const updatedProject = {
            ...currentProject,
            pages,
            components,
            updatedAt: new Date(),
          };
          
          set({ currentProject: updatedProject });
        }
      },

      deleteProject: (projectId: string) => {
        // Implementation for deleting project
        console.log('Deleting project:', projectId);
      },

      duplicateProject: (projectId: string) => {
        // Implementation for duplicating project
        console.log('Duplicating project:', projectId);
      },

      // Page Management
      createPage: (name: string, route: string, layout = 'scroll') => {
        const { pages } = get();
        const newPage: Page = {
          id: generateId(),
          name,
          route,
          components: [],
          layout,
          backgroundColor: '#FFFFFF',
          statusBarStyle: 'dark',
          headerShown: true,
          tabBarVisible: true,
          isHomePage: pages.length === 0,
        };

        set({
          pages: [...pages, newPage],
          currentPageId: newPage.id,
        });
      },

      updatePage: (pageId: string, updates: Partial<Page>) => {
        const { pages } = get();
        const updatedPages = pages.map(page =>
          page.id === pageId ? { ...page, ...updates } : page
        );
        
        set({ pages: updatedPages });
      },

      deletePage: (pageId: string) => {
        const { pages, currentPageId, components } = get();
        if (pages.length <= 1) return; // Don't delete the last page
        
        const updatedPages = pages.filter(page => page.id !== pageId);
        const updatedComponents = components.filter(comp => comp.pageId !== pageId);
        
        set({
          pages: updatedPages,
          components: updatedComponents,
          currentPageId: currentPageId === pageId ? (updatedPages[0]?.id || null) : currentPageId,
        });
      },

      duplicatePage: (pageId: string) => {
        const { pages, components } = get();
        const page = pages.find(p => p.id === pageId);
        const pageComponents = components.filter(c => c.pageId === pageId);
        
        if (page) {
          const newPageId = generateId();
          const duplicatedPage: Page = {
            ...page,
            id: newPageId,
            name: `${page.name} Copy`,
            route: `${page.route}-copy`,
            isHomePage: false,
          };
          
          const duplicatedComponents = pageComponents.map(comp => ({
            ...comp,
            id: generateId(),
            pageId: newPageId,
          }));
          
          set({
            pages: [...pages, duplicatedPage],
            components: [...components, ...duplicatedComponents],
            currentPageId: newPageId,
          });
        }
      },

      setCurrentPage: (pageId: string) => {
        set({ currentPageId: pageId, selectedComponentId: null });
      },

      reorderPages: (pageIds: string[]) => {
        const { pages } = get();
        const reorderedPages = pageIds.map(id => pages.find(p => p.id === id)!).filter(Boolean);
        set({ pages: reorderedPages });
      },

      // Component Management
      addComponent: (type: ComponentType, pageId?: string, parentId?: string, position?: { x: number; y: number }) => {
        const { components, currentPageId } = get();
        const targetPageId = pageId || currentPageId;
        
        if (!targetPageId) return;
        
        const newComponent: Component = {
          id: generateId(),
          type,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${components.length + 1}`,
          props: getDefaultProps(type),
          pageId: targetPageId,
          parentId,
          position,
        };

        set({
          components: [...components, newComponent],
          selectedComponentId: newComponent.id,
        });
      },

      updateComponent: (id: string, updates: Partial<Component>) => {
        const { components } = get();
        const updatedComponents = components.map(comp =>
          comp.id === id ? { ...comp, ...updates } : comp
        );
        
        set({ components: updatedComponents });
      },

      removeComponent: (id: string) => {
        const { components, selectedComponentId } = get();
        const updatedComponents = components.filter(comp => comp.id !== id && comp.parentId !== id);
        
        set({
          components: updatedComponents,
          selectedComponentId: selectedComponentId === id ? null : selectedComponentId,
        });
      },

      duplicateComponent: (id: string) => {
        const { components } = get();
        const component = components.find(comp => comp.id === id);
        
        if (component) {
          const duplicatedComponent: Component = {
            ...component,
            id: generateId(),
            name: `${component.name} Copy`,
            position: component.position ? {
              x: component.position.x + 20,
              y: component.position.y + 20
            } : undefined,
          };
          
          set({
            components: [...components, duplicatedComponent],
            selectedComponentId: duplicatedComponent.id,
          });
        }
      },

      moveComponent: (id: string, newParentId?: string, newPageId?: string, newPosition?: { x: number; y: number }) => {
        const { components } = get();
        const updatedComponents = components.map(comp =>
          comp.id === id ? { 
            ...comp, 
            parentId: newParentId,
            pageId: newPageId || comp.pageId,
            position: newPosition || comp.position
          } : comp
        );
        
        set({ components: updatedComponents });
      },

      selectComponent: (id: string | null) => {
        set({ selectedComponentId: id });
      },

      // Drag & Drop
      startDrag: (component: Component) => {
        set({ draggedComponent: component, isDragging: true });
      },

      endDrag: () => {
        set({ draggedComponent: null, isDragging: false });
      },

      handleDrop: (targetId: string, position: { x: number; y: number }) => {
        const { draggedComponent } = get();
        if (draggedComponent) {
          get().moveComponent(draggedComponent.id, targetId, undefined, position);
          get().endDrag();
        }
      },

      // UI State
      setPreviewMode: (enabled: boolean) => {
        set({ isPreviewMode: enabled });
      },

      setDeviceType: (type: 'phone' | 'tablet' | 'desktop') => {
        set({ deviceType: type });
      },

      setOrientation: (orientation: 'portrait' | 'landscape') => {
        set({ orientation });
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      setActivePanel: (panel: 'components' | 'pages' | 'assets' | 'integrations') => {
        set({ activePanel: panel });
      },

      // Settings & Configuration
      updateProjectSettings: (settings: Partial<ProjectSettings>) => {
        const { currentProject } = get();
        if (currentProject) {
          const updatedProject = {
            ...currentProject,
            settings: { ...currentProject.settings, ...settings },
            updatedAt: new Date(),
          };
          
          set({ currentProject: updatedProject });
        }
      },

      updateNavigation: (navigation: Partial<NavigationStructure>) => {
        const { currentProject } = get();
        if (currentProject) {
          const updatedProject = {
            ...currentProject,
            navigation: { ...currentProject.navigation, ...navigation },
            updatedAt: new Date(),
          };
          
          set({ currentProject: updatedProject });
        }
      },

      updateAuthentication: (auth: Partial<AuthenticationConfig>) => {
        const { currentProject } = get();
        if (currentProject) {
          const updatedProject = {
            ...currentProject,
            authentication: { ...currentProject.authentication, ...auth },
            updatedAt: new Date(),
          };
          
          set({ currentProject: updatedProject });
        }
      },

      updateIntegrations: (integrations: Integration[]) => {
        const { currentProject } = get();
        if (currentProject) {
          const updatedProject = {
            ...currentProject,
            integrations,
            updatedAt: new Date(),
          };
          
          set({ currentProject: updatedProject });
        }
      },

      updateTheme: (theme: Partial<AppTheme>) => {
        const { currentProject } = get();
        if (currentProject) {
          const updatedProject = {
            ...currentProject,
            theme: { ...currentProject.theme, ...theme },
            updatedAt: new Date(),
          };
          
          set({ currentProject: updatedProject });
        }
      },

      // Code Generation & Export
      generateCode: () => {
        const { pages, components, currentProject } = get();
        return generateReactNativeCode(pages, components, currentProject?.settings || defaultProjectSettings);
      },

      generatePageCode: (pageId: string) => {
        const { pages, components, currentProject } = get();
        const page = pages.find(p => p.id === pageId);
        const pageComponents = components.filter(c => c.pageId === pageId);
        
        if (!page) return '';
        
        return generatePageReactNativeCode(page, pageComponents, currentProject?.settings || defaultProjectSettings);
      },

      exportProject: () => {
        const { currentProject, pages, components } = get();
        if (currentProject) {
          const exportData = {
            project: currentProject,
            pages,
            components,
            code: get().generateCode(),
            exportedAt: new Date(),
          };
          
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${currentProject.name.replace(/\s+/g, '-').toLowerCase()}-export.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      },

      exportToExpo: () => {
        const { currentProject, pages, components } = get();
        if (currentProject) {
          const projectFiles = generateExpoProject(currentProject, pages, components);
          console.log('Expo project files:', projectFiles);
        }
      },

      // Templates
      loadTemplates: () => {
        const templates: Template[] = [
          {
            id: 'blank',
            name: 'Blank App',
            description: 'Start with a clean slate',
            category: 'Basic',
            thumbnail: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400',
            pages: [createDefaultPage()],
            components: [],
            settings: defaultProjectSettings,
            theme: defaultTheme,
            tags: ['basic', 'starter'],
          },
          {
            id: 'ecommerce',
            name: 'E-commerce App',
            description: 'Complete shopping app template',
            category: 'Business',
            thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
            pages: [createDefaultPage()],
            components: [],
            settings: defaultProjectSettings,
            theme: defaultTheme,
            tags: ['ecommerce', 'business', 'shopping'],
            featured: true,
          },
          {
            id: 'social',
            name: 'Social Media App',
            description: 'Social networking template',
            category: 'Social',
            thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
            pages: [createDefaultPage()],
            components: [],
            settings: defaultProjectSettings,
            theme: defaultTheme,
            tags: ['social', 'networking', 'community'],
            featured: true,
          },
        ];
        
        set({ templates });
      },

      createTemplate: (name: string, description: string) => {
        const { currentProject, pages, components } = get();
        if (currentProject) {
          const template: Template = {
            id: generateId(),
            name,
            description,
            category: 'Custom',
            thumbnail: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400',
            pages,
            components,
            settings: currentProject.settings,
            theme: currentProject.theme,
            tags: ['custom'],
          };
          
          const { templates } = get();
          set({ templates: [...templates, template] });
        }
      },

      // Collaboration
      shareProject: (projectId: string, permissions: 'view' | 'edit') => {
        const shareId = generateId();
        const shareUrl = `${window.location.origin}/shared/${shareId}`;
        return shareUrl;
      },

      importProject: (projectData: any) => {
        try {
          const project: Project = {
            ...projectData.project,
            id: generateId(),
            name: `${projectData.project.name} (Imported)`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set({
            currentProject: project,
            pages: projectData.pages || [],
            components: projectData.components || [],
            currentPageId: projectData.pages?.[0]?.id || null,
          });
        } catch (error) {
          console.error('Failed to import project:', error);
        }
      },
    }),
    {
      name: 'app-builder-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentProject: state.currentProject,
        pages: state.pages,
        components: state.components,
        templates: state.templates,
      }),
    }
  )
);

// Helper Functions
function createDefaultPage(): Page {
  return {
    id: generateId(),
    name: 'Home',
    route: '/home',
    components: [],
    layout: 'scroll',
    backgroundColor: '#FFFFFF',
    statusBarStyle: 'dark',
    headerShown: true,
    tabBarVisible: true,
    isHomePage: true,
  };
}

function getDefaultProps(type: ComponentType): any {
  const baseStyle = { marginBottom: 16 };
  
  switch (type) {
    case 'text':
      return { 
        text: 'Sample text', 
        fontSize: 16, 
        color: '#1F2937',
        style: baseStyle
      };
    case 'button':
      return { 
        title: 'Button', 
        backgroundColor: '#3B82F6',
        color: '#FFFFFF',
        variant: 'primary',
        size: 'medium',
        style: { 
          paddingHorizontal: 24, 
          paddingVertical: 12, 
          borderRadius: 8,
          ...baseStyle
        }
      };
    case 'image':
      return { 
        source: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400', 
        style: { 
          width: '100%', 
          height: 200, 
          borderRadius: 12,
          ...baseStyle
        }
      };
    case 'input':
      return {
        placeholder: 'Enter text...',
        variant: 'outlined',
        style: {
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 16,
          backgroundColor: '#FFFFFF',
          ...baseStyle
        }
      };
    case 'view':
      return { 
        backgroundColor: '#F9FAFB', 
        style: { 
          padding: 20, 
          borderRadius: 12,
          ...baseStyle
        }
      };
    case 'card':
      return {
        title: 'Card Title',
        content: 'Card content goes here...',
        variant: 'elevated',
        style: {
          backgroundColor: '#FFFFFF',
          padding: 20,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          ...baseStyle
        }
      };
    default:
      return { style: baseStyle };
  }
}

function generateReactNativeCode(pages: Page[], components: Component[], settings: ProjectSettings): string {
  const imports = `import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';`;

  const pageComponents = pages.map(page => generatePageComponent(page, components.filter(c => c.pageId === page.id))).join('\n\n');

  const navigation = generateNavigationCode(pages);

  const styles = generateAppStyles(settings);

  return `${imports}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

${pageComponents}

${navigation}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="${settings.theme === 'dark' ? 'light' : 'dark'}" />
      <AppNavigator />
    </NavigationContainer>
  );
}

${styles}`;
}

function generatePageComponent(page: Page, components: Component[]): string {
  const componentCode = components.map(comp => generateComponentCode(comp)).join('\n        ');

  return `function ${page.name.replace(/\s+/g, '')}Screen() {
  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (id, value) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '${page.backgroundColor}' }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        ${componentCode}
      </ScrollView>
    </SafeAreaView>
  );
}`;
}

function generateComponentCode(component: Component): string {
  switch (component.type) {
    case 'text':
      return `<Text style={[styles.text, styles.component_${component.id}]}>${component.props.text}</Text>`;
    case 'button':
      return `<TouchableOpacity style={[styles.button, styles.component_${component.id}]} onPress={() => console.log('Button pressed')}>
          <Text style={styles.buttonText}>${component.props.title}</Text>
        </TouchableOpacity>`;
    case 'image':
      return `<Image source={{ uri: '${component.props.source}' }} style={[styles.image, styles.component_${component.id}]} />`;
    case 'input':
      return `<TextInput
          placeholder="${component.props.placeholder}"
          value={inputValues['${component.id}'] || ''}
          onChangeText={(value) => handleInputChange('${component.id}', value)}
          style={[styles.input, styles.component_${component.id}]}
        />`;
    case 'view':
      return `<View style={[styles.view, styles.component_${component.id}]}>
          <Text style={styles.viewText}>Container</Text>
        </View>`;
    case 'card':
      return `<View style={[styles.card, styles.component_${component.id}]}>
          <Text style={styles.cardTitle}>${component.props.title}</Text>
          <Text style={styles.cardContent}>${component.props.content}</Text>
        </View>`;
    default:
      return `<Text>Unknown component: ${component.type}</Text>`;
  }
}

function generateNavigationCode(pages: Page[]): string {
  const tabScreens = pages.filter(p => p.isHomePage || !p.parentPageId).map(page => 
    `<Tab.Screen name="${page.name}" component={${page.name.replace(/\s+/g, '')}Screen} />`
  ).join('\n      ');

  return `function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
      }}>
      ${tabScreens}
    </Tab.Navigator>
  );
}`;
}

function generatePageReactNativeCode(page: Page, components: Component[], settings: ProjectSettings): string {
  return generatePageComponent(page, components);
}

function generateAppStyles(settings: ProjectSettings): string {
  return `const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '${settings.theme === 'dark' ? '#1F2937' : '#FFFFFF'}',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '${settings.theme === 'dark' ? '#FFFFFF' : '#1F2937'}',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '${settings.primaryColor}',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  view: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  viewText: {
    color: '#6B7280',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
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
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    height: 65,
  },
});`;
}

function generateExpoProject(project: Project, pages: Page[], components: Component[]): any {
  return {
    'app.json': JSON.stringify({
      expo: {
        name: project.name,
        slug: project.name.toLowerCase().replace(/\s+/g, '-'),
        version: project.settings.buildSettings?.version || '1.0.0',
        orientation: project.settings.buildSettings?.orientation || 'portrait',
        platforms: project.settings.buildSettings?.platforms || ['ios', 'android', 'web'],
      }
    }, null, 2),
    'package.json': JSON.stringify({
      name: project.name.toLowerCase().replace(/\s+/g, '-'),
      version: project.settings.buildSettings?.version || '1.0.0',
      main: 'node_modules/expo/AppEntry.js',
      scripts: {
        start: 'expo start',
        android: 'expo start --android',
        ios: 'expo start --ios',
        web: 'expo start --web'
      },
      dependencies: {
        expo: '~49.0.0',
        react: '18.2.0',
        'react-native': '0.72.6',
        '@react-navigation/native': '^6.1.0',
        '@react-navigation/bottom-tabs': '^6.5.0',
      }
    }, null, 2),
    'App.js': generateReactNativeCode(pages, components, project.settings),
  };
}