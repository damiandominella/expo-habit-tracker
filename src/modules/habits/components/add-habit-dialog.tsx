import React, { useState } from 'react';
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

interface AddHabitDialogProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (habitName: string) => void;
}

const AddHabitDialog = ({ visible, onClose, onAdd }: AddHabitDialogProps) => {
  const [habitName, setHabitName] = useState('');

  const handleAdd = () => {
    if (habitName.trim()) {
      onAdd(habitName.trim());
      setHabitName('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
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
              <Text style={styles.title}>Add New Habit</Text>
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
                    Add
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
    fontFamily: 'IndieFlower_400Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'IndieFlower_400Regular',
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
    fontFamily: 'IndieFlower_400Regular',
  },
  addButtonText: {
    color: 'white',
  },
});

export default AddHabitDialog;
