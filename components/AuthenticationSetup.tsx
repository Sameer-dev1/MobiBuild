import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, TextInput } from 'react-native';
import { 
  Shield, 
  Mail, 
  Smartphone, 
  Github, 
  Chrome,
  Apple,
  Facebook,
  Key,
  Users,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react-native';
import { useAppStore } from '../store/AppStore';
import { AuthProvider } from '../types/app';

export function AuthenticationSetup() {
  const { currentProject, updateAuthentication } = useAppStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const authConfig = currentProject?.authentication || {
    enabled: false,
    providers: [],
    protectedPages: [],
  };

  const availableProviders: (AuthProvider & { icon: any; color: string; description: string })[] = [
    {
      type: 'email',
      enabled: false,
      icon: Mail,
      color: '#3B82F6',
      description: 'Email and password authentication',
    },
    {
      type: 'google',
      enabled: false,
      icon: Chrome,
      color: '#EA4335',
      description: 'Sign in with Google account',
    },
    {
      type: 'apple',
      enabled: false,
      icon: Apple,
      color: '#000000',
      description: 'Sign in with Apple ID',
    },
    {
      type: 'facebook',
      enabled: false,
      icon: Facebook,
      color: '#1877F2',
      description: 'Sign in with Facebook account',
    },
    {
      type: 'github',
      enabled: false,
      icon: Github,
      color: '#24292E',
      description: 'Sign in with GitHub account',
    },
  ];

  const handleToggleAuth = (enabled: boolean) => {
    updateAuthentication({ enabled });
  };

  const handleToggleProvider = (providerType: string, enabled: boolean) => {
    const updatedProviders = authConfig.providers.map(provider =>
      provider.type === providerType ? { ...provider, enabled } : provider
    );
    
    // Add provider if it doesn't exist
    if (!authConfig.providers.find(p => p.type === providerType)) {
      updatedProviders.push({
        type: providerType as any,
        enabled,
      });
    }
    
    updateAuthentication({ providers: updatedProviders });
  };

  const isProviderEnabled = (providerType: string) => {
    return authConfig.providers.find(p => p.type === providerType)?.enabled || false;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Shield size={24} color="#3B82F6" />
        <Text style={styles.title}>Authentication</Text>
      </View>

      {/* Enable Authentication */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Enable Authentication</Text>
          <Switch
            value={authConfig.enabled}
            onValueChange={handleToggleAuth}
            trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <Text style={styles.sectionDescription}>
          Add user authentication to your app with secure login and registration
        </Text>
      </View>

      {authConfig.enabled && (
        <>
          {/* Authentication Providers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Authentication Providers</Text>
            <Text style={styles.sectionDescription}>
              Choose how users can sign in to your app
            </Text>
            
            <View style={styles.providersList}>
              {availableProviders.map((provider) => {
                const IconComponent = provider.icon;
                const isEnabled = isProviderEnabled(provider.type);
                
                return (
                  <View key={provider.type} style={styles.providerItem}>
                    <View style={styles.providerInfo}>
                      <View style={[styles.providerIcon, { backgroundColor: provider.color + '15' }]}>
                        <IconComponent size={20} color={provider.color} />
                      </View>
                      <View style={styles.providerDetails}>
                        <Text style={styles.providerName}>
                          {provider.type.charAt(0).toUpperCase() + provider.type.slice(1)}
                        </Text>
                        <Text style={styles.providerDescription}>
                          {provider.description}
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={isEnabled}
                      onValueChange={(enabled) => handleToggleProvider(provider.type, enabled)}
                      trackColor={{ false: '#E5E7EB', true: provider.color }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                );
              })}
            </View>
          </View>

          {/* Security Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Lock size={20} color="#6B7280" />
                <View style={styles.settingDetails}>
                  <Text style={styles.settingName}>Require Email Verification</Text>
                  <Text style={styles.settingDescription}>
                    Users must verify their email before accessing the app
                  </Text>
                </View>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Key size={20} color="#6B7280" />
                <View style={styles.settingDetails}>
                  <Text style={styles.settingName}>Two-Factor Authentication</Text>
                  <Text style={styles.settingDescription}>
                    Add an extra layer of security with 2FA
                  </Text>
                </View>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Users size={20} color="#6B7280" />
                <View style={styles.settingDetails}>
                  <Text style={styles.settingName}>Allow Guest Access</Text>
                  <Text style={styles.settingDescription}>
                    Let users browse without creating an account
                  </Text>
                </View>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Advanced Settings */}
          <TouchableOpacity 
            style={styles.advancedToggle}
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            <Text style={styles.advancedToggleText}>Advanced Settings</Text>
            {showAdvanced ? (
              <EyeOff size={20} color="#6B7280" />
            ) : (
              <Eye size={20} color="#6B7280" />
            )}
          </TouchableOpacity>

          {showAdvanced && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Advanced Configuration</Text>
              
              <Text style={styles.inputLabel}>Login Redirect URL</Text>
              <TextInput
                style={styles.textInput}
                placeholder="/dashboard"
                value={authConfig.redirectAfterLogin || ''}
                onChangeText={(value) => updateAuthentication({ redirectAfterLogin: value })}
              />
              
              <Text style={styles.inputLabel}>Session Timeout (minutes)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="60"
                keyboardType="numeric"
              />
              
              <Text style={styles.inputLabel}>Password Requirements</Text>
              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementText}>• Minimum 8 characters</Text>
                <Text style={styles.requirementText}>• At least one uppercase letter</Text>
                <Text style={styles.requirementText}>• At least one number</Text>
                <Text style={styles.requirementText}>• At least one special character</Text>
              </View>
            </View>
          )}

          {/* Generated Code Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Implementation Preview</Text>
            <View style={styles.codePreview}>
              <Text style={styles.codeText}>
{`// Authentication will be automatically integrated
import { AuthProvider } from './auth/AuthProvider';
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        {/* Your app navigation */}
      </NavigationContainer>
    </AuthProvider>
  );
}`}
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  providersList: {
    marginTop: 16,
  },
  providerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  providerDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingDetails: {
    marginLeft: 12,
    flex: 1,
  },
  settingName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  advancedToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  passwordRequirements: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  requirementText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  codePreview: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  codeText: {
    fontSize: 12,
    color: '#E5E7EB',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});