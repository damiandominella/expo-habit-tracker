import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Habit } from '../types';

interface EditHabitDialogProps {
  habit: Habit | null;
  visible: boolean;
  onClose: () => void;
  onEdit: (habitName: string) => void;
}

const EditHabitDialog = ({
  habit,
  visible,
  onClose,
  onEdit,
}: EditHabitDialogProps) => {
  const [habitName, setHabitName] = useState(habit?.name || '');

  const handleAdd = () => {
    if (habitName.trim()) {
      onEdit(habitName.trim());
      setHabitName('');
      onClose();
    }
  };

  useEffect(() => {
    setHabitName(habit?.name || '');
  }, [habit]);

  return (
    <Modal
      visible={visible && !!habit}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.dialog}>
              <Text style={styles.title}>Edit Habit</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter habit name"
                value={habitName}
                onChangeText={setHabitName}
                autoFocus
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.addButton]}
                  onPress={handleAdd}
                >
                  <Text style={[styles.buttonText, styles.addButtonText]}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
  },
  addButtonText: {
    color: 'white',
  },
});

export default EditHabitDialog;
