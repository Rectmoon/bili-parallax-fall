import './App.css'
import Banner from './components/Banner'
import fullview from './assets/fullview.png'

function App () {
  return (
    <div className='App'>
      <Banner />
      <img src={fullview} alt='full-background' className='full-view' />
    </div>
  )
}

export default App
