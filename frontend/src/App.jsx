import { Routes,Route } from 'react-router-dom'
import './App.css'
import Home from '/pages/Home'
import NotFound from '/pages/NotFound'
import Navbar from '/components/Navbar'
import Header from '/components/Header'
import Footer from '/components/Footer'
import Login from '/pages/Login'
import Groups from '/pages/Groups'
import MovieTestPage from '../pages/Movie_test_page'
import MovieSearch from '../pages/Search'
import Registration from '../pages/Registration'

function App() {

  return (
    <>
      <Navbar />
      <Header />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/groups" exact element={<Groups />} />
        <Route path="/movietestpage" exact element={<MovieTestPage />} />
        <Route path="/search" exact element={<MovieSearch />} />
        <Route path="/*" exact element={<NotFound />} />
        <Route path="/registration" exact element={<Registration />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
