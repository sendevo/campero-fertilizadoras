import { List, Block, BlockTitle, Card, Row, Col, Button } from 'framework7-react';
import { FaArrowCircleLeft, FaArrowCircleRight, FaStopCircle } from 'react-icons/fa';
import { useState, useContext } from 'react';
import CustomInput from '../Inputs';
import openCollectedPrompt from '../Prompts';
import Toast from '../Toast';
import { ModelCtx } from '../../Context';
import SimpleChart from '../SimpleChart';
import SectionProfile from './SectionProfile';
import iconTrayDist from '../../img/icons/dist_bandejas.png';
import iconTrayNum from '../../img/icons/cant_bandejas.png';
import iconTrayArea from '../../img/icons/sup_bandeja.png';
import iconPassNumber from '../../img/icons/cant_pasadas.png';
import api from '../../Api';

const SectionDistr = props => {

    const model = useContext(ModelCtx);

    // Campos del formulario de muestreo
    const [inputs, setInputs] = useState({
        tray_area: model.tray_area || 0,
        tray_distance: model.tray_distance || 0,
        pass_number: model.pass_number || 0
    });

    // Lista de peso de bandejas
    const [trayArray, setTrayArray] = useState([]);

    // Mostrar/ocultar bloque de resultados de perfil medido
    const [results, setResults] = useState(false);

    const updateInput = (name, value) => {        
        // Parseo input
        const update = {};
        update[name] = parseFloat(value);
        if( isNaN(update[name]) )
            update[name] = 0;
        model[name] = update[name];
        setInputs({...inputs, ...update});        
        setResults(false);
    };

    const setNumTrays = n => { 
        // Configurar cantidad de bandejas y actualizar tabla
        if(n >= 0 && n < 100){
            let tempArr = [];
            for(let idx = 0; idx < n; idx++){
                // Posiciones de las bandejas Izquierda - Centro - Derecha
                const side = idx === (n-1)/2 ? "middle" : (idx < n/2 ? "left" : "right");                
                tempArr.push({                    
                    side: side,
                    collected: 0,
                });
            }
            model.tray_number = n;
            setTrayArray(tempArr);            
            setResults(false);
        }
    };

    const addCollected = (row, value) => { 
        // Callback prompt
        let tempArr = [...trayArray];
        tempArr[row].collected = value;
        setTrayArray(tempArr);
        setResults(false);
    };

    const getTrayArray = () => trayArray.map(tr=>tr.collected);

    const submit = () => { 
        // Pasar datos al modelo y habilitar resultados
        model.tray_data = getTrayArray();  
        setResults(true);
    };

    const densityFromRecolected = value => {
        const res = api.computeDensityFromRecolected({
            recolected: model.recolected,
            pass_number: model.pass_number,
            tray_area: model.tray_area
        });
        return res.density;
    };

    const collected_chart_config = { // Configuracion del grafico de datos medidos
        type: "line",
        title: "Distribución medida",
        yaxis: "Peso (Kg/ha.)",
        tooltip_prepend: "Bandeja ",
        tooltip_append: " gr",
        label_formatter: densityFromRecolected,
        categories: Object.keys(getTrayArray()).map(v=>parseInt(v)+1),
        series:[{           
            name: "Peso recolectado",
            showInLegend: false, 
            data: getTrayArray(),
            color: "rgb(50,50,250)"
        }]
    };

    return (
        <Block>
            <BlockTitle>Distribución y ancho de labor</BlockTitle>
            <List form noHairlinesMd style={{marginBottom:"10px"}}>
                <CustomInput
                    slot="list"
                    icon={iconTrayArea}
                    label="Superf. de bandeja"
                    type="number"
                    unit="m²"                    
                    defaultValue={inputs.tray_area || ''}
                    onChange={v=>updateInput("tray_area", v.target.value)}
                    ></CustomInput>
                <CustomInput
                    slot="list"
                    icon={iconTrayDist}
                    label="Dist. entre bandejas"
                    type="number"
                    unit="m"
                    defaultValue={inputs.tray_distance || ''}
                    onChange={v=>updateInput("tray_distance", v.target.value)}
                    ></CustomInput>
                <CustomInput
                    slot="list"
                    icon={iconTrayNum}
                    label="Cantidad de bandejas"
                    type="number"                    
                    onChange={v=>setNumTrays(parseInt(v.target.value))}
                    ></CustomInput>
                <CustomInput
                    slot="list"
                    icon={iconPassNumber}
                    label="Cantidad de pasadas"
                    min={0}
                    type="number"
                    defaultValue={inputs.pass_number || ''}
                    onChange={v=>updateInput("pass_number", v.target.value)}
                    ></CustomInput>
            </List>
            {
                trayArray.length > 0 ?
                <Card>
                    <div>
                        <table className="data-table" style={{textAlign:"center", minWidth:"0px", tableLayout:"fixed"}} >
                            <thead style={{backgroundColor:"rgb(200,200,200)"}}>
                                <tr style={{maxHeight:"40px!important"}}>
                                    <th className="label-cell">Bandeja</th>
                                    <th className="label-cell">Lado</th>
                                    <th className="label-cell"><div>Peso</div><div>recolectado</div></th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div style={{maxHeight:"300px",overflow: "auto"}}>
                        <table className="data-table" style={{textAlign:"center", minWidth:"0px", tableLayout:"fixed"}} >                        
                            <tbody style={{maxHeight:"300px",overflow: "auto"}}>
                                {
                                    trayArray.map((tr,idx) => (
                                        <tr key={idx} onClick={()=>openCollectedPrompt(idx, tr.side, addCollected)}>
                                            <td>{idx+1}</td>
                                            <td className="label-cell">
                                            {
                                                tr.side==="middle"?
                                                <FaStopCircle size={20}/>
                                                :
                                                tr.side==="left"?
                                                <FaArrowCircleLeft size={20}/>
                                                :
                                                <FaArrowCircleRight size={20}/>
                                            }
                                            </td>
                                            <td className="numeric-cell">{tr.collected.toFixed(2)} gr</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Card>
                :
                <div style={{textAlign:"center", color:"rgb(150,150,150)"}}>
                    <p>Ingrese la cantidad de bandejas</p>
                </div>
            }
            { trayArray.length > 0 && !results ?
                <>
                    <Row>
                        <Col>
                            <SimpleChart id="collected_plot" config={collected_chart_config} />
                        </Col>
                    </Row>
                    <Row>
                        <Col width={20}></Col>
                        <Col width={60}>
                            <Button onClick={submit} fill style={{textTransform:"none"}}>Calcular perfil</Button>
                        </Col>
                        <Col width={20}></Col>
                    </Row>
                </>
            :
                null
            }
            {results ?
                <SectionProfile hideResults={()=>setResults(false)}/>
            :
                null
            }
        </Block>
    );
};

export default SectionDistr;