import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function CalculatorScreen({ navigation }) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const Button = ({ onPress, text, style, textStyle }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calculadora</Text>
      </View>

      <View style={styles.displayContainer}>
        <Text style={styles.display} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <Button
            text="C"
            style={styles.functionButton}
            textStyle={styles.functionButtonText}
            onPress={clear}
          />
          <Button
            text="±"
            style={styles.functionButton}
            textStyle={styles.functionButtonText}
            onPress={() => {
              const newValue = parseFloat(display) * -1;
              setDisplay(String(newValue));
            }}
          />
          <Button
            text="%"
            style={styles.functionButton}
            textStyle={styles.functionButtonText}
            onPress={() => {
              const newValue = parseFloat(display) / 100;
              setDisplay(String(newValue));
            }}
          />
          <Button
            text="÷"
            style={styles.operatorButton}
            textStyle={styles.operatorButtonText}
            onPress={() => inputOperation('÷')}
          />
        </View>

        <View style={styles.row}>
          <Button text="7" onPress={() => inputNumber(7)} />
          <Button text="8" onPress={() => inputNumber(8)} />
          <Button text="9" onPress={() => inputNumber(9)} />
          <Button
            text="×"
            style={styles.operatorButton}
            textStyle={styles.operatorButtonText}
            onPress={() => inputOperation('×')}
          />
        </View>

        <View style={styles.row}>
          <Button text="4" onPress={() => inputNumber(4)} />
          <Button text="5" onPress={() => inputNumber(5)} />
          <Button text="6" onPress={() => inputNumber(6)} />
          <Button
            text="-"
            style={styles.operatorButton}
            textStyle={styles.operatorButtonText}
            onPress={() => inputOperation('-')}
          />
        </View>

        <View style={styles.row}>
          <Button text="1" onPress={() => inputNumber(1)} />
          <Button text="2" onPress={() => inputNumber(2)} />
          <Button text="3" onPress={() => inputNumber(3)} />
          <Button
            text="+"
            style={styles.operatorButton}
            textStyle={styles.operatorButtonText}
            onPress={() => inputOperation('+')}
          />
        </View>

        <View style={styles.row}>
          <Button
            text="0"
            style={styles.zeroButton}
            onPress={() => inputNumber(0)}
          />
          <Button text="." onPress={inputDecimal} />
          <Button
            text="="
            style={styles.equalsButton}
            textStyle={styles.operatorButtonText}
            onPress={performCalculation}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 20,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  display: {
    color: '#fff',
    fontSize: 60,
    fontWeight: '200',
    textAlign: 'right',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    height: 80,
    backgroundColor: '#333',
    marginHorizontal: 5,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '400',
  },
  functionButton: {
    backgroundColor: '#a6a6a6',
  },
  functionButtonText: {
    color: '#000',
  },
  operatorButton: {
    backgroundColor: '#ff9500',
  },
  operatorButtonText: {
    color: '#fff',
    fontSize: 35,
  },
  zeroButton: {
    flex: 2,
    marginRight: 5,
  },
  equalsButton: {
    backgroundColor: '#ff9500',
  },
});

