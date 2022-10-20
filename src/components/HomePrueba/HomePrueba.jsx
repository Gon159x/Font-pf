import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWorkers } from "../../redux/actions/actions";
import CarruselWorkersPremium from "../CarruselWorkersPremium/CarruselWorkersPremium";
import SearchBar from "../SearchBar/SearchBar";
import Filters from "../Filters/Filters";
import s from "./HomePrueba.module.css";
import CardsWorkers from "../CardsWorkers/CardsWorkers";
import Footer from "../Footer/Footer";
import Pagination from "@mui/material/Pagination";

export default function HomePrueba() {
  let workers = useSelector((worker) => worker.workers);
  let newWorkers = workers.filter((worker) => worker.User.isDeleted === false);
  const dispatch = useDispatch();

  newWorkers.sort(function (a, b) {
    if (a.premium === true) {
      return -1;
    } else if (a.premium !== true) {
      return 1;
    }
  });

  const [page, setPage] = useState(1);
  const [titles, setTitles] = useState(false);

  const lastIndex = page * 10;
  const firstIndex = lastIndex - 10; //0

  const numberPages = Math.ceil(newWorkers.length / 10);

  let currentWorkers = newWorkers.slice(firstIndex, lastIndex);

  const pagesNumber = (event, value) => {
    setPage(value);
  };

  const callbk = () => {
    setPage(1)
  }

  useEffect(() => {
    dispatch(getWorkers());
  }, []);

  setTimeout(() => {
    if (titles === false) {
      setTitles(true);
    }
  }, 200);

  return (
    <div className={s.home}>
      <div className={s.perfil}></div>
      <div className={s.container}>
        <div className={s.carrusel}>
          <CarruselWorkersPremium />
        </div>
        <div className={s.search}>
          <SearchBar callbk={callbk} />
        </div>
        <div className={s.filters}>
          <Filters callbk={callbk} />
        </div>
        <div className={s.pagination}>
          <Pagination
            defaultPage={1}
            color="primary"
            count={numberPages}
            page={page}
            onChange={pagesNumber}
            shape="rounded"
          />
        </div>
        <div className={titles ? s.divWorker : s.divWorkerHidden}>
          <div className={s.workers}>
            {currentWorkers.length ? (
              currentWorkers.map((worker,index) => {
                return (
                  <CardsWorkers
                    key={index}
                    id={worker.User.ID ? worker.User.ID:index}
                    name={worker.User.name ? worker.User.name:"Nombre invalido"}
                    lastName={worker.User.lastName ?worker.User.lastName : "Apellido invalido" }
                    job={worker.Jobs[0].name ? worker.Jobs[0].name : "Trabajo invalido"}
                    country={worker.User.Country ? worker.User.Country.name : "Nacionalidad invalida" }
                    city={worker.User.city ? worker.User.city : "Ciudad invalida"}
                    premium={worker.premium ? worker.premium :false}
                    img={worker.User.img ? worker.User.img : "invalido"}
                  />
                );
              })
            ) : (
              <div className={s.errormessage}>
                <h1>NO SE ENCONTRARON RESULTADOS COINCIDENTES</h1>
              </div>
            )}
          </div>
        </div>
        <div className={s.pagination}>
          <Pagination
            defaultPage={1}
            color="primary"
            count={numberPages}
            page={page}
            onChange={pagesNumber}
            shape="rounded"
          />
        </div>
        <div className={s.footer}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
