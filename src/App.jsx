import { useState, useRef, useEffect } from 'react'

function idGen() {
  let id = new Date().getTime()
  let num = Math.floor((10 + (10) * Math.random()))
  return (id + num)
}

function App() {
  const inputRef = useRef()
  const [todo, setTodo] = useState("")
  const [TodoList, setTodoList] = useState([])
  const [finishList, setFinishList] = useState([])
  const [oldList, setOldList] = useState([])
  const [allRid, setAllRid] = useState([])
  const [RidList, setRidList] = useState([])

  useEffect(() => {
    if (localStorage.getItem('todos')) {
      let newTodoList = JSON.parse(localStorage.getItem('todos'))
      setTodoList(newTodoList)
    }
    if (localStorage.getItem('finish')) {
      let newFinishList = JSON.parse(localStorage.getItem('finish'))
      setFinishList(newFinishList)
    }
    if (localStorage.getItem('RID')) {
      let newRidList = JSON.parse(localStorage.getItem('RID'))
      setRidList(newRidList)
    }
  }, [])

  // localStorage.clear()

  const handleClick = (e) => {

    let Rid = e.target.name  //received Id

    let i = TodoList.findIndex((e) => e.id == Rid)

    const newTodos = [...TodoList]
    newTodos[i].Done = !newTodos[i].Done
    setTodoList(newTodos)
    
    let finishArray = newTodos.filter((e) => e.Done == true)
    setFinishList(finishArray)
    
    saveToLS1(newTodos, 0, finishArray)
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleSave = () => {

    if (TodoList.some((item) => item.Name == todo)) {
      alert('This Todo already exist')
      setTodo('');
    }

    else if (todo) {
      let todoId = idGen()
      let Todo1 = { id: todoId, Name: todo, Done: false }
      setTodo('');

      let newTodos = [...TodoList, Todo1]
      setTodoList(newTodos)
      saveToLS1(newTodos, 0)
    }

    else {
      alert('Enter a Todo!')
    }
  }

  const handleEdit = (e) => {
    let id = e.target.name

    const obj = TodoList.filter((td) => td.id == id)
    let name = obj[0].Name

    if (inputRef.current) {
      setTodo(name);
    }

    let newTodos = TodoList.filter((item) => item.id != id)
    setTodoList(newTodos)

    let finishArray = newTodos.filter((e) => e.Done == true)
    setFinishList(finishArray)
    
    saveToLS1(newTodos, 1, finishArray)

    inputRef.current.focus()
  }

  const handleDelete = (e) => {
    let id = e.target.name

    let newTodos = TodoList.filter((item) => item.id != id)
    setTodoList(newTodos)

    let finishArr = newTodos.filter((item) => item.Done == true)
    setFinishList(finishArr)

    saveToLS1(newTodos, 1, finishArr)
  }

  const enterSave = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    }
    return
  }

  const saveToLS1 = (T_list, i, F_list) => {
    if (i == 0) {
      localStorage.setItem('todos', JSON.stringify(T_list))
    }
    if (i == 1) {
      localStorage.setItem('todos', JSON.stringify(T_list))
      localStorage.setItem('finish', JSON.stringify(F_list))
    }
  }

  const finishCheck = (e) => {
    if (e.target.checked) {
      storeList()
      setTodoList(finishList)
    }
    if (!e.target.checked) {
      let oldTodos = storeList()
      console.log(oldTodos)
      setTodoList(oldTodos)
    }
  }

  const storeList = () => {
    if (TodoList != finishList) {
      setOldList(TodoList)
    }
    else {
      return oldList
    }
  }

  return (
    <>
      {/* NAVBAR */}
      <div className='bg-slate-900 text-white px-60 py-2 flex justify-between sticky top-0 z-50'>
        <div className="logo">
          <span className='text-xl font-bold'>iTask</span>
        </div>

        <div>
          <ul className='flex justify-between gap-8'>
            <li>Home</li>
            <li>Your Todos</li>
          </ul>
        </div>
      </div>

      {/* UPPER BODY */}
      <div className='overflow-auto '>
        <div className="bg-violet-100 mx-96 my-6 rounded-lg p-4 font-bold h-fit ">
          <div className=''>

            <div className="contain min-w-fit">
              <div className="header w-full">
                <div className='text-2xl mx-auto max-w-fit'>iTASK - Manage your tasks at one place</div>
              </div>
              <div className="subheader my-2">
                <span className='text-xl'>Add a Todo</span>
              </div>

              {/* KHOJO */}

              <div className='flex gap-4 items-center w-full justify-around'>

                <div className='w-full my-2'>
                  <input className='w-full rounded-3xl h-10 font-normal p-2' onKeyDown={(e) => { enterSave(e) }} onChange={handleChange} ref={inputRef} value={todo} type="text" placeholder='Enter your Todo' />
                </div>
                <div>
                  <button className='bg-violet-500 border-none rounded-3xl text-white px-4 text-2xl text-center h-10 font-bold' onClick={handleSave}>Save</button>
                </div>
              </div>
            </div>

            <div>

              {/* FINISH BOX */}

              <div className='my-3 font-normal flex items-center gap-1'>
                <input name='finishTodos' id='finishTodos' type="checkbox" onClick={(e) => finishCheck(e)} />
                <label htmlFor='finishTodos'>Finished Todos</label>
              </div>
            </div>
          </div>

          {/* LOWER-BODY */}

          <div className='border-t-2 border-gray-600'>
            <div className='text-xl font-bold'>
              Your Todos
            </div>

            {TodoList.map((item, index) => {
              return (
                <div id='todo-box' key={index} className='font-normal flex justify-between mt-2'>
                  {/* TodoList */}

                  <div className='flex items-center font-normal gap-3'>

                    {/* <input type="checkbox" name={item.id} className='cursor-pointer' onChange={(e) => handleClick(e)}/> */}
                    {item.Done ? <input type="checkbox" name={item.id} className='cursor-pointer' onChange={(e) => handleClick(e)} checked /> : <input type="checkbox" name={item.id} className='cursor-pointer' onChange={(e) => handleClick(e)} />}

                    <div className={item.Done ? "line-through text-gray-500  cursor-pointer break-words whitespace-normal max-w-[550px]" : "cursor-pointer break-words whitespace-normal max-w-[550px]"}>{item.Name}</div>
                  </div>

                  {/* TodoButtons */}
                  <div>
                    <div id="buttons" className='flex gap-2 text-white'>
                      <div>
                        <button onClick={(e) => handleEdit(e)} name={item.id} className='bg-violet-500 rounded-xl px-3 text-center h-8'>
                          edit
                        </button></div>
                      <div><button name={item.id} onClick={(e) => handleDelete(e)} className='bg-violet-500 rounded-xl px-3 h-8'>Remove</button></div>
                    </div>
                  </div>
                </div>)
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default App

/*{
BEFORE FINISHTODOS
  REMOVE  1
  EDIT    1

AFTER FINISHTODOS
  REMOVE
  EDIT

}*/