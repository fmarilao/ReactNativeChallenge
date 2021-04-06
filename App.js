import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { Formik } from 'formik'
import * as yup from 'yup'
import DatePicker from 'react-native-date-picker'
import * as Location from "expo-location";
import axios from "axios";

export default function App() {
  const [date, setDate] = useState(new Date())
  const [position, setPosition] = useState(null);

  // Acceso a la posicion del dispositivo
  const getPosition = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      setPosition(coords);
    } catch (error) {
      console.log("getPosition -> error", error);
      setPosition(null);
    }
  };

  const entryPoint = async () => {
    try {
      const { status } = await Location.requestPermissionsAsync();
      if (status === "granted") {
        getPosition();
      }
    } catch (error) {
      console.log("getPermissionAndPosition -> error", error);
    }
  };
  // Fin acceso a la posicion

  useEffect(() => {
    //Localizacion
    entryPoint();
  }, []);

  const handleSubmit = async (data) => {
    const { name, lastName, birthdate } = data
    await axios.post('https://tech-challenge-v2.herokuapp.com/registration', {
      name,
      lastName,
      birthdate,
      location :{
                  latitude: data.location.latitude,
                  longitude: data.location.longitude
                }  
    }).then((res) => {
      if (res.data) {
        Alert.alert(`Información enviada correctamente, el id de usuario es: ${res.data.id}` )
      }
    }).catch(error => {
      Alert.alert('error al enviar la información')
  })
  }

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ 
          name: '',
          lastName: '',
          email: '',
        }}
        onSubmit={(values, {resetForm}) => {
          const newDate = date.toISOString().slice(0, 10)
          const data = {
            name: values.name,
            lastName: values.lastName,
            birthdate: newDate,
            location: {
              latitude: position.latitude,
              longitude: position.longitude
            }
          }
          handleSubmit(data)
          resetForm();
        }}
        validationSchema={yup.object().shape({
          name: yup
            .string()
            .required('Por favor ingrese su nombre'),
          lastName: yup
            .string()
            .required('Por favor ingrese su apellido'),
          email: yup
            .string("email")
            .required('Email es requerido')
            .email('Direccion de email inválida')
        })}
       >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
          <View>
          <TextInput
            value={values.name}
            style={styles.inputStyle}
            onChangeText={handleChange('name')}
            onBlur={() => setFieldTouched('name')}
            placeholder='Nombre'

          />
          {touched.name && errors.name &&
            <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.name}</Text>
          }
          <TextInput
            value={values.lastName}
            style={styles.inputStyle}
            onChangeText={handleChange('lastName')}
            onBlur={() => setFieldTouched('lastName')}
            placeholder='Apellido'

          />
          {touched.lastName && errors.lastName &&
            <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.lastName}</Text>
          }             
          <TextInput
            value={values.email}
            style={styles.inputStyle}
            mode="outlined"
            onChangeText={handleChange('email')}
            placeholder="Correo"
            onBlur={() => setFieldTouched('email')}
          />
          {touched.email && errors.email &&
            <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.email}</Text>
          }
          <Text style={styles.text}>Fecha de Nacimiento</Text>
          <DatePicker
            date={date}
            locale='es'
            onDateChange={setDate}
            androidVariant="nativeAndroid"
            mode="date"
          />
          <Button
            color="#3740FE"
            title='Guardar'
            disabled={!isValid}
            onPress={handleSubmit}
          />
        </View>
      )}
    </Formik>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    height: 40,
    minWidth: '70%',
    margin: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  text: {
    alignItems: 'flex-start',
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
  },
  image: {
    height: 50,
    width: 50,
  },
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  }
});
