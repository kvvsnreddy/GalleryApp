import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { Dropdown } from '../../components/Dropdown';
import { validateRegisterForm } from '../../utils/validation';
import { storage, StorageKeys } from '../../utils/storage';
import { RegisterFormData, RegisterErrors, User } from '../../types/auth';

type Props = { navigation: StackNavigationProp<AuthStackParamList, 'Register'> };

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
];
const GENDERS = ['Male', 'Female', 'Other'] as const;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState<RegisterFormData>({
    fullName: '', email: '', mobile: '', gender: '', address: '', city: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof RegisterFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleRegister = async () => {
    const validationErrors = validateRegisterForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const existing = await storage.get<User>(StorageKeys.REGISTERED_USER);
      if (existing && existing.email.toLowerCase() === form.email.toLowerCase()) {
        setErrors({ email: 'An account with this email already exists.' });
        return;
      }

      const newUser: User = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        gender: form.gender as 'Male' | 'Female' | 'Other',
        address: form.address.trim(),
        city: form.city,
        password: form.password,
      };

      await storage.set(StorageKeys.REGISTERED_USER, newUser);
      Alert.alert('Account Created!', 'Your account has been created. Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>✨</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join GalleryApp today</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Full Name"
            placeholder="Jane Doe"
            value={form.fullName}
            onChangeText={(v) => set('fullName', v)}
            error={errors.fullName}
            autoCapitalize="words"
          />
          <InputField
            label="Email Address"
            placeholder="jane@example.com"
            value={form.email}
            onChangeText={(v) => set('email', v)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Mobile Number"
            placeholder="10-digit number"
            value={form.mobile}
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
                <View style={[styles.radioCircle, form.gender === g && styles.radioCircleSelected]}>
                  {form.gender === g && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.radioText, form.gender === g && styles.radioTextSelected]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {!!errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

          <InputField
            label="Address"
            placeholder="Street address"
            value={form.address}
            onChangeText={(v) => set('address', v)}
            error={errors.address}
            autoCapitalize="sentences"
          />
          <Dropdown
            label="City"
            options={CITIES}
            value={form.city}
            onSelect={(v) => set('city', v)}
            placeholder="Select your city"
            error={errors.city}
          />
          <InputField
            label="Password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChangeText={(v) => set('password', v)}
            error={errors.password}
            isPassword
          />
          <InputField
            label="Confirm Password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChangeText={(v) => set('confirmPassword', v)}
            error={errors.confirmPassword}
            isPassword
          />

          <Button title="Create Account" onPress={handleRegister} loading={loading} style={styles.btn} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F8F7FF' },
  container: { flexGrow: 1, padding: 24, paddingTop: 48, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 28 },
  logo: { fontSize: 52, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: '800', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  radioLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  radioGroup: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  radioOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  radioSelected: { borderColor: '#6C63FF', backgroundColor: '#EEF2FF' },
  radioCircle: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: '#D1D5DB',
    justifyContent: 'center', alignItems: 'center',
  },
  radioCircleSelected: { borderColor: '#6C63FF' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6C63FF' },
  radioText: { fontSize: 13, color: '#374151' },
  radioTextSelected: { color: '#6C63FF', fontWeight: '600' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: -10, marginBottom: 10 },
  btn: { marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#6B7280', fontSize: 14 },
  link: { color: '#6C63FF', fontSize: 14, fontWeight: '700' },
});
