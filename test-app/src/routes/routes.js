const {Router} = require('express');
const router = Router();

const alumnos = require('./data.json');
//console.log(alumnos)

router.get('/', (req,res) => {
    res.json(alumnos)
});

router.get('/123', (req,res) => {
    const data = {
        "name": "TLOZ",
        "brand": "NINTENDO"
    }
    res.json(data)
});

router.get('/semanal/:alumno', (req,res) => {
    const {alumno} = req.params;
    alumnos.forEach(element => {
        if(element.alumno == alumno){
            console.log("es este");
            console.log(element.alumno);
            res.json(element)
        }
    });
});

router.post('/semanal', (req,res) => {
    const {alumno, inasistencias, tareas, participaciones} = req.body;
    if(alumno && inasistencias && tareas && participaciones){
        const newData = {...req.body};
        alumnos.push(newData);
        res.send(alumnos)
        //console.log(newData);
    }
    else{
        res.status(500).json({"error":"No Data"});
        res.send("Err32: No data");
    }
});

// Export until END
module.exports = router;