import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Dimensions, Alert } from 'react-native';
import { useAppStore } from '../store/AppStore';
import { Component, ComponentType } from '../types/app';

interface DragDropBuilderProps {
  children: React.ReactNode;
}

export function DragDropBuilder({ children }: DragDropBuilderProps) {
  const { isDragging, draggedComponent, handleDrop, endDrag, addComponent, currentPageId } = useAppStore();
  const [dropZones, setDropZones] = useState<any[]>([]);
  const pan = useRef(new Animated.ValueXY()).current;
  const [dragPreviewPosition, setDragPreviewPosition] = useState({ x: 0, y: 0 });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => isDragging,
    onPanResponderGrant: (evt) => {
      setDragPreviewPosition({ x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY });
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
    },
    onPanResponderMove: (evt, gestureState) => {
      setDragPreviewPosition({ 
        x: evt.nativeEvent.pageX - 50, 
        y: evt.nativeEvent.pageY - 25 
      });
      Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      })(evt, gestureState);
    },
    onPanResponderRelease: (evt, gestureState) => {
      pan.flattenOffset();
      
      const dropX = evt.nativeEvent.pageX;
      const dropY = evt.nativeEvent.pageY;
      
      // Check if dropped in canvas area (simplified check)
      const screenWidth = Dimensions.get('window').width;
      const screenHeight = Dimensions.get('window').height;
      
      // If dropped in the main canvas area and we have a dragged component
      if (draggedComponent && currentPageId && 
          dropX > 100 && dropX < screenWidth - 100 && 
          dropY > 100 && dropY < screenHeight - 100) {
        
        // Add the component to the current page
        addComponent(draggedComponent.type, currentPageId, undefined, { x: dropX, y: dropY });
        
        Alert.alert(
          'Component Added!', 
          `${draggedComponent.name} has been added to your page.`,
          [{ text: 'OK' }]
        );
      }
      
      endDrag();
      
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
      {isDragging && draggedComponent && (
        <View
          style={[
            styles.dragPreview,
            {
              position: 'absolute',
              left: dragPreviewPosition.x,
              top: dragPreviewPosition.y,
              zIndex: 1000,
            },
          ]}
        >
          <Text style={styles.dragPreviewText}>{draggedComponent.name}</Text>
        </View>
      )}
      {isDragging && (
        <View style={styles.dropZoneOverlay}>
          <View style={styles.dropZoneIndicator}>
            <Text style={styles.dropZoneText}>Drop component here</Text>
            <Text style={styles.dropZoneSubtext}>Release to add to your page</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dragPreview: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  dragPreviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dropZoneOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  dropZoneIndicator: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
  },
  dropZoneText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  dropZoneSubtext: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
  },
});