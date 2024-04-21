import { showRow } from './Utils.jsx'

export function FrontPage({ rows, date, time }) {
    const dayLightSaving = 22;
    
    return (
        <div className='d-flex justify-content-start flex-row' >
            <h1>Wind Tarifa</h1>
            <p>{date}</p>
            <br></br>
            {rows[date] &&
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', margin: '0px 10px' }}>
                    {
                        [...Array(Math.min(2, dayLightSaving - time))].map((_, i) =>
                            <div key={i}>
                                {showRow(rows[date][time + i])}
                            </div>
                        )
                    }
                </div>
            }
        </div>
    )
}
