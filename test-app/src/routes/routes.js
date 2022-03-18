const {Router, json} = require('express');
const router = Router();

const alumnos = require('./data.json');

router.get('/', (req,res) => {
    res.json(alumnos)
});

router.get('/mensual/:alumno/:mes', (req,res) => {
    const {alumno, mes} = req.params;
    let inasistenciasM = 0;
    let tareasM = 0;
    let participacionesM = 0;

    function loop() {
        alumnos.forEach(element => {
            if(element.alumno == alumno){
                var fechaAux = new Date(element.fecha);
                var monthOfDate = fechaAux.getMonth()
                if(monthOfDate == mes-1){
                    if(element.tipo=="inasistencias"){
                        inasistenciasM += parseInt(element.valor);
                    }
                    if(element.tipo=="tareas"){
                        tareasM += parseInt(element.valor);
                    }
                    if(element.tipo=="participacionesnegativas"){
                        participacionesM += parseInt(element.valor);
                    }
                    data = element;
                }                
            }
        });
        return Promise.resolve("Success");
    }
    loop().then(
    (message) => {
        const res2send = {
            "matricula": alumno,
            "inasistencias": inasistenciasM.toString(),
            "tareas faltantes": tareasM.toString(),
            "participaciones negativas": participacionesM.toString()
        }
        res.json(res2send)
    }
    )
});

router.get('/rango-de-fechas/:fechainicio/:fechafinal', (req,res) => {
    var {fechainicio, fechafinal} = req.params;
    let inasistenciasM = 0;
    let tareasM = 0;
    let participacionesM = 0;

    fechainicio = new Date(fechainicio)
    fechafinal = new Date(fechafinal)
    var res2send = [];

    function loop() {
        alumnos.forEach(element => {
            var fechaAux = new Date(element.fecha)
            if(fechaAux>fechainicio && fechaAux<fechafinal){
                console.log(fechaAux)
                res2send.push(element)
            }
        });
        return Promise.resolve("Success");
    }
    loop().then(
    (message) => {
        res.json(res2send)
    }
    )
});

router.post('/postear', (req,res) => {
    const {alumno, salon, tipo, valor, fecha} = req.body;

    const res2send = {
        "matricula":alumno,
        "salon":salon,
        "tipo":tipo,
        "valor":valor,
        "fecha":fecha
    }
    alumnos.push(res2send)
    res.json(alumnos)
    
});

// Export until END
module.exports = router;