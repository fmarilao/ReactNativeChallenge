import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Image, Text, View, TextInput, Button } from 'react-native';
import { Formik } from 'formik'
import * as yup from 'yup'
import DatePicker from 'react-native-date-picker'

export default function App() {
  const [date, setDate] = useState(new Date())
  console.log(date)

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ 
          name: '',
          email: '',
        }}
        onSubmit={(values, {resetForm}) => {
          console.log(values)
          console.log(date)
          // resetForm();
        }}
        validationSchema={yup.object().shape({
          name: yup
            .string()
            .required('Please, provide your name!'),
          email: yup
            .string("email")
            .required("email is required")
            .email("invalid email address")
        })}
       >
        {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
          <View>
          <TextInput
            value={values.name}
            style={styles.inputStyle}
            onChangeText={handleChange('name')}
            onBlur={() => setFieldTouched('name')}
            placeholder="Nombre"

          />
          {touched.name && errors.name &&
            <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.name}</Text>
          }            
          <TextInput
            value={values.message}
            style={styles.inputStyle}
            mode="outlined"
            onChangeText={handleChange('email')}
            placeholder="Correo"
            onBlur={() => setFieldTouched('email')}
          />
          {touched.message && errors.message &&
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
          <View style={styles.imgContainer}>
          <Image source={{uri: `http://simpleicon.com/wp-content/uploads/camera.png`}}
               style={styles.image}
           />
          </View>
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
