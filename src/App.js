import './App.css';
import Header from "./componentes/header/Header";
import Footer from "./componentes/footer/Footer";
import Main from "./componentes/main/Main";
import {ScrollTop} from "primereact/scrolltop";

function App() {
  return (
    <div className="App">
      <Header/>
      <Main/>
      <Footer/>
      <ScrollTop/>
    </div>
  );
}

export default App;
