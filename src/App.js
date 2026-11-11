import { useState } from 'react'
import patients from './data/patients.json'
import SearchBar from './components/SearchBar'
import PatientList from './components/PatientList'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main style={{ margin: '40px', padding: '0 16px' }}>
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <PatientList patients={filteredPatients} />
    </main>
  )
}

export default App