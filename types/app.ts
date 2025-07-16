export interface Component {
  id: string;
  type: ComponentType;
  name: string;
  props: ComponentProps;
  children?: Component[];
  parentId?: string;
  pageId?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  animations?: Animation[];
  interactions?: Interaction[];
}

export type ComponentType = 
  | 'text' 
  | 'button' 
  | 'image' 
  | 'view' 
  | 'input' 
  | 'list' 
  | 'navigation' 
  | 'card'
  | 'header'
  | 'footer'
  | 'icon'
  | 'video'
  | 'map'
  | 'chart'
  | 'form'
  | 'slider'
  | 'switch'
  | 'picker'
  | 'modal'
  | 'tabs'
  | 'drawer'
  | 'fab'
  | 'badge'
  | 'avatar'
  | 'progress'
  | 'skeleton'
  | 'divider'
  | 'spacer';

export interface ComponentProps {
  [key: string]: any;
  style?: any;
  variant?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  disabled?: boolean;
  loading?: boolean;
}

export interface Page {
  id: string;
  name: string;
  route: string;
  components: Component[];
  layout: 'stack' | 'scroll' | 'fixed';
  backgroundColor?: string;
  statusBarStyle?: 'light' | 'dark' | 'auto';
  headerShown?: boolean;
  tabBarVisible?: boolean;
  isHomePage?: boolean;
  parentPageId?: string;
  navigationOptions?: NavigationOptions;
}

export interface NavigationOptions {
  title?: string;
  headerStyle?: any;
  headerTitleStyle?: any;
  headerBackTitle?: string;
  gestureEnabled?: boolean;
  animation?: 'slide' | 'fade' | 'flip' | 'none';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  pages: Page[];
  components: Component[];
  createdAt: Date;
  updatedAt: Date;
  settings: ProjectSettings;
  navigation: NavigationStructure;
  authentication?: AuthenticationConfig;
  integrations: Integration[];
  theme: AppTheme;
}

export interface NavigationStructure {
  type: 'tabs' | 'stack' | 'drawer';
  screens: NavigationScreen[];
  options?: any;
}

export interface NavigationScreen {
  name: string;
  pageId: string;
  icon?: string;
  title?: string;
  options?: any;
}

export interface ProjectSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  firebaseConfig?: FirebaseConfig;
  appIcon?: string;
  splashScreen?: SplashScreenConfig;
  permissions?: string[];
  buildSettings?: BuildSettings;
}

export interface SplashScreenConfig {
  backgroundColor: string;
  image?: string;
  resizeMode: 'contain' | 'cover' | 'stretch';
}

export interface BuildSettings {
  bundleId: string;
  version: string;
  buildNumber: number;
  orientation: 'portrait' | 'landscape' | 'default';
  platforms: ('ios' | 'android' | 'web')[];
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface AuthenticationConfig {
  enabled: boolean;
  providers: AuthProvider[];
  loginPage?: string;
  signupPage?: string;
  protectedPages: string[];
  redirectAfterLogin?: string;
}

export interface AuthProvider {
  type: 'email' | 'google' | 'apple' | 'facebook' | 'github';
  enabled: boolean;
  config?: any;
}

export interface Integration {
  id: string;
  type: 'analytics' | 'payments' | 'push' | 'ads' | 'social' | 'maps' | 'storage';
  name: string;
  enabled: boolean;
  config: any;
}

export interface AppTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    weights: {
      light: string;
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    sm: any;
    md: any;
    lg: any;
    xl: any;
  };
}

export interface Animation {
  id: string;
  type: 'fadeIn' | 'slideIn' | 'scaleIn' | 'rotateIn' | 'bounceIn';
  duration: number;
  delay?: number;
  easing?: string;
  trigger?: 'onMount' | 'onPress' | 'onScroll' | 'onHover';
}

export interface Interaction {
  id: string;
  trigger: 'onPress' | 'onLongPress' | 'onSwipe' | 'onScroll';
  action: InteractionAction;
}

export interface InteractionAction {
  type: 'navigate' | 'openModal' | 'showAlert' | 'callAPI' | 'updateState' | 'animate';
  params?: any;
}

export interface ComponentLibraryItem {
  type: ComponentType;
  name: string;
  icon: any;
  color: string;
  defaultProps: ComponentProps;
  category: 'basic' | 'layout' | 'navigation' | 'data' | 'media' | 'form' | 'feedback' | 'advanced';
  description: string;
  previewImage?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  pages: Page[];
  components: Component[];
  settings: ProjectSettings;
  theme: AppTheme;
  tags: string[];
  featured?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription?: 'free' | 'pro' | 'enterprise';
  projects: string[];
  createdAt: Date;
  lastLoginAt: Date;
}

export interface DragItem {
  id: string;
  type: ComponentType;
  name: string;
  props: ComponentProps;
}

export interface DropZone {
  id: string;
  pageId: string;
  parentId?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}