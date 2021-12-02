import { Row, Col, Button, Range, BlockTitle } from 'framework7-react';
import { useState, useContext } from 'react';
import { ModelCtx } from '../../Context';
import SimpleChart from '../SimpleChart';
import PatternSelector from './PatternSelector';
import ResultsProfile from './ResultsProfile';


const SectionProfile = props => {

    const model = useContext(ModelCtx);

    const [work_width, setWorkWidth] = useState(model.work_width || 1);
    const [work_pattern, setWorkPattern] = useState(model.pattern || "circular");

    console.log(props);

    const index = props.outputs[work_pattern].findIndex(v => Math.abs(v.work_width-work_width) < 0.01);
    const results = props.outputs[work_pattern][index];

    // Configuracion del grafico del perfil
    const profile_chart_config = { 
        type: "line",
        title: "",
        height: "60%",
        yaxis: "Peso (gr.)",
        tooltip_prepend: "",
        tooltip_append: " gr",
        categories: Object.keys(results.profile).map(v=>parseInt(v)+1),
        series:[{
            name: "Peso aplicado",
            showInLegend: false, 
            data: results.profile,
            color: "rgb(50,250,50)"
        }]
    };

    return (
        <>
            <PatternSelector pattern={work_pattern} onChange={v => setWorkPattern(v)}/>
            <ResultsProfile results={results} expected_dose={model.expected_dose} computed_dose={model.computed_dose}/>
            <Row>
                <Col>
                    <SimpleChart id="profile_plot" config={profile_chart_config} />
                </Col>
            </Row>
            <Row style={{marginTop:10, marginBottom:30}}>
                <BlockTitle>Ancho de labor: {work_width} mts.</BlockTitle>
                <Range
                    min={props.outputs.ww_range.min}
                    max={props.outputs.ww_range.max}
                    label={true}
                    step={1}
                    defaultValue={work_width}
                    scaleSteps={props.outputs.ww_range.steps}
                    scaleSubSteps={3}                    
                    onRangeChange={v=>setWorkWidth(v)}
                />
            </Row>
            <Row style={{marginTop:20}}>
                <Col width={20}></Col>
                <Col width={60}>
                    <Button fill style={{textTransform:"none"}}>Agregar a reporte</Button>
                </Col>
                <Col width={20}></Col>
            </Row>
        </>
    );
};

export default SectionProfile;