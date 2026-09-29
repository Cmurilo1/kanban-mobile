import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = '@kanban_cmdev_v1';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Carregar ao abrir
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(JSON.parse(saved));
      else setTasks([
        { id: '1', title: 'Criar layout', status: 'todo' },
        { id: '2', title: 'Fazer login', status: 'doing' },
        { id: '3', title: 'Deploy na Vercel', status: 'done' },
      ]);
    })();
  }, []);

  // Salvar sempre que mudar
  useEffect(() => {
    if(tasks.length > 0) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if(!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), title: newTask.trim(), status: 'todo' }]);
    setNewTask('');
  }

  const moveTask = (id, dir) => {
    setTasks(prev => prev.map(t => {
      if(t.id!== id) return t;
      if(dir === 'next') return {...t, status: t.status === 'todo'? 'doing' : 'done' }
      else return {...t, status: t.status === 'done'? 'doing' : 'todo' }
    }));
  }

  const deleteTask = (id) => {
    Alert.alert('Apagar?', 'Tem certeza que quer apagar?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: () => setTasks(prev => prev.filter(t => t.id!== id)) }
    ]);
  }

  const clearAll = () => {
    Alert.alert('Limpar tudo?', 'Apagar todas as tarefas?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: async () => {
        setTasks([]);
        await AsyncStorage.removeItem(STORAGE_KEY);
      }}
    ]);
  }

  const Column = ({ title, status, color }) => (
    <View style={[styles.column, { borderTopColor: color }]}>
      <Text style={styles.columnTitle}>{title} ({tasks.filter(t=>t.status===status).length})</Text>
      {tasks.filter(t=>t.status===status).map(item => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardText}>{item.title}</Text>
          <View style={styles.actions}>
            <View style={styles.row}>
              {status!== 'todo' && (
                <TouchableOpacity style={styles.btnSmall} onPress={()=>moveTask(item.id, 'prev')}>
                  <Text style={styles.btnSmallText}>◀ VOLTAR</Text>
                </TouchableOpacity>
              )}
              {status!== 'done' && (
                <TouchableOpacity style={[styles.btnSmall, styles.btnBlack]} onPress={()=>moveTask(item.id, 'next')}>
                  <Text style={[styles.btnSmallText, {color:'#fff'}]}>AVANÇAR ▶</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={()=>deleteTask(item.id)}>
              <Text style={styles.deleteText}>🗑️ Apagar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {tasks.filter(t=>t.status===status).length === 0 && (
        <Text style={styles.empty}>Vazio - arrasta pra cá</Text>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Kanban Mobile - cmdev</Text>
        <TouchableOpacity onPress={clearAll}><Text style={styles.clearText}>Limpar</Text></TouchableOpacity>
      </View>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Nova tarefa..." value={newTask} onChangeText={setNewTask} onSubmitEditing={addTask} />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}><Text style={{color:'#fff', fontSize:26, fontWeight:'bold'}}>+</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.board}>
          <Column title="A Fazer" status="todo" color="#ff5a5f" />
          <Column title="Fazendo" status="doing" color="#ffb400" />
          <Column title="Feito" status="done" color="#00c950" />
        </View>
      </ScrollView>
      <Text style={styles.footer}>Salvamento automático ativado ✅</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f5f5f5', padding:10, paddingTop:50 },
  headerRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  header: { fontSize:21, fontWeight:'bold' },
  clearText: { color:'#888', fontSize:13 },
  inputRow: { flexDirection:'row', marginBottom:12 },
  input: { flex:1, backgroundColor:'#fff', padding:14, borderRadius:12, marginRight:8, fontSize:16, elevation:2 },
  addBtn: { backgroundColor:'#000', width:56, borderRadius:12, alignItems:'center', justifyContent:'center' },
  board: { flexDirection:'row', gap:12, paddingRight:20 },
  column: { width:285, backgroundColor:'#fff', borderRadius:14, padding:12, borderTopWidth:5, minHeight:420, elevation:3 },
  columnTitle: { fontWeight:'bold', marginBottom:10, fontSize:17 },
  card: { backgroundColor:'#f3f3f3', padding:12, borderRadius:12, marginBottom:12 },
  cardText: { fontSize:15, marginBottom:10, fontWeight:'500' },
  actions: { gap:8 },
  row: { flexDirection:'row', gap:8 },
  btnSmall: { backgroundColor:'#e0e0e0', padding:10, borderRadius:8, flex:1, alignItems:'center' },
  btnBlack: { backgroundColor:'#000' },
  btnSmallText: { fontWeight:'bold', fontSize:11 },
  deleteBtn: { backgroundColor:'#ffe5e5', padding:8, borderRadius:8, alignItems:'center' },
  deleteText: { color:'#d00', fontWeight:'bold', fontSize:12 },
  empty: { color:'#aaa', textAlign:'center', marginTop:20, fontStyle:'italic' },
  footer: { textAlign:'center', color:'#888', marginTop:8, fontSize:12 }
});