import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Folder, Clock, Smartphone, Trash2, Edit3, Copy, Star, TrendingUp, Users, Zap, Search, Filter, Grid2x2 as Grid, List, Download, Share2, LogIn, UserPlus } from 'lucide-react-native';
import { useAppStore } from '../../store/AppStore';
import { Project, Template } from '../../types/app';
import { formatDate } from '../../utils/helpers';

export default function Dashboard() {
  const { 
    createProject, 
    loadProject, 
    deleteProject,
    duplicateProject,
    currentProject,
    templates,
    loadTemplates,
    user,
    isAuthenticated,
    login,
    signup,
    logout
  } = useAppStore();
  
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedProjects();
    loadTemplates();
  }, []);

  const loadSavedProjects = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('appBuilderProjects') || '[]');
      setSavedProjects(saved);
    } catch (error) {
      console.error('Error loading saved projects:', error);
      setSavedProjects([]);
    }
  };

  const handleCreateProject = () => {
    if (projectName.trim()) {
      createProject(projectName.trim(), projectDescription.trim(), selectedTemplate || undefined);
      setShowCreateModal(false);
      setShowTemplateModal(false);
      setProjectName('');
      setProjectDescription('');
      setSelectedTemplate(null);
      loadSavedProjects();
    }
  };

  const handleLoadProject = (project: Project) => {
    loadProject(project);
  };

  const handleDeleteProject = (projectId: string) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteProject(projectId);
            loadSavedProjects();
          }
        }
      ]
    );
  };

  const handleDuplicateProject = (projectId: string) => {
    duplicateProject(projectId);
    loadSavedProjects();
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (authMode === 'signup' && !name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      let success = false;
      if (authMode === 'login') {
        success = await login(email, password);
      } else {
        success = await signup(email, password, name);
      }

      if (success) {
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
        setName('');
        Alert.alert('Success', `${authMode === 'login' ? 'Logged in' : 'Account created'} successfully!`);
      } else {
        Alert.alert('Error', `${authMode === 'login' ? 'Login' : 'Signup'} failed. Please try again.`);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = savedProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = templates.filter(template =>
    (filterCategory === 'all' || template.category.toLowerCase() === filterCategory.toLowerCase()) &&
    (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     template.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    totalProjects: savedProjects.length,
    totalComponents: savedProjects.reduce((sum, p) => sum + p.components.length, 0),
    activeThisWeek: savedProjects.filter(p => 
      new Date(p.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length,
    totalPages: savedProjects.reduce((sum, p) => sum + p.pages.length, 0),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Mobile App Builder</Text>
            <Text style={styles.subtitle}>
              Create stunning mobile apps with drag-and-drop simplicity
            </Text>
            
            {/* Auth Section */}
            <View style={styles.authSection}>
              {isAuthenticated && user ? (
                <View style={styles.userInfo}>
                  <Text style={styles.welcomeText}>Welcome back, {user.name}!</Text>
                  <View style={styles.userActions}>
                    <View style={styles.subscriptionBadge}>
                      <Text style={styles.subscriptionText}>{user.subscription?.toUpperCase()}</Text>
                    </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                      <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.authButtons}>
                  <TouchableOpacity 
                    style={styles.authButton}
                    onPress={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                  >
                    <LogIn size={16} color="#3B82F6" />
                    <Text style={styles.authButtonText}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.authButton, styles.signupButton]}
                    onPress={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                  >
                    <UserPlus size={16} color="#FFFFFF" />
                    <Text style={[styles.authButtonText, styles.signupButtonText]}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          
          {currentProject && (
            <View style={styles.currentProject}>
              <Text style={styles.currentProjectLabel}>Current Project</Text>
              <Text style={styles.currentProjectName}>{currentProject.name}</Text>
              <Text style={styles.currentProjectStats}>
                {currentProject.pages.length} pages • {currentProject.components.length} components
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.primaryAction]}
              onPress={() => setShowCreateModal(true)}
            >
              <Plus size={32} color="#FFFFFF" />
              <Text style={styles.actionTextPrimary}>New Project</Text>
              <Text style={styles.actionSubtext}>Start from scratch</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => setShowTemplateModal(true)}
            >
              <Star size={28} color="#F59E0B" />
              <Text style={styles.actionText}>Templates</Text>
              <Text style={styles.actionSubtext}>Pre-built apps</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Alert.alert('Import', 'Import functionality coming soon!')}
            >
              <Download size={28} color="#10B981" />
              <Text style={styles.actionText}>Import</Text>
              <Text style={styles.actionSubtext}>From file</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Alert.alert('Examples', 'Example projects coming soon!')}
            >
              <Smartphone size={28} color="#8B5CF6" />
              <Text style={styles.actionText}>Examples</Text>
              <Text style={styles.actionSubtext}>Learn & explore</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#3B82F6" />
              <Text style={styles.statNumber}>{stats.totalProjects}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.statCard}>
              <Folder size={24} color="#10B981" />
              <Text style={styles.statNumber}>{stats.totalPages}</Text>
              <Text style={styles.statLabel}>Pages</Text>
            </View>
            <View style={styles.statCard}>
              <Zap size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>{stats.totalComponents}</Text>
              <Text style={styles.statLabel}>Components</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={24} color="#8B5CF6" />
              <Text style={styles.statNumber}>{stats.activeThisWeek}</Text>
              <Text style={styles.statLabel}>Active This Week</Text>
            </View>
          </View>
        </View>

        {/* Recent Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Projects ({savedProjects.length})</Text>
            <View style={styles.sectionActions}>
              <View style={styles.searchContainer}>
                <Search size={16} color="#6B7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity
                style={[styles.viewToggle, viewMode === 'grid' && styles.activeViewToggle]}
                onPress={() => setViewMode('grid')}
              >
                <Grid size={16} color={viewMode === 'grid' ? '#3B82F6' : '#6B7280'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewToggle, viewMode === 'list' && styles.activeViewToggle]}
                onPress={() => setViewMode('list')}
              >
                <List size={16} color={viewMode === 'list' ? '#3B82F6' : '#6B7280'} />
              </TouchableOpacity>
            </View>
          </View>
          
          {filteredProjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Folder size={64} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No projects found' : 'No projects yet'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery ? 'Try a different search term' : 'Create your first mobile app project'}
              </Text>
            </View>
          ) : (
            <View style={viewMode === 'grid' ? styles.projectsGrid : styles.projectsList}>
              {filteredProjects.map((project) => (
                <TouchableOpacity 
                  key={project.id} 
                  style={viewMode === 'grid' ? styles.projectCard : styles.projectListItem}
                  onPress={() => handleLoadProject(project)}
                >
                  <View style={styles.projectHeader}>
                    <View style={styles.projectIcon}>
                      <Smartphone size={24} color="#3B82F6" />
                    </View>
                    <View style={styles.projectActions}>
                      <TouchableOpacity 
                        style={styles.projectActionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDuplicateProject(project.id);
                        }}
                      >
                        <Copy size={16} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.projectActionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          Alert.alert('Share', 'Share functionality coming soon!');
                        }}
                      >
                        <Share2 size={16} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.projectActionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.projectInfo}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <Text style={styles.projectDescription} numberOfLines={2}>
                      {project.description || 'No description'}
                    </Text>
                    <View style={styles.projectMetadata}>
                      <Text style={styles.projectStats}>
                        {project.pages.length} pages • {project.components.length} components
                      </Text>
                      <Text style={styles.projectTime}>
                        {formatDate(new Date(project.updatedAt))}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Features</Text>
          <View style={styles.featureGrid}>
            {[
              { icon: Zap, title: 'Drag & Drop Builder', description: 'Visual component-based design' },
              { icon: Smartphone, title: 'Multi-Device Preview', description: 'Phone, tablet, and desktop views' },
              { icon: Users, title: 'Authentication Ready', description: 'Built-in user management' },
              { icon: TrendingUp, title: 'Real-time Code Generation', description: 'Export production-ready React Native' },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <View key={index} style={styles.featureCard}>
                  <IconComponent size={32} color="#3B82F6" />
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Auth Modal */}
      <Modal
        visible={showAuthModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {authMode === 'login' ? 'Login to Your Account' : 'Create New Account'}
            </Text>
            
            {authMode === 'signup' && (
              <>
                <Text style={styles.modalLabel}>Full Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                  autoCapitalize="words"
                />
              </>
            )}
            
            <Text style={styles.modalLabel}>Email</Text>
            <TextInput
              style={styles.modalInput}
              value={email}
              onChangeText={setEmail}
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={styles.modalLabel}>Password</Text>
            <TextInput
              style={styles.modalInput}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAuthModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalCreateButton, loading && styles.modalCreateButtonDisabled]}
                onPress={handleAuth}
                disabled={loading}
              >
                <Text style={styles.modalCreateText}>
                  {loading ? 'Please wait...' : (authMode === 'login' ? 'Login' : 'Sign Up')}
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.switchAuthMode}
              onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
            >
              <Text style={styles.switchAuthModeText}>
                {authMode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Login"
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create Project Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Project</Text>
            
            <Text style={styles.modalLabel}>Project Name</Text>
            <TextInput
              style={styles.modalInput}
              value={projectName}
              onChangeText={setProjectName}
              placeholder="My Awesome App"
              autoFocus
            />
            
            <Text style={styles.modalLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              value={projectDescription}
              onChangeText={setProjectDescription}
              placeholder="Describe your app..."
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalCreateButton, !projectName.trim() && styles.modalCreateButtonDisabled]}
                onPress={handleCreateProject}
                disabled={!projectName.trim()}
              >
                <Text style={styles.modalCreateText}>Create Project</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Template Selection Modal */}
      <Modal
        visible={showTemplateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.templateModalContent]}>
            <Text style={styles.modalTitle}>Choose a Template</Text>
            
            <View style={styles.templateFilters}>
              {['All', 'Basic', 'Business', 'Social', 'Custom'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterButton,
                    filterCategory === category.toLowerCase() && styles.activeFilterButton
                  ]}
                  onPress={() => setFilterCategory(category.toLowerCase())}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filterCategory === category.toLowerCase() && styles.activeFilterButtonText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <ScrollView style={styles.templatesScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.templatesGrid}>
                {filteredTemplates.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    style={[
                      styles.templateCard,
                      selectedTemplate?.id === template.id && styles.selectedTemplateCard
                    ]}
                    onPress={() => setSelectedTemplate(template)}
                  >
                    <Image source={{ uri: template.thumbnail }} style={styles.templateThumbnail} />
                    <View style={styles.templateInfo}>
                      <Text style={styles.templateName}>{template.name}</Text>
                      <Text style={styles.templateDescription} numberOfLines={2}>
                        {template.description}
                      </Text>
                      {template.featured && (
                        <View style={styles.featuredBadge}>
                          <Star size={12} color="#F59E0B" />
                          <Text style={styles.featuredText}>Featured</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.templateModalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowTemplateModal(false);
                  setSelectedTemplate(null);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCreateButton}
                onPress={() => setShowCreateModal(true)}
              >
                <Text style={styles.modalCreateText}>
                  {selectedTemplate ? 'Use Template' : 'Start Blank'}
                </Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 400,
    marginBottom: 20,
  },
  authSection: {
    width: '100%',
    alignItems: 'center',
  },
  authButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
  },
  signupButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  authButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 6,
  },
  signupButtonText: {
    color: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  subscriptionBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  subscriptionText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  logoutText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  currentProject: {
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  currentProjectLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  currentProjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 4,
  },
  currentProjectStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
    minWidth: 120,
  },
  viewToggle: {
    padding: 8,
    borderRadius: 6,
    marginLeft: 4,
  },
  activeViewToggle: {
    backgroundColor: '#EBF4FF',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: 140,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }),
  },
  primaryAction: {
    backgroundColor: '#3B82F6',
    flex: 2,
    minWidth: 200,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  actionTextPrimary: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  actionSubtext: {
    fontSize: 12,
    color: '#E5E7EB',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 1px 4px rgba(0,0,0,0.05)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    }),
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  projectsList: {
    marginTop: 16,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    minWidth: 280,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }),
  },
  projectListItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 1px 4px rgba(0,0,0,0.05)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    }),
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectActions: {
    flexDirection: 'row',
    gap: 8,
  },
  projectActionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  projectInfo: {
    flex: 1,
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
    marginBottom: 12,
    lineHeight: 20,
  },
  projectMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectStats: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  projectTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: 160,
    ...(Platform.OS === 'web' ? { boxShadow: '0px 1px 4px rgba(0,0,0,0.05)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    }),
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    marginTop: 16,
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
    textAlign: 'center',
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
  templateModalContent: {
    maxWidth: 600,
    maxHeight: '80%',
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
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  templateModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
  switchAuthMode: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchAuthModeText: {
    fontSize: 14,
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  templateFilters: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  templatesScroll: {
    maxHeight: 400,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  templateCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: 160,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTemplateCard: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  templateThumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  featuredText: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '600',
    marginLeft: 4,
  },
});