import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onSelect,
  placeholder = 'Select...',
  error,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.selector, error ? styles.selectorError : styles.selectorNormal]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.selectorText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item === value && styles.optionSelected]}
                  onPress={() => { onSelect(item); setVisible(false); }}
                >
                  <Text style={[styles.optionText, item === value && styles.optionSelectedText]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 14,
    height: 48,
  },
  selectorNormal: { borderColor: '#D1D5DB' },
  selectorError: { borderColor: '#EF4444' },
  selectorText: { fontSize: 15, color: '#111827' },
  placeholder: { color: '#9CA3AF' },
  arrow: { color: '#9CA3AF', fontSize: 12 },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: '#fff', borderRadius: 16, maxHeight: 320, overflow: 'hidden' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  option: { paddingVertical: 14, paddingHorizontal: 16 },
  optionSelected: { backgroundColor: '#EEF2FF' },
  optionText: { fontSize: 15, color: '#374151' },
  optionSelectedText: { color: '#6C63FF', fontWeight: '600' },
});
