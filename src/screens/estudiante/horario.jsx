import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/es';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGruposByEstudiante } from '../../services/grupoCursoService';

export function HorarioScreen() {
  const [eventosTotales, setEventosTotales] = useState([]); 
  const [horario, setHorario] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        setIsLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          Alert.alert('Error', 'No se pudo obtener el ID del usuario.');
          setIsLoading(false);
          return;
        }

        const response = await getGruposByEstudiante(userId);
        if (!response || response.length === 0) {
          Alert.alert('Aviso', 'No se encontraron grupos para este estudiante.');
          setIsLoading(false);
          return;
        }

        const formattedData = formatHorarioData(response);
        setEventosTotales(formattedData); // Guardamos todos los eventos
        actualizarHorario(formattedData, selectedDate); // Filtramos los eventos del día actual
      } catch (error) {
        console.error('Error obteniendo el horario:', error);
        Alert.alert('Error', 'No se pudo cargar el horario.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHorario();
  }, []);

  useEffect(() => {
    actualizarHorario(eventosTotales, selectedDate);
  }, [selectedDate]); 

  const daysMapping = {
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Jueves': 4,
    'Viernes': 5,
  };

  const formatHorarioData = (data) => {
    let eventos = [];

    data.forEach((grupo) => {
      const formatTime = (hour, minute) => `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

      const [horaInicioH, horaInicioM] = grupo.horaInicio.split(":").map(Number);
      const [horaFinH, horaFinM] = grupo.horaFin.split(":").map(Number);

      [grupo.dia1, grupo.dia2].filter(Boolean).forEach((dia) => {
        if (!daysMapping[dia]) {
          return;
        }

        const diaSemana = daysMapping[dia];
        const fecha = moment().startOf('isoWeek').add(diaSemana - 1, 'days').format('YYYY-MM-DD');

        eventos.push({
          fecha,
          name: `Clase de ${grupo.curso.nombre}`,
          startTime: formatTime(horaInicioH, horaInicioM),
          endTime: formatTime(horaFinH, horaFinM),
          location: `Grupo ${grupo.seccion.grupo} - Nivel ${grupo.seccion.nivel}`,
        });
      });
    });

    return eventos;
  };


  const actualizarHorario = (eventos, fechaSeleccionada) => {
    const eventosDelDia = eventos.filter(evento => evento.fecha === fechaSeleccionada);
    const eventosFormateados = { [fechaSeleccionada]: eventosDelDia };
    setHorario(eventosFormateados);
  };

  const renderItem = (item) => (
    <View style={styles.eventContainer}>
      <Text style={styles.eventTitle}>{item.name}</Text>
      <Text style={styles.eventTime}>{item.startTime} - {item.endTime}</Text>
      <Text style={styles.eventLocation}>{item.location}</Text>
    </View>
  );

  const renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      <Text>No hay clases programadas</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <Agenda
          items={horario}
          selected={selectedDate}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          renderItem={renderItem}
          renderEmptyDate={renderEmptyDate}
          hideKnob={true}
          showClosingKnob={false}
          theme={{
            selectedDayBackgroundColor: '#2563eb',
            todayTextColor: '#2563eb',
            dotColor: '#2563eb',
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  eventContainer: {
    backgroundColor: '#2563eb',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTime: {
    color: '#fff',
    fontSize: 14,
  },
  eventLocation: {
    color: '#fff',
    fontSize: 12,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 45,
  },
});

export default HorarioScreen;
