import React from 'react';
import { StyleSheet, SafeAreaView, View, TextInput, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {primary: 'blue', white: '#ccd9ff'};

const TodoApp = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');

  React.useEffect(() => {
    getfromlocal();
  }, []);

  React.useEffect(() => {
    savetolocal(todos);
  }, [todos]);

  const addTodolist = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Please enter any task first');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };


  const getfromlocal = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  
   const savetolocal = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = todoId => {
    const newTodosItem = todos.map(item => {
      if (item.id == todoId) {
        return {...item, completed: true};
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const deleteTodolist = todoId => {
    const newTodosItem = todos.filter(item => item.id != todoId);
    setTodos(newTodosItem);
  };

  const clearAllTodoslist = () => {
    Alert.alert('Confirm', 'You Want To Clear Todo list?', [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
      {
        text: 'No',
      },
    ]);
  };

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
            <View style={[styles.actionIcon, {backgroundColor: 'green'}]}>
              <Icon name="done" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodolist(todo.id)}>
          <View style={styles.actionIcon}>
            <Icon name="delete" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 25,
            textAlign: 'center',
            color: COLORS.primary,
            
          }}>
          Todo
        </Text>
        <Icon name="delete" size={25} color="red" onPress={clearAllTodoslist} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            placeholder="Add Todo task"
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodolist}>
          <View style={styles.iconContainer}>
            <Icon name="add" color="white" size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default TodoApp;

const styles = StyleSheet.create({
	
header: {
	flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 70,
  },
 
  inputContainer: {
	backgroundColor: COLORS.white,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
  },
  iconContainer: {
	elevation: 38,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,

  },

  listItem: {
	flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
    padding: 18,
    backgroundColor: COLORS.silver,
 
  },
  actionIcon: {
	justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginLeft: 5,
    borderRadius: 3,
    height: 25,
    width: 25,
    backgroundColor: COLORS.white,

  },
  
 footer: {
	flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.silver,
    position: 'absolute',
    bottom: 0,
    width: '100%',

  },
});