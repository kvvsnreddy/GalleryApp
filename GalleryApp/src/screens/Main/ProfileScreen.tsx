import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { Dropdown } from '../../components/Dropdown';
import { User } from '../../types/auth';
import { validateEmail, validateMobile } from '../../utils/validation';
import { useGalleryStore } from '../../store/useGalleryStore';

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
];
const GENDERS = ['Male', 'Female', 'Other'] as const;
const AVATARS = ['👤', '🧑‍💻', '👩‍🎨', '🧑‍🚀', '👨‍🔬', '👩‍🏫', '🧑‍🎤', '🦸'];

export const ProfileScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);
  const favorites = useGalleryStore((state) => state.favorites);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<User>>(user ?? {});
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});

  const set = (field: keyof User, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleEdit = () => {
    setForm(user ?? {});
    setEditing(true);
  };

  const handleCancel = () => {
    setForm(user ?? {});
    setErrors({});
    setEditing(false);
  };

  const handleSave = async () => {
    const newErrors: Partial<Record<keyof User, string>> = {};
    if (!form.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email?.trim() || !validateEmail(form.email)) newErrors.email = 'Valid email is required';
    if (!form.mobile?.trim() || !validateMobile(form.mobile)) newErrors.mobile = '10-digit mobile required';
    if (!form.address?.trim()) newErrors.address = 'Address is required';
    if (!form.city?.trim()) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await updateUser(form);
      setEditing(false);
      Alert.alert('Saved!', 'Profile updated successfully.');
    } catch {
      Alert.alert('Error', 'Could not save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <Text style={styles.avatar}>{user.avatar ?? '👤'}</Text>
          {editing && (
            <View style={styles.avatarPicker}>
              {AVATARS.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.avatarOption, form.avatar === a && styles.avatarOptionSelected]}
                  onPress={() => set('avatar', a)}
                >
                  <Text style={styles.avatarOptionText}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{user.city}</Text>
              <Text style={styles.statLabel}>City</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Info</Text>
            {!editing ? (
              <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
                <Text style={styles.editBtnText}>✏️ Edit</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {editing ? (
            <>
              <InputField
                label="Full Name"
                value={form.fullName ?? ''}
                onChangeText={(v) => set('fullName', v)}
                error={errors.fullName}
                autoCapitalize="words"
              />
              <InputField
                label="Email Address"
                value={form.email ?? ''}
                onChangeText={(v) => set('email', v)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InputField
                label="Mobile Number"
                value={form.mobile ?? ''}
                onChangeText={(v) => set('mobile', v.replace(/\D/g, '').slice(0, 10))}
                error={errors.mobile}
                keyboardType="numeric"
              />

              <Text style={styles.radioLabel}>Gender</Text>
              <View style={styles.radioGroup}>
                {GENDERS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.radioOption, form.gender === g && styles.radioSelected]}
                    onPress={() => set('gender', g)}
                  >
                    <Text style={[styles.radioText, form.gender === g && styles.radioTextSelected]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <InputField
                label="Address"
                value={form.address ?? ''}
                onChangeText={(v) => set('address', v)}
                error={errors.address}
                autoCapitalize="sentences"
              />
              <Dropdown
                label="City"
                options={CITIES}
                value={form.city ?? ''}
                onSelect={(v) => set('city', v)}
                error={errors.city}
              />

              <View style={styles.buttonRow}>
                <Button title="Cancel" onPress={handleCancel} variant="outline" style={styles.halfBtn} />
                <Button title="Save" onPress={handleSave} loading={saving} style={styles.halfBtn} />
              </View>
            </>
          ) : (
            <>
              {[
                { label: 'Full Name', value: user.fullName },
                { label: 'Email', value: user.email },
                { label: 'Mobile', value: user.mobile },
                { label: 'Gender', value: user.gender },
                { label: 'Address', value: user.address },
                { label: 'City', value: user.city },
              ].map((item) => (
                <View key={item.label} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7FF' },
  container: { padding: 20, paddingBottom: 40 },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  avatar: { fontSize: 64, marginBottom: 10 },
  avatarPicker: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 12 },
  avatarOption: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarOptionSelected: { backgroundColor: '#fff' },
  avatarOptionText: { fontSize: 24 },
  userName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  userEmail: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 18 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  editBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: { fontSize: 13, color: '#6C63FF', fontWeight: '600' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: { fontSize: 13, color: '#9CA3AF', fontWeight: '500', flex: 1 },
  infoValue: { fontSize: 14, color: '#1F2937', fontWeight: '600', flex: 2, textAlign: 'right' },
  radioLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  radioGroup: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  radioOption: {
    flex: 1, paddingVertical: 10,
    borderWidth: 1.5, borderColor: '#D1D5DB',
    borderRadius: 10, alignItems: 'center',
  },
  radioSelected: { borderColor: '#6C63FF', backgroundColor: '#EEF2FF' },
  radioText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  radioTextSelected: { color: '#6C63FF' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  halfBtn: { flex: 1 },
  logoutBtn: { marginTop: 4 },
});
